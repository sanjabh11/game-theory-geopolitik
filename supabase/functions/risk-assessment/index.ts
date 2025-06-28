import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RiskAssessmentRequest {
  regions: string[];
  timeframe: '30d' | '90d' | '1y';
  factors: string[];
}

interface RiskAssessmentResponse {
  assessments: Array<{
    region: string;
    riskScore: number;
    confidenceInterval: [number, number];
    primaryDrivers: Array<{
      factor: string;
      weight: number;
      trend: 'increasing' | 'stable' | 'decreasing';
    }>;
    scenarios: {
      best: { probability: number; description: string };
      worst: { probability: number; description: string };
      mostLikely: { probability: number; description: string };
    };
    lastUpdated: string;
  }>;
}

async function callGeminiAPI(prompt: string): Promise<string> {
  const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
  const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

  const request = {
    contents: [{
      parts: [{
        text: prompt
      }]
    }],
    generationConfig: {
      temperature: 0.3,
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

async function fetchLatestNews(regions: string[]): Promise<any[]> {
  // Mock news data - in production, integrate with real news APIs
  return regions.map(region => ({
    region,
    headlines: [
      `${region}: Political tensions rise`,
      `Economic indicators show volatility in ${region}`,
      `Security concerns in ${region} region`
    ],
    timestamp: new Date().toISOString()
  }))
}

async function fetchEconomicIndicators(regions: string[]): Promise<any[]> {
  // Mock economic data - in production, integrate with World Bank, IMF APIs
  return regions.map(region => ({
    region,
    gdpGrowth: (Math.random() - 0.5) * 10, // -5% to +5%
    inflation: Math.random() * 15, // 0% to 15%
    unemployment: Math.random() * 20, // 0% to 20%
    debtToGDP: 30 + Math.random() * 120, // 30% to 150%
    timestamp: new Date().toISOString()
  }))
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { regions, timeframe, factors }: RiskAssessmentRequest = await req.json()
    
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Fetch latest data sources
    const newsData = await fetchLatestNews(regions)
    const economicData = await fetchEconomicIndicators(regions)

    // Generate risk assessment with Gemini
    const riskPrompt = `
You are an Elite Geopolitical Risk Assessment AI. Generate comprehensive risk analysis for:

Regions: ${regions.join(', ')}
Timeframe: ${timeframe}
Factors: ${factors.join(', ')}

Recent News Data: ${JSON.stringify(newsData)}
Economic Indicators: ${JSON.stringify(economicData)}

For each region, provide:
1. Risk score (0-100) with confidence interval
2. Primary risk drivers with weights and trends
3. Best/worst/most likely scenarios with probabilities
4. Quantitative analysis with mathematical justification

Consider:
- Political stability and governance quality
- Economic indicators and fiscal health
- Social cohesion and demographic pressures
- Security environment and conflict potential
- External relationships and alliance structures

Return ONLY valid JSON:
{
  "assessments": [
    {
      "region": "string",
      "riskScore": "number 0-100",
      "confidenceInterval": [number, number],
      "primaryDrivers": [
        {
          "factor": "string",
          "weight": "number 0-1",
          "trend": "increasing" | "stable" | "decreasing"
        }
      ],
      "scenarios": {
        "best": {"probability": number, "description": "string"},
        "worst": {"probability": number, "description": "string"},
        "mostLikely": {"probability": number, "description": "string"}
      },
      "lastUpdated": "string - current ISO timestamp"
    }
  ]
}`

    const riskContent = await callGeminiAPI(riskPrompt)
    const riskAssessment: RiskAssessmentResponse = JSON.parse(riskContent)

    // Store assessments in database
    for (const assessment of riskAssessment.assessments) {
      const { error: insertError } = await supabase
        .from('risk_assessments')
        .insert({
          region: assessment.region,
          risk_score: assessment.riskScore,
          risk_level: assessment.riskScore >= 75 ? 'CRITICAL' : 
                     assessment.riskScore >= 50 ? 'HIGH' :
                     assessment.riskScore >= 25 ? 'MEDIUM' : 'LOW',
          factors: assessment.primaryDrivers,
          confidence_interval: assessment.confidenceInterval,
          trend: assessment.primaryDrivers[0]?.trend?.toUpperCase() || 'STABLE',
          source_data: { newsData, economicData },
          expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes
        })

      if (insertError) {
        console.error('Error storing risk assessment:', insertError)
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: riskAssessment,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in risk-assessment function:', error)
    
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