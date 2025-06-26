import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ScenarioActor {
  name: string;
  capabilities: {
    military: number;
    economic: number;
    diplomatic: number;
  };
  preferences: {
    riskTolerance: number;
    timeHorizon: 'short' | 'medium' | 'long';
  };
}

interface ScenarioConfig {
  actors: ScenarioActor[];
  scenario: {
    type: 'military_conflict' | 'trade_war' | 'diplomatic_crisis' | 'cyber_warfare' | 'economic_sanctions';
    parameters: Record<string, any>;
  };
  simulationSettings: {
    iterations: number;
    timeSteps: number;
  };
}

interface SimulationResults {
  equilibria: Array<{
    type: string;
    strategies: Record<string, any>;
    payoffs: Record<string, number>;
    stability: number;
  }>;
  outcomeDistribution: Array<{
    outcome: string;
    probability: number;
    description: string;
  }>;
  recommendations: Array<{
    actor: string;
    strategy: string;
    reasoning: string;
    confidence: number;
  }>;
  sensitivityAnalysis: Record<string, any>;
}

async function callGeminiAPI(prompt: string): Promise<string> {
  const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
  const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent'

  const request = {
    contents: [{
      parts: [{
        text: prompt
      }]
    }],
    generationConfig: {
      temperature: 0.2,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 4096,
      responseMimeType: 'application/json'
    }
  }

  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request)
  })

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`)
  }

  const data = await response.json()
  return data.candidates[0].content.parts[0].text
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const config: ScenarioConfig = await req.json()
    
    // Get user ID from Authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      throw new Error('Authentication failed')
    }

    // Create simulation record
    const { data: simulationData, error: createError } = await supabase
      .from('scenario_simulations')
      .insert({
        user_id: user.id,
        name: `${config.scenario.type} - ${new Date().toLocaleDateString()}`,
        scenario_type: config.scenario.type,
        scenario_config: config,
        status: 'running'
      })
      .select()
      .single()

    if (createError) {
      throw new Error(`Failed to create simulation: ${createError.message}`)
    }

    // Generate simulation with Gemini
    const simulationPrompt = `
You are a Strategic Scenario Simulation AI. Analyze this geopolitical scenario:

Scenario Type: ${config.scenario.type}
Actors: ${JSON.stringify(config.actors)}
Parameters: ${JSON.stringify(config.scenario.parameters)}
Simulation Settings: ${JSON.stringify(config.simulationSettings)}

Perform comprehensive game-theoretic analysis:
1. Identify all possible strategies for each actor
2. Calculate Nash equilibria and stability measures
3. Determine outcome probabilities using Monte Carlo simulation
4. Provide strategic recommendations with confidence levels
5. Conduct sensitivity analysis for key parameters

Use established game theory frameworks:
- Nash Equilibrium analysis
- Dominant strategy elimination
- Backward induction for sequential games
- Mixed strategy calculations where appropriate

Return ONLY valid JSON:
{
  "equilibria": [
    {
      "type": "string - type of equilibrium",
      "strategies": {"actor": "strategy"},
      "payoffs": {"actor": number},
      "stability": "number 0-1"
    }
  ],
  "outcomeDistribution": [
    {
      "outcome": "string",
      "probability": "number 0-1",
      "description": "string"
    }
  ],
  "recommendations": [
    {
      "actor": "string",
      "strategy": "string",
      "reasoning": "string",
      "confidence": "number 0-1"
    }
  ],
  "sensitivityAnalysis": {
    "keyParameters": ["string"],
    "robustness": "number 0-1",
    "criticalThresholds": {"parameter": number}
  }
}`

    const simulationContent = await callGeminiAPI(simulationPrompt)
    const simulationResults: SimulationResults = JSON.parse(simulationContent)

    // Update simulation with results
    const { error: updateError } = await supabase
      .from('scenario_simulations')
      .update({
        results: simulationResults,
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', simulationData.id)

    if (updateError) {
      console.error('Error updating simulation:', updateError)
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          simulationId: simulationData.id,
          results: simulationResults
        },
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in scenario-simulation function:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
