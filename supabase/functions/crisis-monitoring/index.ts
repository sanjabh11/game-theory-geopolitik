import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AlertConfig {
  userId: string;
  criteria: {
    regions: string[];
    severity: number;
    eventTypes: string[];
    keywords: string[];
  };
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
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
      maxOutputTokens: 3072,
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

async function fetchLatestGlobalNews(): Promise<any[]> {
  // Mock news data - in production, integrate with real news APIs
  const currentTime = new Date().toISOString()
  
  return [
    {
      title: "Military Exercise Announced in Eastern Europe",
      description: "Large-scale military exercises planned involving multiple NATO countries",
      source: "Reuters",
      timestamp: currentTime,
      region: "Eastern Europe",
      keywords: ["military", "NATO", "exercise", "security"]
    },
    {
      title: "Trade Tensions Escalate Between Major Powers",
      description: "New tariffs announced affecting multiple sectors",
      source: "Financial Times",
      timestamp: currentTime,
      region: "Global",
      keywords: ["trade", "tariffs", "economics", "tensions"]
    },
    {
      title: "Diplomatic Meeting Canceled Amid Rising Tensions",
      description: "High-level diplomatic talks postponed indefinitely",
      source: "BBC",
      timestamp: currentTime,
      region: "Asia-Pacific",
      keywords: ["diplomacy", "tensions", "meetings", "politics"]
    }
  ]
}

async function checkForNewCrises(): Promise<any[]> {
  // Fetch latest news and analyze with Gemini
  const newsData = await fetchLatestGlobalNews()
  
  const crisisAnalysisPrompt = `
You are an Advanced Crisis Monitoring AI specialized in geopolitical event analysis.

Analyze recent news for crisis events:
${JSON.stringify(newsData)}

Classify each event by:
1. Severity level (1-5)
2. Event type
3. Affected regions
4. Escalation potential
5. Timeline urgency

Only return events with severity >= 3.
Format as JSON array of crisis events.

Return ONLY valid JSON:
[
  {
    "title": "string - concise event title",
    "description": "string - detailed description", 
    "event_type": "string - categorized type",
    "severity": "number 1-5",
    "regions": ["string array - affected regions"],
    "keywords": ["string array - key terms"],
    "source_urls": ["string array - source links"],
    "confidence_score": "number 0-1",
    "escalation_potential": "LOW" | "MEDIUM" | "HIGH",
    "timeline_urgency": "IMMEDIATE" | "SHORT_TERM" | "MEDIUM_TERM"
  }
]`

  const crisisContent = await callGeminiAPI(crisisAnalysisPrompt)
  return JSON.parse(crisisContent)
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    if (req.method === 'POST') {
      // Configure new alert
      const config: AlertConfig = await req.json()
      
      const { error: insertError } = await supabase
        .from('alert_configurations')
        .insert({
          user_id: config.userId,
          name: `Crisis Alert - ${config.criteria.regions.join(', ')}`,
          alert_type: 'crisis_monitoring',
          criteria: config.criteria,
          notification_settings: config.notifications,
          is_active: true
        })

      if (insertError) {
        throw new Error(`Failed to create alert: ${insertError.message}`)
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Alert configuration created successfully',
          timestamp: new Date().toISOString()
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    if (req.method === 'GET') {
      // Check for new alerts
      const alerts = await checkForNewCrises()
      
      // Store crisis events in database
      for (const alert of alerts) {
        const { error: insertError } = await supabase
          .from('crisis_events')
          .insert({
            title: alert.title,
            description: alert.description,
            event_type: alert.event_type,
            severity: alert.severity,
            regions: alert.regions,
            keywords: alert.keywords,
            source_urls: alert.source_urls || [],
            confidence_score: alert.confidence_score,
            escalation_potential: alert.escalation_potential,
            timeline_urgency: alert.timeline_urgency,
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
          })

        if (insertError) {
          console.error('Error storing crisis event:', insertError)
        }
      }

      // Get active alert configurations to determine who to notify
      const { data: alertConfigs, error: configError } = await supabase
        .from('alert_configurations')
        .select('*')
        .eq('alert_type', 'crisis_monitoring')
        .eq('is_active', true)

      if (configError) {
        console.error('Error fetching alert configs:', configError)
      }

      // Match alerts to user criteria and trigger notifications
      const notifications = []
      if (alertConfigs) {
        for (const config of alertConfigs) {
          for (const alert of alerts) {
            const matchesRegion = config.criteria.regions.some((region: string) => 
              alert.regions.includes(region)
            )
            const matchesSeverity = alert.severity >= config.criteria.severity
            const matchesKeywords = config.criteria.keywords.some((keyword: string) =>
              alert.keywords.includes(keyword.toLowerCase())
            )

            if (matchesRegion && matchesSeverity && matchesKeywords) {
              notifications.push({
                userId: config.user_id,
                alert: alert,
                notificationSettings: config.notification_settings
              })
            }
          }
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            alerts,
            notifications: notifications.length,
            matchedUsers: [...new Set(notifications.map(n => n.userId))]
          },
          timestamp: new Date().toISOString()
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Method not allowed',
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 405,
      }
    )

  } catch (error) {
    console.error('Error in crisis-monitoring function:', error)
    
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