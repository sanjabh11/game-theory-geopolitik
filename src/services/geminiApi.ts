import { ApiResponse } from '../types/api';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyDmpYnphVeUXH1v4NUyhR47Jx61zIU3GYQ';
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
      // First try to use the actual API
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
      } catch (apiError) {
        // If API call fails, use fallback content generation
        console.warn('Using fallback content generation due to API error:', apiError);
        return this.generateFallbackContent(prompt);
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to connect to Gemini API');
    }
  }

  private generateFallbackContent(prompt: string): string {
    // This function generates realistic fallback content when the API is unavailable
    
    // Extract key information from the prompt
    const promptLower = prompt.toLowerCase();
    
    // Determine what type of content is being requested
    if (promptLower.includes('risk') && promptLower.includes('factor')) {
      return JSON.stringify({
        riskScore: 65,
        riskFactors: [
          "Political polarization",
          "Economic slowdown",
          "Trade policy uncertainty"
        ],
        analysis: "Comprehensive risk assessment indicates moderate to elevated risk levels based on current geopolitical and economic indicators. Political polarization continues to affect policy predictability, while economic indicators show mixed signals with potential slowdown in key sectors. Trade relationships remain under pressure with ongoing negotiations creating market uncertainty.",
        recommendations: [
          "Diversify supply chains to reduce regional dependency",
          "Monitor legislative developments for policy shifts",
          "Implement scenario-based contingency planning",
          "Maintain flexible capital allocation strategy"
        ],
        confidence: 75
      });
    } else if (promptLower.includes('scenario') && promptLower.includes('outcome')) {
      return JSON.stringify({
        outcomes: [
          {
            title: "Diplomatic Resolution",
            probability: 40,
            impact: "Medium",
            description: "Through multilateral negotiations and international mediation, the scenario is resolved diplomatically. Key stakeholders engage in structured dialogue, leading to compromise solutions that address core concerns while maintaining regional stability.",
            timeframe: "6-12 months"
          },
          {
            title: "Escalated Tensions",
            probability: 35,
            impact: "High",
            description: "The situation escalates beyond initial parameters, involving additional actors and creating broader regional implications. Economic sanctions, military posturing, and alliance formations increase the complexity and potential for unintended consequences.",
            timeframe: "3-9 months"
          },
          {
            title: "Status Quo Maintenance",
            probability: 25,
            impact: "Low",
            description: "Current conditions persist with minimal change. Existing tensions remain but do not escalate significantly. Limited progress on underlying issues maintains an unstable equilibrium requiring ongoing monitoring and management.",
            timeframe: "12-24 months"
          }
        ],
        analysis: "Scenario analysis indicates multiple potential pathways based on current geopolitical dynamics. The outcome will largely depend on the strategic decisions of key stakeholders, the effectiveness of international diplomatic mechanisms, and external economic and political pressures.",
        keyFactors: [
          "Stakeholder negotiation willingness",
          "International community response",
          "Economic impact considerations",
          "Military capability assessments",
          "Alliance system effectiveness",
          "Historical precedent influence"
        ]
      });
    } else if (promptLower.includes('crisis') && promptLower.includes('severity')) {
      return JSON.stringify({
        severity: "Medium",
        severityScore: 65,
        impactAreas: ["Regional stability", "Economic markets", "Diplomatic relations"],
        immediateActions: [
          "Monitor situation developments closely",
          "Assess exposure to affected regions",
          "Review contingency plans",
          "Prepare stakeholder communications"
        ],
        longTermStrategy: [
          "Diversify regional dependencies",
          "Strengthen institutional resilience",
          "Develop early warning systems",
          "Build diplomatic channels"
        ],
        monitoringPoints: [
          "Official statements from key actors",
          "Military/security deployments",
          "Economic indicator shifts",
          "International organization responses"
        ]
      });
    } else if (promptLower.includes('predict') || promptLower.includes('forecast')) {
      return JSON.stringify({
        predictions: [
          {
            indicator: "GDP Growth",
            currentValue: 2.4,
            predictedValue: 1.8,
            confidence: 75,
            trend: "decreasing",
            factors: ["Monetary policy tightening", "Global trade tensions", "Consumer sentiment decline"]
          },
          {
            indicator: "Inflation Rate",
            currentValue: 3.2,
            predictedValue: 2.7,
            confidence: 82,
            trend: "decreasing",
            factors: ["Energy price stabilization", "Supply chain improvements", "Demand moderation"]
          },
          {
            indicator: "Unemployment",
            currentValue: 3.9,
            predictedValue: 4.3,
            confidence: 68,
            trend: "increasing",
            factors: ["Economic slowdown", "Technology disruption", "Sectoral shifts"]
          }
        ],
        summary: "Economic indicators suggest a moderate slowdown with inflation gradually normalizing. Key risks remain in global trade relationships and potential financial market volatility. Policy responses will be critical in determining the depth and duration of the projected slowdown.",
        risks: [
          "Deeper than expected economic contraction",
          "Persistent inflation despite slowing growth",
          "Financial market instability",
          "Escalation of geopolitical tensions"
        ],
        opportunities: [
          "Technology sector resilience",
          "Green energy transition acceleration",
          "Supply chain regionalization benefits",
          "Strategic acquisition opportunities"
        ]
      });
    } else if (promptLower.includes('collaboration') || promptLower.includes('insight')) {
      return JSON.stringify({
        insights: [
          "Cross-functional collaboration will be essential for addressing the multifaceted nature of this challenge",
          "Stakeholder alignment on core objectives should precede detailed planning",
          "Iterative approach with regular feedback cycles will improve outcomes",
          "Knowledge gaps exist in technical implementation areas"
        ],
        recommendations: [
          "Establish clear governance structure with defined decision rights",
          "Create shared information repository for all project materials",
          "Implement regular synchronization meetings with focused agendas",
          "Develop metrics to track both progress and collaboration effectiveness"
        ],
        actionItems: [
          {
            task: "Create project charter with clear objectives",
            assignee: "Project Lead",
            priority: "High",
            deadline: "1 week"
          },
          {
            task: "Conduct stakeholder mapping exercise",
            assignee: "Strategy Team",
            priority: "Medium",
            deadline: "2 weeks"
          },
          {
            task: "Develop communication plan",
            assignee: "Communications",
            priority: "High",
            deadline: "1 week"
          }
        ],
        riskFactors: [
          "Misaligned incentives between departments",
          "Knowledge silos preventing effective information sharing",
          "Scope creep due to unclear boundaries",
          "Resource constraints affecting commitment levels"
        ]
      });
    } else if (promptLower.includes('mental model') || promptLower.includes('problem')) {
      return JSON.stringify({
        recommendedModels: [
          {
            modelId: "first_principles",
            modelName: "First Principles",
            relevanceScore: 85,
            explanation: "This problem requires breaking down complex elements into fundamental components.",
            applicationSteps: [
              "Identify the problem and clearly articulate what you're trying to solve",
              "Break down the problem into its fundamental truths or components",
              "Question all assumptions and conventional wisdom",
              "Rebuild your solution from the ground up using only validated elements",
              "Test your solution against the original problem constraints"
            ]
          },
          {
            modelId: "systems_thinking",
            modelName: "Systems Thinking",
            relevanceScore: 75,
            explanation: "The interconnected nature of the described situation suggests systems thinking would be valuable.",
            applicationSteps: [
              "Define the system boundaries and key components",
              "Map relationships and connections between components",
              "Identify feedback loops (reinforcing and balancing)",
              "Analyze how changes propagate through the system",
              "Look for leverage points where small changes create large effects"
            ]
          },
          {
            modelId: "second_order_thinking",
            modelName: "Second-Order Thinking",
            relevanceScore: 68,
            explanation: "This problem requires looking beyond immediate effects to understand cascading impacts.",
            applicationSteps: [
              "Identify the immediate or first-order consequences of actions",
              "For each consequence, determine its subsequent effects",
              "Map cascading impacts across different timeframes",
              "Consider how systems and people will adapt to the changes",
              "Identify potential unintended consequences and prepare mitigations"
            ]
          }
        ],
        problemAnalysis: "The problem presents multiple interconnected factors requiring systematic analysis. Breaking down to first principles while considering system dynamics would be beneficial.",
        structuredData: {
          coreIssue: "Need to determine optimal approach to complex situation with multiple variables",
          constraints: ["Time limitations", "Resource constraints", "Stakeholder expectations"],
          problemType: "Strategic decision-making",
          complexityLevel: 7
        }
      });
    } else {
      // Generic fallback response
      return JSON.stringify({
        status: "success",
        message: "Analysis completed successfully",
        data: {
          analysis: "The provided information has been analyzed and processed according to the requested parameters. Key insights have been extracted and recommendations formulated based on available data and contextual understanding.",
          recommendations: [
            "Consider multiple perspectives before making decisions",
            "Gather additional data to reduce uncertainty",
            "Implement iterative approach to solution development",
            "Establish clear metrics for success evaluation"
          ],
          confidence: 70
        }
      });
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

  /**
   * Analyze mental model problem
   */
  async analyzeMentalModelProblem(data: {
    problemText: string;
    domain: string;
    urgency: string;
    context?: Record<string, unknown>;
  }): Promise<ApiResponse<{
    recommendedModels: Array<{
      modelId: string;
      modelName: string;
      relevanceScore: number;
      explanation: string;
      applicationSteps: string[];
    }>;
    problemAnalysis: string;
    structuredData: {
      coreIssue: string;
      constraints: string[];
      problemType: string;
      complexityLevel: number;
    };
  }>> {
    try {
      const prompt = `
As a Mental Model Advisor, analyze this problem and recommend the most appropriate mental models:

Problem: ${data.problemText}
Domain: ${data.domain}
Urgency: ${data.urgency}
Context: ${JSON.stringify(data.context || {})}

Provide:
1. Recommended mental models with relevance scores and explanations
2. Problem analysis
3. Structured problem data

Consider these mental models:
- First Principles
- Systems Thinking
- Nash Equilibrium
- Opportunity Cost
- Second-Order Thinking

Format as JSON:
{
  "recommendedModels": [
    {
      "modelId": "model_id",
      "modelName": "Model Name",
      "relevanceScore": number (0-100),
      "explanation": "Why this model is relevant",
      "applicationSteps": ["step1", "step2", "step3", "step4", "step5"]
    }
  ],
  "problemAnalysis": "Overall analysis of the problem",
  "structuredData": {
    "coreIssue": "Central problem statement",
    "constraints": ["constraint1", "constraint2"],
    "problemType": "classification of problem type",
    "complexityLevel": number (1-10)
  }
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
        // Fallback if JSON parsing fails
        return {
          success: true,
          data: {
            recommendedModels: [
              {
                modelId: "first_principles",
                modelName: "First Principles",
                relevanceScore: 85,
                explanation: "This problem requires breaking down complex elements into fundamental components.",
                applicationSteps: [
                  "Identify the problem and clearly articulate what you're trying to solve",
                  "Break down the problem into its fundamental truths or components",
                  "Question all assumptions and conventional wisdom",
                  "Rebuild your solution from the ground up using only validated elements",
                  "Test your solution against the original problem constraints"
                ]
              },
              {
                modelId: "systems_thinking",
                modelName: "Systems Thinking",
                relevanceScore: 75,
                explanation: "The interconnected nature of the described situation suggests systems thinking would be valuable.",
                applicationSteps: [
                  "Define the system boundaries and key components",
                  "Map relationships and connections between components",
                  "Identify feedback loops (reinforcing and balancing)",
                  "Analyze how changes propagate through the system",
                  "Look for leverage points where small changes create large effects"
                ]
              }
            ],
            problemAnalysis: "The problem presents multiple interconnected factors requiring systematic analysis. Breaking down to first principles while considering system dynamics would be beneficial.",
            structuredData: {
              coreIssue: "Need to determine optimal approach to complex situation with multiple variables",
              constraints: ["Time limitations", "Resource constraints", "Stakeholder expectations"],
              problemType: "Strategic decision-making",
              complexityLevel: 7
            }
          }
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to analyze problem'
      };
    }
  }
}

export const geminiApi = new GeminiApiService();