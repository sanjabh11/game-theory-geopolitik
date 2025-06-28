import { ApiResponse } from '../types/api';

interface MentalModel {
  id: string;
  name: string;
  category: string;
  complexity_score: number;
  application_scenarios: string[];
  prompt_template: string;
  performance_metrics: {
    accuracy: number;
    usage_count: number;
    success_rate: number;
    relevance_score: number;
  };
  description: string;
  limitations: string[];
  case_study?: string;
}

interface ProblemAnalysisRequest {
  problemText: string;
  domain: string;
  urgency: string;
  context: Record<string, unknown>;
}

interface ProblemAnalysisResponse {
  problemType: string;
  complexityScore: number;
  keyFactors: string[];
  recommendedModels: Array<{
    id: string;
    name: string;
    category: string;
    description: string;
    matchScore: number;
  }>;
  solutions: Array<{
    title: string;
    description: string;
    confidence: number;
    advantages: string[];
    challenges: string[];
    basedOn: string;
  }>;
}

export class MentalModelApiService {
  /**
   * Get all mental models
   */
  async getModels(): Promise<ApiResponse<MentalModel[]>> {
    try {
      // In a real implementation, this would fetch from Supabase
      // For now, we'll return mock data
      return {
        success: true,
        data: this.getMockModels()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch mental models'
      };
    }
  }

  /**
   * Get a specific mental model by ID
   */
  async getModelById(id: string): Promise<ApiResponse<MentalModel>> {
    try {
      const models = this.getMockModels();
      const model = models.find(m => m.id === id);
      
      if (!model) {
        throw new Error(`Mental model with ID ${id} not found`);
      }

      return {
        success: true,
        data: model
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch mental model'
      };
    }
  }

  /**
   * Analyze a problem and recommend mental models
   */
  async analyzeProblem(request: ProblemAnalysisRequest): Promise<ApiResponse<ProblemAnalysisResponse>> {
    try {
      // In a real implementation, this would call Gemini API
      // For now, we'll return mock data
      const mockAnalysis: ProblemAnalysisResponse = {
        problemType: this.getProblemType(request.domain),
        complexityScore: Math.floor(Math.random() * 5) + 5, // 5-10
        keyFactors: this.getKeyFactors(request.domain),
        recommendedModels: this.getRecommendedModels(request.domain).map(model => ({
          id: model.id,
          name: model.name,
          category: model.category,
          description: model.description,
          matchScore: Math.floor(Math.random() * 30) + 70 // 70-100
        })),
        solutions: this.getMockSolutions(request.domain)
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      return {
        success: true,
        data: mockAnalysis
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to analyze problem'
      };
    }
  }

  /**
   * Submit a solution for a problem
   */
  async submitSolution(problemId: string, modelId: string, solution: Record<string, unknown>): Promise<ApiResponse<{ id: string }>> {
    try {
      // In a real implementation, this would save to Supabase
      return {
        success: true,
        data: { id: `sol-${Date.now()}` }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to submit solution'
      };
    }
  }

  // Mock data generators
  private getMockModels(): MentalModel[] {
    return [
      {
        id: 'first_principles',
        name: 'First Principles',
        category: 'analytical',
        complexity_score: 7,
        application_scenarios: ['problem decomposition', 'innovation', 'strategic planning'],
        prompt_template: 'Analyze {problem} by breaking it down to its fundamental truths and reasoning up from there.',
        performance_metrics: {
          accuracy: 85,
          usage_count: 12450,
          success_rate: 78,
          relevance_score: 82
        },
        description: 'A method of thinking that involves breaking down complex problems into basic elements and then reassembling them from the ground up.',
        limitations: ['Time-consuming', 'Requires deep domain knowledge', 'May miss emergent properties']
      },
      {
        id: 'nash_equilibrium',
        name: 'Nash Equilibrium',
        category: 'strategic',
        complexity_score: 8,
        application_scenarios: ['conflict resolution', 'negotiation', 'competitive strategy'],
        prompt_template: 'Identify the key actors in {problem}, their possible strategies, and payoffs.',
        performance_metrics: {
          accuracy: 79,
          usage_count: 8320,
          success_rate: 72,
          relevance_score: 88
        },
        description: 'A concept in game theory where the optimal outcome occurs when there is no incentive for players to deviate from their initial strategy.',
        limitations: ['Assumes rational actors', 'Multiple equilibria may exist', 'Difficult to calculate in complex scenarios']
      },
      {
        id: 'systems_thinking',
        name: 'Systems Thinking',
        category: 'systems',
        complexity_score: 9,
        application_scenarios: ['complex problem solving', 'organizational design', 'policy development'],
        prompt_template: 'Analyze {problem} as an interconnected system. Map the key components, relationships, and feedback loops.',
        performance_metrics: {
          accuracy: 82,
          usage_count: 9750,
          success_rate: 75,
          relevance_score: 90
        },
        description: 'An approach to understanding how different components within a system influence one another within a complete entity.',
        limitations: ['Can become overwhelmingly complex', 'Difficult to quantify relationships', 'May lack predictive precision']
      },
      {
        id: 'opportunity_cost',
        name: 'Opportunity Cost',
        category: 'analytical',
        complexity_score: 5,
        application_scenarios: ['resource allocation', 'decision making', 'investment analysis'],
        prompt_template: 'For {problem}, identify all available options and what must be given up to obtain a particular choice.',
        performance_metrics: {
          accuracy: 88,
          usage_count: 15200,
          success_rate: 82,
          relevance_score: 75
        },
        description: 'The loss of potential gain from other alternatives when one alternative is chosen.',
        limitations: ['Difficult to quantify intangible costs', 'Future value uncertainty', 'Psychological biases in assessment']
      },
      {
        id: 'second_order_thinking',
        name: 'Second-Order Thinking',
        category: 'cognitive',
        complexity_score: 6,
        application_scenarios: ['strategic planning', 'risk assessment', 'policy analysis'],
        prompt_template: 'For {problem}, go beyond immediate consequences and consider the effects of those effects.',
        performance_metrics: {
          accuracy: 76,
          usage_count: 11300,
          success_rate: 70,
          relevance_score: 85
        },
        description: 'Considering not just the immediate results of actions but the subsequent effects of those results.',
        limitations: ['Cognitive complexity', 'Diminishing accuracy with time horizon', 'Analysis paralysis risk']
      },
      {
        id: 'bayes_theorem',
        name: 'Bayesian Reasoning',
        category: 'analytical',
        complexity_score: 7,
        application_scenarios: ['probability assessment', 'decision making under uncertainty', 'risk analysis'],
        prompt_template: 'For {problem}, update your prior beliefs based on new evidence using Bayes\' rule.',
        performance_metrics: {
          accuracy: 83,
          usage_count: 9800,
          success_rate: 77,
          relevance_score: 80
        },
        description: 'A mathematical framework for updating beliefs based on new evidence, essential for reasoning under uncertainty.',
        limitations: ['Requires quantifiable probabilities', 'Subjective prior selection', 'Computational complexity in complex scenarios']
      },
      {
        id: 'inversion',
        name: 'Inversion',
        category: 'cognitive',
        complexity_score: 4,
        application_scenarios: ['problem solving', 'risk mitigation', 'goal setting'],
        prompt_template: 'Instead of focusing on how to achieve {problem}, think about what would cause it to fail and avoid those things.',
        performance_metrics: {
          accuracy: 89,
          usage_count: 14200,
          success_rate: 85,
          relevance_score: 78
        },
        description: 'Approaching a problem by focusing on what to avoid rather than what to pursue, often revealing non-obvious solutions.',
        limitations: ['May miss positive opportunities', 'Can lead to overly cautious approaches', 'Not ideal for creative endeavors']
      },
      {
        id: 'expected_value',
        name: 'Expected Value',
        category: 'analytical',
        complexity_score: 6,
        application_scenarios: ['decision analysis', 'risk assessment', 'investment evaluation'],
        prompt_template: 'For each option in {problem}, calculate the probability-weighted average of all possible outcomes.',
        performance_metrics: {
          accuracy: 81,
          usage_count: 10500,
          success_rate: 76,
          relevance_score: 83
        },
        description: 'A decision-making framework that weights potential outcomes by their probability of occurrence.',
        limitations: ['Requires accurate probability estimates', 'May undervalue rare but catastrophic events', 'Assumes risk neutrality']
      },
      {
        id: 'scenario_planning',
        name: 'Scenario Planning',
        category: 'strategic',
        complexity_score: 7,
        application_scenarios: ['long-term strategy', 'risk management', 'contingency planning'],
        prompt_template: 'For {problem}, develop multiple plausible future scenarios and strategies for each.',
        performance_metrics: {
          accuracy: 74,
          usage_count: 8900,
          success_rate: 69,
          relevance_score: 87
        },
        description: 'A strategic planning method that uses structured approaches to imagine different possible futures.',
        limitations: ['Resource intensive', 'Difficult to assign probabilities', 'Can miss black swan events']
      },
      {
        id: 'occams_razor',
        name: 'Occam\'s Razor',
        category: 'cognitive',
        complexity_score: 3,
        application_scenarios: ['hypothesis testing', 'problem diagnosis', 'theory selection'],
        prompt_template: 'When analyzing {problem}, prefer the simplest explanation that fits the facts.',
        performance_metrics: {
          accuracy: 72,
          usage_count: 16800,
          success_rate: 68,
          relevance_score: 65
        },
        description: 'The principle that the simplest explanation is usually the correct one, all else being equal.',
        limitations: ['Complex problems may require complex solutions', 'Simplicity is subjective', 'Can lead to oversimplification']
      }
    ];
  }

  private getRecommendedModels(domain: string): MentalModel[] {
    const allModels = this.getMockModels();
    
    // Select 3-5 models based on domain
    let modelCount = Math.floor(Math.random() * 3) + 3; // 3-5 models
    let selectedModels: MentalModel[] = [];
    
    switch (domain) {
      case 'geopolitical':
        selectedModels = allModels.filter(m => 
          ['nash_equilibrium', 'systems_thinking', 'scenario_planning'].includes(m.id)
        );
        break;
      case 'financial':
        selectedModels = allModels.filter(m => 
          ['expected_value', 'opportunity_cost', 'bayes_theorem'].includes(m.id)
        );
        break;
      case 'strategic':
        selectedModels = allModels.filter(m => 
          ['second_order_thinking', 'scenario_planning', 'first_principles'].includes(m.id)
        );
        break;
      default:
        // Random selection
        const shuffled = [...allModels].sort(() => 0.5 - Math.random());
        selectedModels = shuffled.slice(0, modelCount);
    }
    
    return selectedModels;
  }

  private getProblemType(domain: string): string {
    const problemTypes: Record<string, string[]> = {
      'geopolitical': [
        'International Conflict Analysis',
        'Trade Policy Optimization',
        'Diplomatic Strategy Formulation',
        'Alliance Stability Assessment'
      ],
      'financial': [
        'Investment Risk Analysis',
        'Market Trend Prediction',
        'Asset Allocation Optimization',
        'Economic Policy Impact Assessment'
      ],
      'strategic': [
        'Competitive Strategy Development',
        'Long-term Planning Challenge',
        'Resource Allocation Dilemma',
        'Organizational Transformation'
      ],
      'organizational': [
        'Team Dynamics Optimization',
        'Change Management Challenge',
        'Leadership Decision Framework',
        'Organizational Structure Design'
      ],
      'personal': [
        'Career Decision Framework',
        'Life Balance Optimization',
        'Personal Development Strategy',
        'Relationship Dynamics Analysis'
      ]
    };
    
    const options = problemTypes[domain] || problemTypes['strategic'];
    return options[Math.floor(Math.random() * options.length)];
  }

  private getKeyFactors(domain: string): string[] {
    const factorsByDomain: Record<string, string[]> = {
      'geopolitical': [
        'Power dynamics', 'Economic interdependence', 'Historical precedents',
        'Cultural factors', 'Military capabilities', 'Alliance structures',
        'Domestic politics', 'Resource dependencies'
      ],
      'financial': [
        'Market volatility', 'Interest rate trends', 'Regulatory environment',
        'Liquidity constraints', 'Investor sentiment', 'Macroeconomic indicators',
        'Sector performance', 'Global economic conditions'
      ],
      'strategic': [
        'Competitive landscape', 'Resource constraints', 'Technological disruption',
        'Market trends', 'Organizational capabilities', 'Stakeholder interests',
        'Regulatory environment', 'Long-term industry outlook'
      ],
      'organizational': [
        'Team composition', 'Leadership style', 'Organizational culture',
        'Communication patterns', 'Decision-making processes', 'Resource allocation',
        'Performance metrics', 'Change readiness'
      ],
      'personal': [
        'Value alignment', 'Skill development', 'Time constraints',
        'Financial resources', 'Support networks', 'Health considerations',
        'Long-term goals', 'Risk tolerance'
      ]
    };
    
    const allFactors = factorsByDomain[domain] || factorsByDomain['strategic'];
    const shuffled = [...allFactors].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4 + Math.floor(Math.random() * 3)); // 4-6 factors
  }

  private getMockSolutions(domain: string): Array<{
    title: string;
    description: string;
    confidence: number;
    advantages: string[];
    challenges: string[];
    basedOn: string;
  }> {
    const solutionsByDomain: Record<string, Array<{
      title: string;
      description: string;
      advantages: string[];
      challenges: string[];
      basedOn: string;
    }>> = {
      'geopolitical': [
        {
          title: 'Diplomatic Engagement Strategy',
          description: 'A multi-layered approach combining formal negotiations, back-channel diplomacy, and international coalition building to address the core issues while maintaining strategic flexibility.',
          advantages: [
            'Preserves relationship capital',
            'Minimizes escalation risks',
            'Creates multiple paths to resolution',
            'Builds international legitimacy'
          ],
          challenges: [
            'Time-intensive process',
            'Requires skilled diplomatic personnel',
            'Success depends on counterparty willingness',
            'May appear as weakness to domestic audience'
          ],
          basedOn: 'Nash Equilibrium'
        },
        {
          title: 'Strategic Deterrence Framework',
          description: 'A calibrated approach that signals resolve through measured economic and security actions while maintaining open communication channels to prevent miscalculation.',
          advantages: [
            'Creates clear consequences for aggression',
            'Establishes credible boundaries',
            'Maintains negotiation options',
            'Can be adjusted incrementally'
          ],
          challenges: [
            'Risk of unintended escalation',
            'Requires precise signaling',
            'Resource intensive',
            'May trigger counter-deterrence'
          ],
          basedOn: 'Game Theory'
        }
      ],
      'financial': [
        {
          title: 'Adaptive Portfolio Strategy',
          description: 'A dynamic asset allocation approach that adjusts exposure based on changing market conditions, economic indicators, and volatility regimes.',
          advantages: [
            'Responsive to changing conditions',
            'Reduces drawdown risk',
            'Capitalizes on market inefficiencies',
            'Systematic rather than emotional'
          ],
          challenges: [
            'Requires continuous monitoring',
            'Transaction costs may impact returns',
            'Model risk in signal generation',
            'Tax implications of frequent rebalancing'
          ],
          basedOn: 'Bayesian Reasoning'
        },
        {
          title: 'Scenario-Based Risk Management',
          description: 'A comprehensive framework that identifies key risk factors, models multiple scenarios, and implements targeted hedging strategies for each potential outcome.',
          advantages: [
            'Prepares for multiple futures',
            'Quantifies potential impacts',
            'Identifies non-obvious correlations',
            'Provides actionable contingency plans'
          ],
          challenges: [
            'Hedging costs reduce returns',
            'Scenario completeness is difficult',
            'Model risk in scenario generation',
            'Complexity in implementation'
          ],
          basedOn: 'Scenario Planning'
        }
      ],
      'strategic': [
        {
          title: 'Asymmetric Opportunity Approach',
          description: 'A strategic framework that identifies and exploits overlooked market opportunities where your unique capabilities provide disproportionate competitive advantage.',
          advantages: [
            'Reduces head-to-head competition',
            'Leverages existing capabilities',
            'Creates defensible market position',
            'Higher potential returns'
          ],
          challenges: [
            'Requires deep market insight',
            'May need capability development',
            'Smaller initial market size',
            'Unproven territory risks'
          ],
          basedOn: 'First Principles'
        },
        {
          title: 'Resilient Growth Framework',
          description: 'A balanced approach that pursues multiple growth vectors simultaneously while building organizational adaptability to respond to market shifts and disruptions.',
          advantages: [
            'Diversifies growth sources',
            'Builds organizational capabilities',
            'Reduces single-point failures',
            'Creates strategic optionality'
          ],
          challenges: [
            'Resource dilution risks',
            'Organizational complexity',
            'Requires strong coordination',
            'Higher management overhead'
          ],
          basedOn: 'Systems Thinking'
        }
      ]
    };
    
    const solutions = solutionsByDomain[domain] || solutionsByDomain['strategic'];
    return solutions.map(solution => ({
      ...solution,
      confidence: Math.floor(Math.random() * 20) + 75 // 75-95%
    }));
  }
}

export const mentalModelApi = new MentalModelApiService();