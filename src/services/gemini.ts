import { 
  TutorialRequest, 
  TutorialResponse, 
  RiskAssessmentRequest,
  RiskAssessmentResponse,
  ScenarioConfig,
  SimulationResults,
  EconomicModelRequest,
  EconomicModelResults,
  SentimentRequest,
  SentimentAnalysis,
  AssessmentRequest,
  AssessmentResponse,
  PredictiveRequest,
  PredictiveAnalytics,
  BacktestRequest,
  ModelPerformance
} from '../types';

// Gemini API configuration
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error('VITE_GEMINI_API_KEY environment variable is required');
}

interface GeminiRequest {
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
    responseMimeType?: string;
  };
  safetySettings?: Array<{
    category: string;
    threshold: string;
  }>;
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
    finishReason: string;
    safetyRatings: Array<{
      category: string;
      probability: string;
    }>;
  }>;
  usageMetadata: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
}

class GeminiService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = GEMINI_API_KEY;
    this.baseUrl = GEMINI_API_URL;
  }

  private async callGeminiAPI(
    prompt: string, 
    config: Partial<GeminiRequest['generationConfig']> = {}
  ): Promise<string> {
    const defaultConfig = {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 4096,
      responseMimeType: 'application/json'
    };

    const request: GeminiRequest = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: { ...defaultConfig, ...config },
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
    };

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const data: GeminiResponse = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No response from Gemini API');
      }

      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error;
    }
  }

  // Game Theory Tutorial Generation
  async generateTutorial(request: TutorialRequest): Promise<TutorialResponse> {
    const prompt = `
You are an expert Game Theory Tutor AI specialized in teaching strategic decision-making concepts to students. 

Generate a comprehensive game theory tutorial based on:
- Level: ${request.level}
- Topic: ${request.topic}
- User Progress: ${JSON.stringify(request.userProgress)}

Provide a tutorial with:
1. Clear concept explanation appropriate for ${request.level} level
2. Real geopolitical example demonstrating the concept
3. Interactive element (scenario, calculation, or game tree)
4. Assessment question with multiple choice options

Requirements:
- Tailor difficulty to ${request.level} level
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
      // Appropriate data structure for the type
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
}`;

    const response = await this.callGeminiAPI(prompt, { temperature: 0.8 });
    return JSON.parse(response);
  }

  // Risk Assessment Generation
  async generateRiskAssessment(request: RiskAssessmentRequest): Promise<RiskAssessmentResponse> {
    const prompt = `
You are an Elite Geopolitical Risk Assessment AI. Generate comprehensive risk analysis for:

Regions: ${request.regions.join(', ')}
Timeframe: ${request.timeframe}
Factors: ${request.factors.join(', ')}

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
}`;

    const response = await this.callGeminiAPI(prompt, { temperature: 0.3 });
    return JSON.parse(response);
  }

  // Scenario Simulation
  async runScenarioSimulation(config: ScenarioConfig): Promise<SimulationResults> {
    const prompt = `
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
}`;

    const response = await this.callGeminiAPI(prompt, { temperature: 0.2 });
    return JSON.parse(response);
  }

  // Economic Impact Modeling
  async generateEconomicModel(request: EconomicModelRequest): Promise<EconomicModelResults> {
    const prompt = `
You are a Quantitative Geopolitical Economics AI. Model economic impacts of:

Scenario: ${JSON.stringify(request.scenario)}
Model Types: ${request.modelTypes.join(', ')}
Time Horizon: ${request.timeHorizon}

Provide comprehensive economic impact analysis:
1. GDP impact percentages with confidence intervals
2. Trade volume and value changes by bilateral relationship
3. Employment effects by sector and region
4. Welfare calculations (consumer/producer surplus)
5. Fiscal implications for governments
6. Dynamic timeline analysis

Use established economic modeling frameworks:
- Computable General Equilibrium (CGE) models
- Vector Autoregression (VAR) for macroeconomic forecasting
- Input-output analysis for supply chain effects
- Game-theoretic trade models

Return ONLY valid JSON:
{
  "gdpImpact": {
    "country": {"percentage": number, "confidence": [number, number]}
  },
  "tradeChanges": {
    "bilateral_pair": {"volume": number, "value": number}
  },
  "employmentEffects": {
    "country": {
      "jobs": number,
      "sectors": {"sector": number}
    }
  },
  "welfareCalculations": {
    "country": {"consumer": number, "producer": number}
  },
  "fiscalImplications": {
    "country": {"revenue": number, "expenditure": number}
  },
  "timelineAnalysis": [
    {
      "period": "string",
      "effects": {"metric": number}
    }
  ]
}`;

    const response = await this.callGeminiAPI(prompt, { temperature: 0.1 });
    return JSON.parse(response);
  }

  // Social Media Sentiment Analysis
  async analyzeSentiment(request: SentimentRequest): Promise<SentimentAnalysis> {
    const prompt = `
You are a Social Media Intelligence AI specialized in geopolitical sentiment analysis.

Analyze sentiment for:
Platforms: ${request.platforms.join(', ')}
Regions: ${request.regions.join(', ')}
Topics: ${request.topics.join(', ')}
Timeframe: ${request.timeframe}

Provide comprehensive sentiment analysis including:
1. Sentiment scores by platform and region (-1 to 1 scale)
2. Topic trending analysis with volume metrics
3. Demographic sentiment breakdown
4. Influence network identification
5. Bot detection probability
6. Cultural context considerations

Account for:
- Platform-specific behavioral patterns
- Cultural communication norms
- Language nuances and context
- Demographic variations in expression
- Potential manipulation or coordinated campaigns

Return ONLY valid JSON:
{
  "platform": {
    "region": {
      "score": "number -1 to 1",
      "volume": "number - post/comment count",
      "topics": [
        {
          "name": "string",
          "sentiment": "number -1 to 1",
          "volume": "number",
          "trending": "boolean"
        }
      ],
      "demographics": {
        "age_group": "number - sentiment score",
        "gender": "number - sentiment score"
      },
      "influenceNetworks": [
        {
          "account": "string - anonymized account ID",
          "reach": "number - follower count",
          "engagement": "number - avg engagement rate",
          "credibility": "number 0-1"
        }
      ]
    }
  }
}`;

    const response = await this.callGeminiAPI(prompt, { temperature: 0.4 });
    return JSON.parse(response);
  }

  // Educational Assessment
  async assessStudent(request: AssessmentRequest): Promise<AssessmentResponse> {
    const prompt = `
You are an Advanced Educational Assessment AI for game theory instruction.

Analyze student performance:
Student ID: ${request.studentId}
Module: ${request.moduleId}
Responses: ${JSON.stringify(request.responses)}

Provide comprehensive performance analysis:
1. Overall score and completion percentage
2. Concept mastery breakdown by topic
3. Detailed feedback for each response
4. Personalized learning recommendations
5. Performance analytics and learning velocity

Use educational psychology principles:
- Bloom's taxonomy for learning assessment
- Adaptive learning techniques
- Metacognitive support strategies
- Individual learning style considerations

Return ONLY valid JSON:
{
  "overallScore": "number 0-100",
  "completionPercentage": "number 0-100",
  "conceptMastery": {
    "concept_name": "number 0-1"
  },
  "detailedFeedback": [
    {
      "questionId": "string",
      "correct": "boolean",
      "feedback": "string - constructive feedback",
      "conceptsInvolved": ["string array"]
    }
  ],
  "recommendations": {
    "nextModules": ["string array"],
    "reviewTopics": ["string array"],
    "studyStrategies": ["string array"]
  },
  "performanceAnalytics": {
    "timeSpentPerQuestion": {"questionId": number},
    "difficultyProgression": [number],
    "learningVelocity": "number - concepts per hour"
  }
}`;

    const response = await this.callGeminiAPI(prompt, { temperature: 0.3 });
    return JSON.parse(response);
  }

  // Predictive Analytics
  async generatePredictions(request: PredictiveRequest): Promise<PredictiveAnalytics> {
    const prompt = `
You are a Quantitative Geopolitical Analytics AI. Generate predictions using time series analysis, machine learning ensemble methods, and Bayesian updating to provide probability forecasts with confidence intervals and market impact assessments.

Generate predictions for:
Metrics: ${request.metrics.join(', ')}
Timeframe: ${request.timeframe}
Regions: ${request.regions.join(', ')}
Event Types: ${request.eventTypes.join(', ')}

Provide comprehensive predictive analysis:
1. Probability forecasts with confidence intervals
2. Market impact scores (-100 to 100)
3. Timeline analysis with trigger points
4. Risk-adjusted return predictions
5. Correlation matrix for different events
6. Scenario analysis (best/worst/base case)

Use quantitative methods:
- Time series analysis with external factors
- Machine learning ensemble methods
- Bayesian updating with new information
- Causal inference techniques

Return ONLY valid JSON:
{
  "predictions": [
    {
      "event": "string",
      "probability": "number 0-1",
      "confidence_interval": [number, number],
      "timeline": {
        "expected_date": "string ISO date",
        "earliest_date": "string ISO date",
        "latest_date": "string ISO date"
      },
      "impact_assessment": {
        "market_impact_score": "number -100 to 100",
        "affected_sectors": ["string array"],
        "geographic_scope": ["string array"]
      },
      "trigger_indicators": [
        {
          "indicator": "string",
          "current_value": "number",
          "threshold_value": "number",
          "importance": "number 0-1"
        }
      ]
    }
  ],
  "correlation_matrix": {
    "event1": {"event2": number}
  },
  "risk_adjusted_returns": {
    "asset_class": "number"
  },
  "scenario_analysis": {
    "best_case": {"probability": number, "description": "string"},
    "worst_case": {"probability": number, "description": "string"},
    "base_case": {"probability": number, "description": "string"}
  },
  "generatedAt": "string ISO timestamp",
  "dataFreshness": {
    "source": "string last_update_time"
  }
}`;

    const response = await this.callGeminiAPI(prompt, { temperature: 0.2 });
    return JSON.parse(response);
  }

  // Model Backtesting
  async runBacktest(request: BacktestRequest): Promise<ModelPerformance> {
    const prompt = `
You are a Predictive Model Validation AI specialized in geopolitical forecasting performance assessment.

Perform backtesting analysis for:
Model: ${request.modelName}
Test Periods: ${JSON.stringify(request.testPeriods)}
Metrics: ${request.metrics.join(', ')}

Conduct comprehensive validation:
1. Calculate accuracy metrics (precision, recall, F1-score, AUC-ROC)
2. Assess calibration and reliability
3. Analyze economic value of predictions
4. Identify error patterns and systematic biases
5. Provide improvement recommendations

Use rigorous statistical methods:
- Walk-forward analysis
- Cross-validation techniques
- Significance testing
- Bootstrap resampling for confidence intervals

Return ONLY valid JSON:
{
  "id": "string - generated UUID",
  "model_name": "${request.modelName}",
  "model_version": "string",
  "test_period": ["string start_date", "string end_date"],
  "accuracy_metrics": {
    "precision": "number 0-1",
    "recall": "number 0-1",
    "f1_score": "number 0-1",
    "auc_roc": "number 0-1",
    "calibration_score": "number 0-1"
  },
  "backtesting_results": {
    "total_predictions": "number",
    "correct_predictions": "number",
    "false_positives": "number",
    "false_negatives": "number",
    "economic_value": "number"
  },
  "performance_score": "number 0-1",
  "improvement_recommendations": ["string array"],
  "created_at": "string ISO timestamp"
}`;

    const response = await this.callGeminiAPI(prompt, { temperature: 0.1 });
    return JSON.parse(response);
  }

  // Crisis Event Analysis
  async analyzeCrisisEvent(eventData: Record<string, unknown>): Promise<{
    title: string;
    description: string;
    event_type: string;
    severity: number;
    regions: string[];
    keywords: string[];
    source_urls: string[];
    confidence_score: number;
    escalation_potential: 'LOW' | 'MEDIUM' | 'HIGH';
    timeline_urgency: 'IMMEDIATE' | 'SHORT_TERM' | 'MEDIUM_TERM';
    recommendations: string[];
  }> {
    const prompt = `
You are an Advanced Crisis Monitoring AI specialized in geopolitical event analysis.

Analyze this potential crisis event:
${JSON.stringify(eventData)}

Provide comprehensive crisis assessment:
1. Severity level classification (1-5)
2. Event type categorization
3. Affected regions and stakeholders
4. Escalation potential assessment
5. Timeline urgency evaluation
6. Recommended response options

Consider factors:
- Historical precedents and patterns
- Actor capabilities and intentions
- Information reliability and source credibility
- Potential for misunderstanding or miscalculation

Return ONLY valid JSON:
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
  "timeline_urgency": "IMMEDIATE" | "SHORT_TERM" | "MEDIUM_TERM",
  "recommendations": ["string array - response options"]
}`;

    const response = await this.callGeminiAPI(prompt, { temperature: 0.3 });
    return JSON.parse(response);
  }

  // Diplomatic Communication Analysis
  async analyzeDiplomaticCommunication(content: string, context: Record<string, unknown>): Promise<{
    tone_analysis: {
      overall_tone: string;
      key_phrases: string[];
      emotional_indicators: Record<string, number>;
      formality_level: number;
    };
    hidden_meanings: {
      implicit_messages: string[];
      coded_language: Record<string, string>;
      position_signals: string[];
    };
    cultural_context: {
      communication_style: string;
      cultural_factors: string[];
      protocol_adherence: string;
    };
    significance_score: number;
    implications: string[];
    recommendations: string[];
  }> {
    const prompt = `
You are a Diplomatic Communication Analysis AI with expertise in international relations and cultural communication.

Analyze this diplomatic communication:
Content: ${content}
Context: ${JSON.stringify(context)}

Provide comprehensive analysis:
1. Tone analysis with emotional indicators
2. Hidden meanings and implications
3. Cultural context interpretation
4. Significance scoring (1-10)
5. Key phrases and coded language
6. Negotiation position inference

Consider:
- Diplomatic protocol and conventions
- Cultural communication patterns
- Historical context and precedents
- Power dynamics and relationships

Return ONLY valid JSON:
{
  "tone_analysis": {
    "overall_tone": "string",
    "key_phrases": ["string array"],
    "emotional_indicators": {"emotion": number},
    "formality_level": "number 1-10"
  },
  "hidden_meanings": {
    "implicit_messages": ["string array"],
    "coded_language": {"phrase": "meaning"},
    "position_signals": ["string array"]
  },
  "cultural_context": {
    "communication_style": "string",
    "cultural_factors": ["string array"],
    "protocol_adherence": "string"
  },
  "significance_score": "number 1-10",
  "implications": ["string array"],
  "recommendations": ["string array"]
}`;

    const response = await this.callGeminiAPI(prompt, { temperature: 0.4 });
    return JSON.parse(response);
  }
}

// Create singleton instance
export const geminiService = new GeminiService();
export default geminiService;