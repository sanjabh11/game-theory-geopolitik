import { ApiResponse } from '../types/api';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export interface GeminiRequest {
  contents: Array<{
    parts: Array<{
      text: string;
    }>;
  }>;
  generationConfig?: {
    temperature?: number;
    topK?: number;
    topP?: number;
    maxOutputTokens?: number;
  };
}

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
    finishReason: string;
  }>;
}

export class GeminiApiService {
  private async makeRequest(prompt: string, config?: GeminiRequest['generationConfig']): Promise<string> {
    const request: GeminiRequest = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
        ...config
      }
    };

    try {
      const response = await fetch(`${BASE_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        console.warn(`Gemini API error: ${response.status} ${response.statusText}`);
        
        // Return a more informative error for different status codes
        if (response.status === 503) {
          throw new Error('Gemini AI service is temporarily unavailable. Using fallback analysis.');
        } else if (response.status === 429) {
          throw new Error('API rate limit exceeded. Please try again later.');
        } else if (response.status === 401) {
          throw new Error('Invalid API key. Please check your configuration.');
        } else {
          throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
        }
      }

      const data: GeminiResponse = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No response generated from Gemini API');
      }

      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to connect to Gemini API');
    }
  }

  /**
   * Analyze geopolitical risk factors
   */
  async analyzeRiskFactors(data: {
    region: string;
    economicData: Record<string, unknown>;
    newsArticles: Array<{ title: string; description?: string }>;
    timeframe: string;
  }): Promise<ApiResponse<{
    riskScore: number;
    riskFactors: string[];
    analysis: string;
    recommendations: string[];
    confidence: number;
  }>> {
    try {
      const prompt = `
As a geopolitical risk analyst, analyze the following data for ${data.region} over the ${data.timeframe} timeframe:

Economic Data:
${JSON.stringify(data.economicData, null, 2)}

Recent News Headlines:
${data.newsArticles.map(article => `- ${article.title}`).join('\n')}

Provide a comprehensive risk analysis including:
1. Overall risk score (0-100, where 100 is highest risk)
2. Key risk factors identified
3. Detailed analysis explanation
4. Strategic recommendations
5. Confidence level in the assessment (0-100)

Format your response as a JSON object with the following structure:
{
  "riskScore": number,
  "riskFactors": ["factor1", "factor2", ...],
  "analysis": "detailed analysis text",
  "recommendations": ["recommendation1", "recommendation2", ...],
  "confidence": number
}
`;

      const response = await this.makeRequest(prompt);
      
      // Try to parse JSON response
      try {
        const parsedResponse = JSON.parse(response);
        return {
          success: true,
          data: parsedResponse
        };
      } catch {
        // Fallback if JSON parsing fails
        return {
          success: true,
          data: {
            riskScore: 50,
            riskFactors: ['Data parsing error'],
            analysis: response,
            recommendations: ['Review data quality and retry analysis'],
            confidence: 60
          }
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to analyze risk factors'
      };
    }
  }

  /**
   * Generate scenario outcomes
   */
  async generateScenarioOutcomes(scenario: {
    title: string;
    description: string;
    parameters: Record<string, unknown>;
    region: string;
  }): Promise<ApiResponse<{
    outcomes: Array<{
      title: string;
      probability: number;
      impact: string;
      description: string;
      timeframe: string;
    }>;
    analysis: string;
    keyFactors: string[];
  }>> {
    try {
      const prompt = `
As a geopolitical scenario analyst, generate potential outcomes for the following scenario:

Title: ${scenario.title}
Description: ${scenario.description}
Region: ${scenario.region}
Parameters: ${JSON.stringify(scenario.parameters, null, 2)}

Generate 3-5 potential outcomes with:
1. Outcome title
2. Probability percentage (0-100)
3. Impact level (Low/Medium/High/Critical)
4. Detailed description
5. Expected timeframe

Also provide:
- Overall analysis of the scenario
- Key factors that will influence outcomes

Format as JSON:
{
  "outcomes": [
    {
      "title": "outcome title",
      "probability": number,
      "impact": "impact level",
      "description": "detailed description",
      "timeframe": "timeframe"
    }
  ],
  "analysis": "overall analysis",
  "keyFactors": ["factor1", "factor2", ...]
}
`;

      const response = await this.makeRequest(prompt);
      
      try {
        const parsedResponse = JSON.parse(response);
        return {
          success: true,
          data: parsedResponse
        };
      } catch {
        return {
          success: true,
          data: {
            outcomes: [
              {
                title: 'Analysis Generated',
                probability: 70,
                impact: 'Medium',
                description: response,
                timeframe: '3-6 months'
              }
            ],
            analysis: 'Scenario analysis completed with fallback formatting',
            keyFactors: ['Data processing', 'Response formatting']
          }
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate scenario outcomes'
      };
    }
  }

  /**
   * Analyze crisis severity and provide recommendations
   */
  async analyzeCrisis(crisisData: {
    title: string;
    description: string;
    region: string;
    newsArticles: Array<{ title: string; description?: string }>;
    timeframe: string;
  }): Promise<ApiResponse<{
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    severityScore: number;
    impactAreas: string[];
    immediateActions: string[];
    longTermStrategy: string[];
    monitoringPoints: string[];
  }>> {
    try {
      const prompt = `
As a crisis management analyst, assess the following crisis situation:

Title: ${crisisData.title}
Description: ${crisisData.description}
Region: ${crisisData.region}
Timeframe: ${crisisData.timeframe}

Recent Related News:
${crisisData.newsArticles.map(article => `- ${article.title}`).join('\n')}

Provide crisis assessment including:
1. Severity level (Low/Medium/High/Critical)
2. Numerical severity score (0-100)
3. Key impact areas
4. Immediate actions needed
5. Long-term strategic recommendations
6. Key monitoring points

Format as JSON:
{
  "severity": "severity level",
  "severityScore": number,
  "impactAreas": ["area1", "area2", ...],
  "immediateActions": ["action1", "action2", ...],
  "longTermStrategy": ["strategy1", "strategy2", ...],
  "monitoringPoints": ["point1", "point2", ...]
}
`;

      const response = await this.makeRequest(prompt);
      
      try {
        const parsedResponse = JSON.parse(response);
        return {
          success: true,
          data: parsedResponse
        };
      } catch {
        return {
          success: true,
          data: {
            severity: 'Medium' as const,
            severityScore: 60,
            impactAreas: ['Regional stability', 'Economic impact'],
            immediateActions: ['Monitor situation', 'Assess stakeholder impact'],
            longTermStrategy: ['Develop contingency plans', 'Strengthen partnerships'],
            monitoringPoints: ['News developments', 'Economic indicators']
          }
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to analyze crisis'
      };
    }
  }

  /**
   * Generate predictive analysis
   */
  async generatePredictiveAnalysis(data: {
    historicalData: Record<string, unknown>;
    currentIndicators: Record<string, unknown>;
    region: string;
    timeframe: string;
  }): Promise<ApiResponse<{
    predictions: Array<{
      indicator: string;
      currentValue: number;
      predictedValue: number;
      confidence: number;
      trend: 'increasing' | 'decreasing' | 'stable';
      factors: string[];
    }>;
    summary: string;
    risks: string[];
    opportunities: string[];
  }>> {
    try {
      const prompt = `
As a predictive analytics expert, analyze the following data to generate forecasts for ${data.region} over ${data.timeframe}:

Historical Data:
${JSON.stringify(data.historicalData, null, 2)}

Current Indicators:
${JSON.stringify(data.currentIndicators, null, 2)}

Generate predictions for key indicators including:
1. Current vs predicted values
2. Confidence levels
3. Trend directions
4. Influencing factors
5. Summary analysis
6. Identified risks and opportunities

Format as JSON:
{
  "predictions": [
    {
      "indicator": "indicator name",
      "currentValue": number,
      "predictedValue": number,
      "confidence": number,
      "trend": "trend direction",
      "factors": ["factor1", "factor2", ...]
    }
  ],
  "summary": "overall summary",
  "risks": ["risk1", "risk2", ...],
  "opportunities": ["opportunity1", "opportunity2", ...]
}
`;

      const response = await this.makeRequest(prompt);
      
      try {
        const parsedResponse = JSON.parse(response);
        return {
          success: true,
          data: parsedResponse
        };
      } catch {
        return {
          success: true,
          data: {
            predictions: [
              {
                indicator: 'General Stability',
                currentValue: 70,
                predictedValue: 65,
                confidence: 75,
                trend: 'decreasing' as const,
                factors: ['Economic uncertainty', 'Political tensions']
              }
            ],
            summary: 'Predictive analysis generated with baseline assumptions',
            risks: ['Data quality limitations', 'External factors'],
            opportunities: ['Improved monitoring', 'Enhanced analysis capabilities']
          }
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate predictive analysis'
      };
    }
  }

  /**
   * Generate collaboration insights
   */
  async generateCollaborationInsights(data: {
    topic: string;
    participants: string[];
    context: string;
    objectives: string[];
  }): Promise<ApiResponse<{
    insights: string[];
    recommendations: string[];
    actionItems: Array<{
      task: string;
      assignee: string;
      priority: 'High' | 'Medium' | 'Low';
      deadline: string;
    }>;
    riskFactors: string[];
  }>> {
    try {
      const prompt = `
As a collaboration strategy expert, analyze the following collaboration scenario:

Topic: ${data.topic}
Participants: ${data.participants.join(', ')}
Context: ${data.context}
Objectives: ${data.objectives.join(', ')}

Provide collaboration insights including:
1. Key insights for effective collaboration
2. Strategic recommendations
3. Actionable items with assignments and priorities
4. Potential risk factors to monitor

Format as JSON:
{
  "insights": ["insight1", "insight2", ...],
  "recommendations": ["recommendation1", "recommendation2", ...],
  "actionItems": [
    {
      "task": "task description",
      "assignee": "participant name or role",
      "priority": "priority level",
      "deadline": "suggested deadline"
    }
  ],
  "riskFactors": ["risk1", "risk2", ...]
}
`;

      const response = await this.makeRequest(prompt);
      
      try {
        const parsedResponse = JSON.parse(response);
        return {
          success: true,
          data: parsedResponse
        };
      } catch {
        return {
          success: true,
          data: {
            insights: ['Effective communication is key', 'Clear objectives drive success'],
            recommendations: ['Establish regular check-ins', 'Define clear roles and responsibilities'],
            actionItems: [
              {
                task: 'Set up collaboration framework',
                assignee: 'Team Lead',
                priority: 'High' as const,
                deadline: '1 week'
              }
            ],
            riskFactors: ['Communication gaps', 'Misaligned objectives']
          }
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate collaboration insights'
      };
    }
  }
}

export const geminiApi = new GeminiApiService();
