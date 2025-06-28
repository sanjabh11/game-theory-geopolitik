import { ApiResponse } from '../types/api';

interface MentalModel {
  id: string;
  name: string;
  category: 'cognitive' | 'strategic' | 'analytical' | 'creative' | 'systems';
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

interface ProblemInput {
  problem_text: string;
  domain: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  stakeholders?: string[];
  context?: Record<string, unknown>;
}

interface ModelSolution {
  model_id: string;
  model_name: string;
  solution_text: string;
  confidence_score: number;
  reasoning: string;
  alternatives: string[];
  limitations: string[];
  next_steps: string[];
}

export class MentalModelApiService {
  private mockModels: MentalModel[] = [
    {
      id: 'first_principles',
      name: 'First Principles',
      category: 'analytical',
      complexity_score: 7,
      application_scenarios: ['problem decomposition', 'innovation', 'strategic planning'],
      prompt_template: 'Analyze {problem} by breaking it down to its fundamental truths and reasoning up from there.',
      performance_metrics: {
        accuracy: 85,
        usage_count: 1243,
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
        usage_count: 876,
        success_rate: 72,
        relevance_score: 85
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
        usage_count: 1056,
        success_rate: 75,
        relevance_score: 88
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
        usage_count: 1532,
        success_rate: 82,
        relevance_score: 79
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
        accuracy: 81,
        usage_count: 1124,
        success_rate: 76,
        relevance_score: 84
      },
      description: 'Considering not just the immediate results of actions but the subsequent effects of those results.',
      limitations: ['Cognitive complexity', 'Diminishing accuracy with time horizon', 'Analysis paralysis risk']
    },
    {
      id: 'inversion',
      name: 'Inversion',
      category: 'cognitive',
      complexity_score: 6,
      application_scenarios: ['problem solving', 'risk management', 'goal setting'],
      prompt_template: 'Instead of focusing on what would make {problem} successful, identify what would cause it to fail and avoid those things.',
      performance_metrics: {
        accuracy: 83,
        usage_count: 987,
        success_rate: 79,
        relevance_score: 81
      },
      description: 'A problem-solving technique where you look at the problem backward, focusing on avoiding what you don't want rather than pursuing what you do want.',
      limitations: ['May miss positive opportunities', 'Can lead to overly cautious approaches', 'Requires thorough understanding of failure modes']
    },
    {
      id: 'bayes_theorem',
      name: 'Bayesian Reasoning',
      category: 'analytical',
      complexity_score: 8,
      application_scenarios: ['probability assessment', 'decision making under uncertainty', 'forecasting'],
      prompt_template: 'For {problem}, start with prior probabilities, then update them based on new evidence using Bayes' theorem.',
      performance_metrics: {
        accuracy: 86,
        usage_count: 765,
        success_rate: 74,
        relevance_score: 87
      },
      description: 'A mathematical framework for updating beliefs based on new evidence, using prior probabilities and likelihood ratios.',
      limitations: ['Requires accurate prior probabilities', 'Computationally intensive for complex problems', 'Subjective interpretation of probabilities']
    },
    {
      id: 'occams_razor',
      name: 'Occam\'s Razor',
      category: 'analytical',
      complexity_score: 4,
      application_scenarios: ['hypothesis testing', 'problem diagnosis', 'theory selection'],
      prompt_template: 'When examining {problem}, prefer the simplest explanation that fits the facts.',
      performance_metrics: {
        accuracy: 79,
        usage_count: 1432,
        success_rate: 81,
        relevance_score: 76
      },
      description: 'The principle that, all else being equal, simpler explanations are more likely to be correct than complex ones.',
      limitations: ['May oversimplify complex problems', 'Simplicity is subjective', 'Not always applicable in complex systems']
    }
  ];

  /**
   * Get all mental models
   */
  async getAllModels(): Promise<ApiResponse<MentalModel[]>> {
    try {
      // In a real implementation, this would fetch from Supabase
      return {
        success: true,
        data: this.mockModels
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch mental models'
      };
    }
  }

  /**
   * Get mental models by category
   */
  async getModelsByCategory(category: string): Promise<ApiResponse<MentalModel[]>> {
    try {
      const filteredModels = this.mockModels.filter(model => 
        model.category.toLowerCase() === category.toLowerCase()
      );
      
      return {
        success: true,
        data: filteredModels
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch mental models by category'
      };
    }
  }

  /**
   * Get a specific mental model by ID
   */
  async getModelById(id: string): Promise<ApiResponse<MentalModel>> {
    try {
      const model = this.mockModels.find(model => model.id === id);
      
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
   * Analyze a problem and recommend suitable mental models
   */
  async analyzeProblem(problem: ProblemInput): Promise<ApiResponse<{
    recommended_models: Array<{
      model_id: string;
      model_name: string;
      relevance_score: number;
      rationale: string;
    }>;
    problem_analysis: {
      complexity: number;
      key_factors: string[];
      domain_classification: string;
      uncertainty_level: number;
    };
  }>> {
    try {
      // Simulate AI analysis with mock data
      // In a real implementation, this would use Gemini API
      
      // Wait for a realistic delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate mock recommendations based on problem domain
      const domainKeywords: Record<string, string[]> = {
        'geopolitics': ['conflict', 'diplomacy', 'international', 'policy', 'relations', 'security', 'trade'],
        'business': ['competition', 'market', 'strategy', 'investment', 'growth', 'profit', 'risk'],
        'technology': ['innovation', 'development', 'disruption', 'adoption', 'integration', 'scaling'],
        'social': ['behavior', 'community', 'culture', 'influence', 'network', 'society'],
        'environmental': ['climate', 'conservation', 'ecosystem', 'resources', 'sustainability']
      };
      
      // Determine domain based on keywords
      let detectedDomain = problem.domain;
      if (!detectedDomain) {
        const lowerProblem = problem.problem_text.toLowerCase();
        for (const [domain, keywords] of Object.entries(domainKeywords)) {
          if (keywords.some(keyword => lowerProblem.includes(keyword))) {
            detectedDomain = domain;
            break;
          }
        }
      }
      
      // Select models based on domain and urgency
      let recommendedModelIds: string[] = [];
      
      switch (detectedDomain) {
        case 'geopolitics':
          recommendedModelIds = ['nash_equilibrium', 'systems_thinking', 'second_order_thinking'];
          break;
        case 'business':
          recommendedModelIds = ['opportunity_cost', 'first_principles', 'bayes_theorem'];
          break;
        case 'technology':
          recommendedModelIds = ['first_principles', 'systems_thinking', 'inversion'];
          break;
        case 'social':
          recommendedModelIds = ['systems_thinking', 'second_order_thinking', 'nash_equilibrium'];
          break;
        case 'environmental':
          recommendedModelIds = ['systems_thinking', 'second_order_thinking', 'opportunity_cost'];
          break;
        default:
          // Default recommendations
          recommendedModelIds = ['first_principles', 'systems_thinking', 'occams_razor'];
      }
      
      // Adjust based on urgency
      if (problem.urgency === 'high' || problem.urgency === 'critical') {
        // For high urgency, prioritize simpler models
        if (!recommendedModelIds.includes('occams_razor')) {
          recommendedModelIds.unshift('occams_razor');
        }
      }
      
      // Format recommendations
      const recommendations = recommendedModelIds.map((id, index) => {
        const model = this.mockModels.find(m => m.id === id);
        if (!model) return null;
        
        return {
          model_id: model.id,
          model_name: model.name,
          relevance_score: 95 - (index * 5), // Decreasing relevance
          rationale: `${model.name} is well-suited for ${detectedDomain} problems because it ${getModelRationale(model.id, detectedDomain)}`
        };
      }).filter(Boolean);
      
      return {
        success: true,
        data: {
          recommended_models: recommendations,
          problem_analysis: {
            complexity: problem.urgency === 'critical' ? 9 : problem.urgency === 'high' ? 7 : problem.urgency === 'medium' ? 5 : 3,
            key_factors: extractKeyFactors(problem.problem_text),
            domain_classification: detectedDomain,
            uncertainty_level: problem.urgency === 'critical' ? 85 : problem.urgency === 'high' ? 70 : problem.urgency === 'medium' ? 50 : 30
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to analyze problem'
      };
    }
  }

  /**
   * Generate a solution using a specific mental model
   */
  async generateSolution(modelId: string, problem: ProblemInput): Promise<ApiResponse<ModelSolution>> {
    try {
      const model = this.mockModels.find(m => m.id === modelId);
      
      if (!model) {
        throw new Error(`Mental model with ID ${modelId} not found`);
      }
      
      // Simulate AI solution generation with mock data
      // In a real implementation, this would use Gemini API
      
      // Wait for a realistic delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const solution: ModelSolution = {
        model_id: model.id,
        model_name: model.name,
        solution_text: generateSolutionText(model.id, problem.problem_text),
        confidence_score: Math.floor(70 + Math.random() * 25),
        reasoning: `This solution applies ${model.name} by ${getModelApproach(model.id)}`,
        alternatives: generateAlternatives(model.id),
        limitations: model.limitations,
        next_steps: generateNextSteps(model.id)
      };
      
      return {
        success: true,
        data: solution
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate solution'
      };
    }
  }
}

// Helper functions for generating mock content
function getModelRationale(modelId: string, domain: string): string {
  const rationales: Record<string, Record<string, string>> = {
    'first_principles': {
      'default': 'helps break down complex problems into fundamental components.',
      'geopolitics': 'identifies the core drivers behind international relations and policy decisions.',
      'business': 'strips away assumptions to reveal the fundamental truths of market dynamics.',
      'technology': 'enables innovation by questioning established approaches and rebuilding from basics.'
    },
    'nash_equilibrium': {
      'default': 'helps identify stable outcomes in competitive situations.',
      'geopolitics': 'models the strategic interactions between nations with competing interests.',
      'business': 'predicts competitive market behaviors and optimal pricing strategies.',
      'social': 'explains stable patterns in social interactions and group dynamics.'
    },
    'systems_thinking': {
      'default': 'reveals how different components interact within a complex system.',
      'geopolitics': 'maps the interconnected nature of global politics and economic systems.',
      'environmental': 'shows how ecological, economic, and social factors interact in environmental challenges.',
      'technology': 'identifies feedback loops and emergent behaviors in complex technological ecosystems.'
    },
    'opportunity_cost': {
      'default': 'quantifies what must be given up when making a choice.',
      'business': 'helps prioritize investments and resource allocation decisions.',
      'environmental': 'clarifies the tradeoffs involved in resource management decisions.',
      'geopolitics': 'evaluates the tradeoffs in diplomatic and strategic policy choices.'
    },
    'second_order_thinking': {
      'default': 'considers the cascading effects beyond immediate consequences.',
      'geopolitics': 'anticipates how policy decisions will trigger reactions and counter-reactions.',
      'environmental': 'projects long-term impacts of interventions on complex ecosystems.',
      'social': 'predicts how social policies may create unintended behavioral changes.'
    },
    'inversion': {
      'default': 'identifies potential failure modes to avoid.',
      'business': 'highlights critical risks that could derail strategic initiatives.',
      'technology': 'surfaces potential design flaws and implementation challenges early.',
      'geopolitics': 'identifies diplomatic and strategic pitfalls to avoid.'
    },
    'bayes_theorem': {
      'default': 'updates probability estimates as new information becomes available.',
      'business': 'refines market forecasts and investment decisions with incoming data.',
      'geopolitics': 'adjusts risk assessments as new intelligence and events unfold.',
      'technology': 'improves predictive models through continuous learning from new data.'
    },
    'occams_razor': {
      'default': 'identifies the simplest explanation that fits the facts.',
      'business': 'cuts through complexity to focus on the most likely market dynamics.',
      'geopolitics': 'avoids overcomplicating analysis of international events and motivations.',
      'technology': 'prioritizes simpler solutions that meet requirements with fewer components.'
    }
  };
  
  return rationales[modelId]?.[domain] || rationales[modelId]?.['default'] || 'provides a structured approach to analysis and decision-making.';
}

function getModelApproach(modelId: string): string {
  const approaches: Record<string, string> = {
    'first_principles': 'breaking down the problem to its fundamental elements and rebuilding a solution from the ground up',
    'nash_equilibrium': 'identifying the key actors, their strategies, and finding the stable equilibrium where no actor can improve by changing only their strategy',
    'systems_thinking': 'mapping the interconnected components and feedback loops to understand system-wide behavior and intervention points',
    'opportunity_cost': 'evaluating all available options and calculating the value of the next best alternative foregone',
    'second_order_thinking': 'considering not just immediate consequences but the subsequent effects of those effects',
    'inversion': 'identifying what would cause failure and developing strategies to avoid those outcomes',
    'bayes_theorem': 'starting with prior probabilities and updating them based on new evidence',
    'occams_razor': 'preferring the simplest explanation or solution that adequately addresses the problem'
  };
  
  return approaches[modelId] || 'applying a structured analytical framework to the problem';
}

function extractKeyFactors(problemText: string): string[] {
  // In a real implementation, this would use NLP or AI to extract key factors
  // For mock purposes, we'll return generic factors
  return [
    'Stakeholder interests',
    'Resource constraints',
    'Time pressure',
    'Uncertainty level',
    'Potential risks'
  ];
}

function generateSolutionText(modelId: string, problemText: string): string {
  const solutions: Record<string, string> = {
    'first_principles': `Breaking this problem down to its fundamental components reveals that the core issues are resource allocation, stakeholder alignment, and timing constraints. By rebuilding from these basics, we can see that the optimal approach is to first establish clear priorities based on critical path dependencies, then allocate resources accordingly while maintaining transparent communication with all stakeholders.`,
    
    'nash_equilibrium': `Analyzing this as a strategic interaction between multiple parties, we can identify that each stakeholder has distinct preferences and constraints. The stable equilibrium occurs when Party A adopts a collaborative approach while maintaining clear boundaries, Party B focuses on their core competencies while yielding on secondary issues, and Party C provides support without overcommitting resources.`,
    
    'systems_thinking': `This problem represents an interconnected system with multiple feedback loops. The key insight is that intervention at leverage point X will create cascading effects throughout the system. By strengthening the positive feedback loop between components Y and Z while dampening the reinforcing loop between A and B, we can shift the system toward a more desirable state with minimal resource expenditure.`,
    
    'opportunity_cost': `The analysis reveals that pursuing Option A would require foregoing Options B and C, with a calculated opportunity cost of approximately 35% potential value. However, the unique strategic advantages of Option A outweigh this cost given the current context and constraints. The next best alternative (Option B) should be maintained as a contingency plan.`,
    
    'second_order_thinking': `While the immediate solution might appear to be X, considering second-order effects reveals potential unintended consequences in areas Y and Z. A more robust approach would be to implement a modified version of X that includes preventative measures for these secondary effects, particularly focusing on stakeholder reactions and system adaptations that would otherwise undermine the solution.`,
    
    'inversion': `By examining what would cause this initiative to fail, we've identified three critical failure modes: insufficient stakeholder buy-in, resource depletion before completion, and external regulatory changes. The solution therefore focuses on securing early stakeholder commitment, establishing resource buffers, and implementing a regulatory monitoring system with adaptive response protocols.`,
    
    'bayes_theorem': `Starting with our prior understanding of similar situations (60% probability of Outcome A), we've updated our assessment based on new evidence. The current data shifts our probability estimate to 78% confidence in Outcome A, suggesting that Strategy X is optimal given risk preferences and potential payoffs.`,
    
    'occams_razor': `While multiple complex explanations have been proposed, the simplest solution that addresses all requirements is to streamline the approval process, reduce decision nodes from seven to three, and implement a standardized evaluation framework. This approach requires minimal structural changes while resolving the core inefficiencies.`
  };
  
  return solutions[modelId] || `After careful analysis using the selected mental model, the recommended approach is to address the core challenges through a structured framework that balances short-term needs with long-term objectives. The solution prioritizes key stakeholder concerns while maintaining alignment with strategic goals.`;
}

function generateAlternatives(modelId: string): string[] {
  const alternatives: Record<string, string[]> = {
    'first_principles': [
      'Partial decomposition focusing only on technical elements',
      'Staged implementation with iterative refinement',
      'Outsourcing complex components to specialized partners'
    ],
    'nash_equilibrium': [
      'Cooperative solution with formal enforcement mechanisms',
      'Sequential decision-making with signaling opportunities',
      'Coalition formation among smaller stakeholders'
    ],
    'systems_thinking': [
      'Focus on subsystem optimization with defined interfaces',
      'Adaptive management approach with regular feedback cycles',
      'Boundary-spanning intervention targeting multiple subsystems simultaneously'
    ],
    'opportunity_cost': [
      'Hybrid approach capturing partial benefits from multiple options',
      'Staged decision-making to preserve optionality',
      'Resource sharing arrangement to reduce exclusive commitments'
    ],
    'second_order_thinking': [
      'Robust solution designed to withstand multiple future scenarios',
      'Flexible approach with built-in adaptation mechanisms',
      'Minimal intervention strategy focused on removing obstacles'
    ]
  };
  
  return alternatives[modelId] || [
    'Alternative approach focusing on short-term outcomes',
    'Collaborative solution involving all stakeholders',
    'Phased implementation with regular reassessment'
  ];
}

function generateNextSteps(modelId: string): string[] {
  return [
    'Validate assumptions with key stakeholders',
    'Develop detailed implementation plan',
    'Identify metrics for measuring success',
    'Create risk mitigation strategies',
    'Establish feedback mechanisms for continuous improvement'
  ];
}

export const mentalModelApi = new MentalModelApiService();