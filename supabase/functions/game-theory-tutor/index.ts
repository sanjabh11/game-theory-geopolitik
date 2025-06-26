import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TutorialRequest {
  level: 'basic' | 'intermediate' | 'advanced';
  topic: string;
  userProgress: {
    completedModules: string[];
    currentScore: number;
  };
}

interface TutorialResponse {
  concept: string;
  explanation: string;
  geopoliticalExample: string;
  interactiveElement: {
    type: 'scenario' | 'calculation' | 'game_tree';
    data: any;
  };
  assessmentQuestion: {
    question: string;
    options: string[];
    correctAnswer: number;
  };
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
      temperature: 0.8,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 4096,
      responseMimeType: 'application/json'
    },
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
      }
    ]
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
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { level, topic, userProgress }: TutorialRequest = await req.json()
    
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

    // Generate tutorial with Gemini
    const tutorialPrompt = `
You are an expert Game Theory Tutor AI specialized in teaching strategic decision-making concepts to students.

Generate a comprehensive game theory tutorial based on:
- Level: ${level}
- Topic: ${topic}
- User Progress: ${JSON.stringify(userProgress)}

Provide a tutorial with:
1. Clear concept explanation appropriate for ${level} level
2. Real geopolitical example demonstrating the concept
3. Interactive element (scenario, calculation, or game tree)
4. Assessment question with multiple choice options

Requirements:
- Tailor difficulty to ${level} level
- Use concrete geopolitical examples (trade wars, diplomatic negotiations, military conflicts)
- Create engaging interactive elements that reinforce learning
- Assessment should test understanding, not memorization

Return ONLY valid JSON matching this exact structure:
{
  "concept": "string - name of the game theory concept",
  "explanation": "string - detailed explanation appropriate for level",
  "geopoliticalExample": "string - real-world geopolitical scenario demonstrating concept",
  "interactiveElement": {
    "type": "scenario" | "calculation" | "game_tree",
    "data": {
      "scenario": "string - if type is scenario",
      "question": "string - interactive question",
      "options": ["array of options if applicable"],
      "matrix": "object - if type is calculation or game_tree"
    }
  },
  "assessmentQuestion": {
    "question": "string - assessment question",
    "options": ["string array - 4 multiple choice options"],
    "correctAnswer": "number - index of correct answer (0-3)"
  }
}`

    const tutorialContent = await callGeminiAPI(tutorialPrompt)
    const parsedContent: TutorialResponse = JSON.parse(tutorialContent)

    // Store progress in database
    const { error: progressError } = await supabase
      .from('learning_progress')
      .upsert({
        user_id: user.id,
        module_id: `${level}_${topic}`,
        module_name: `${level.charAt(0).toUpperCase() + level.slice(1)} ${topic}`,
        last_accessed: new Date().toISOString(),
        performance_data: { 
          userProgress,
          tutorialGenerated: true,
          timestamp: new Date().toISOString()
        }
      })

    if (progressError) {
      console.error('Error storing progress:', progressError)
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: parsedContent,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in game-theory-tutor function:', error)
    
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
