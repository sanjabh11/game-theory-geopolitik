import { ApiResponse } from '../types/api';
import {
  MentalModel,
  ProblemSubmission,
  Solution,
  ModelSelection,
  ModelComparison,
  SubmitProblemRequest,
  SubmitProblemResponse,
  GenerateSolutionRequest,
  GenerateSolutionResponse,
  ModelExplanationRequest,
  ModelExplanationResponse,
  BiasAnalysis,
  UserSession
} from '../types/mentalModels';
import { geminiApi } from './geminiApi';
import { supabase } from './supabase';

export class MentalModelApiService {
  private readonly GUEST_REQUEST_LIMIT = 3;

  /**
   * Submit a problem for analysis and model selection
   */
  async submitProblem(request: SubmitProblemRequest): Promise<SubmitProblemResponse> {
    try {
      // Check user session and limits
      const session = await this.getUserSession();
      if (session.is_guest && session.request_count >= session.max_requests) {
        return {
          success: false,
          error: 'Guest request limit reached. Please register for unlimited access.'
        };
      }

      // Analyze problem with Gemini
      const analysisPrompt = `
You are an expert problem analyst. Analyze the following problem and extract structured information.

Problem: "${request.problem_text}"
Domain: ${request.domain || 'General'}
Urgency: ${request.urgency || 'Medium'}
Stakeholders: ${request.stakeholders?.join(', ') || 'Not specified'}

Provide analysis in the following JSON format:
{
  "core_issue": "string - the fundamental problem to solve",
  "complexity_level": "number 1-10 - problem complexity",
  "problem_type": "string - category of problem",
  "constraints": ["array of key constraints"],
  "domain": "string - refined domain classification",
  "urgency_assessment": "string - urgency level with justification"
}`;

      try {
        const analysisResponse = await geminiApi.analyzeRiskFactors({
          region: 'Global',
          economicData: { problem_context: request.problem_text },
          newsArticles: [{ title: 'Problem Analysis', description: request.problem_text }],
          timeframe: 'Current'
        });

        if (!analysisResponse.success) {
          throw new Error('Failed to analyze problem');
        }
      } catch (error) {
        console.warn('Problem analysis error:', error);
        // Continue with fallback data
      }

      // Create mock problem record for demo
      const problemId = `problem_${Date.now()}`;
      const problemData: ProblemSubmission = {
        id: problemId,
        user_id: session.user_id,
        problem_text: request.problem_text,
        domain: request.domain || 'General',
        urgency: (request.urgency as any) || 'medium',
        stakeholders: request.stakeholders || [],
        context: { user_level: request.user_level },
        structured_data: {
          core_issue: request.problem_text.substring(0, 50) + '...',
          complexity_level: 5, // Default complexity
          problem_type: request.domain || 'General',
          constraints: ['Time', 'Resources', 'Technical feasibility']
        },
        created_at: new Date().toISOString()
      };

      // Select optimal models
      const modelSelections = await this.selectOptimalModels(problemId, problemData);

      // Update session
      await this.updateUserSession(session.id, {
        request_count: session.request_count + 1,
        problems: [...session.problems, problemId]
      });

      return {
        success: true,
        data: {
          problem_id: problemId,
          structured_data: problemData.structured_data,
          suggested_models: modelSelections
        }
      };
    } catch (error) {
      console.error('Submit problem error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to submit problem'
      };
    }
  }

  /**
   * Generate solutions using selected mental models
   */
  async generateSolution(request: GenerateSolutionRequest): Promise<GenerateSolutionResponse> {
    try {
      // For demo purposes, create mock solutions
      const solutions: Solution[] = [];
      
      // Get selected models or use defaults
      const modelIds = request.selected_models || ['first_principles', 'systems_thinking', 'second_order_thinking'];
      
      // Generate a solution for each model
      for (const modelId of modelIds) {
        const solution = this.createMockSolution(request.problem_id, modelId, request.complexity_preference || 'intermediate');
        solutions.push(solution);
      }

      // Generate comparison
      const comparison = this.createMockComparison(request.problem_id, solutions);

      return {
        success: true,
        data: {
          solution_id: solutions[0]?.id || '',
          solutions,
          comparison
        }
      };
    } catch (error) {
      console.error('Generate solution error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate solution'
      };
    }
  }

  /**
   * Get explanation for a specific mental model
   */
  async getModelExplanation(request: ModelExplanationRequest): Promise<ModelExplanationResponse> {
    try {
      // For demo purposes, create mock explanation
      return {
        success: true,
        data: {
          abstract: 'This mental model provides a structured approach to problem-solving by breaking down complex issues into manageable components.',
          case_study: 'Used successfully in various industries to solve complex problems and drive innovation.',
          limitations: ['May require significant time investment', 'Not suitable for all problem types'],
          when_to_use: ['Complex problem solving', 'Strategic planning', 'Innovation challenges'],
          related_models: ['Systems Thinking', 'Decision Trees', 'SWOT Analysis']
        }
      };
    } catch (error) {
      console.error('Get model explanation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get model explanation'
      };
    }
  }

  /**
   * Get all available mental models
   */
  async getMentalModels(): Promise<ApiResponse<MentalModel[]>> {
    try {
      // For demo purposes, return mock models
      return {
        success: true,
        data: this.getMockModels()
      };
    } catch (error) {
      console.error('Get mental models error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch mental models'
      };
    }
  }

  /**
   * Rate a solution and update model performance
   */
  async rateSolution(solutionId: string, rating: number, feedback?: string): Promise<ApiResponse<void>> {
    try {
      // For demo purposes, just return success
      return { success: true };
    } catch (error) {
      console.error('Rate solution error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to rate solution'
      };
    }
  }

  /**
   * Get user's solution history
   */
  async getUserHistory(userId?: string): Promise<ApiResponse<Array<{ problem: ProblemSubmission; solutions: Solution[] }>>> {
    try {
      // For demo purposes, return empty history
      return {
        success: true,
        data: []
      };
    } catch (error) {
      console.error('Get user history error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch user history'
      };
    }
  }

  // Private helper methods

  private async selectOptimalModels(problemId: string, problem: ProblemSubmission): Promise<ModelSelection[]> {
    // For demo purposes, return mock model selections
    return [
      {
        model_id: 'first_principles',
        score: 8.5,
        rationale: 'Breaks down complex problems into fundamental components',
        contextual_fitness: 9,
        historical_success: 8,
        novelty_factor: 8
      },
      {
        model_id: 'systems_thinking',
        score: 8.0,
        rationale: 'Considers interconnections and feedback loops',
        contextual_fitness: 8,
        historical_success: 8,
        novelty_factor: 8
      },
      {
        model_id: 'second_order_thinking',
        score: 7.5,
        rationale: 'Evaluates cascading effects and unintended consequences',
        contextual_fitness: 7,
        historical_success: 8,
        novelty_factor: 8
      }
    ];
  }

  private createMockSolution(problemId: string, modelId: string, complexityLevel: string): Solution {
    const modelName = modelId.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    return {
      id: `sol_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      problem_id: problemId,
      model_id: modelId,
      solution_variants: [
        {
          title: `${modelName} Solution Approach`,
          description: `This solution applies ${modelName} to address the core problem by systematically analyzing the key components and relationships.`,
          model_logic: `The ${modelName} framework was applied by breaking down the problem into manageable components and identifying the underlying patterns and relationships.`,
          feasibility_score: 7 + Math.floor(Math.random() * 3),
          innovation_score: 6 + Math.floor(Math.random() * 4),
          implementation_steps: [
            'Analyze problem using model framework',
            'Identify key variables and constraints',
            'Generate solution alternatives',
            'Evaluate and select optimal approach',
            'Develop implementation roadmap'
          ],
          risks: [
            'Implementation complexity may be higher than anticipated',
            'Resource requirements could exceed available capacity',
            'Stakeholder resistance to proposed changes'
          ],
          benefits: [
            'Comprehensive approach addresses root causes',
            'Systematic methodology increases success probability',
            'Solution leverages proven framework with track record'
          ]
        }
      ],
      bias_analysis: {
        risk_score: 25 + Math.floor(Math.random() * 20),
        detected_biases: [
          {
            type: 'confirmation',
            severity: 'low',
            evidence: 'Solution may favor familiar approaches that align with existing beliefs',
            mitigation: 'Consider alternative perspectives and challenge assumptions'
          },
          {
            type: 'anchoring',
            severity: 'medium',
            evidence: 'Initial problem framing may unduly influence solution direction',
            mitigation: 'Reframe problem from multiple perspectives before finalizing approach'
          }
        ],
        confidence_level: 75 + Math.floor(Math.random() * 15)
      },
      stakeholder_views: {
        'Leadership': 'Supportive with concerns about implementation timeline',
        'Technical Team': 'Enthusiastic about approach but concerned about resource requirements',
        'End Users': 'Cautiously optimistic, need clear communication about benefits'
      },
      complexity_level: complexityLevel as any,
      export_formats: {
        executive_summary: 'Executive summary not yet generated',
        technical_deep_dive: 'Technical details not yet generated',
        metrics_csv: 'Metrics export not yet generated'
      },
      created_at: new Date().toISOString()
    };
  }

  private createMockComparison(problemId: string, solutions: Solution[]): ModelComparison {
    return {
      problem_id: problemId,
      models: solutions.map(solution => ({
        model_id: solution.model_id,
        model_name: solution.model_id.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        solution_summary: solution.solution_variants[0]?.description || '',
        metrics: {
          feasibility: solution.solution_variants[0]?.feasibility_score || 5,
          innovation: solution.solution_variants[0]?.innovation_score || 5,
          complexity: 5,
          time_to_implement: 5,
          resource_requirements: 5
        }
      })),
      recommendation: 'Consider combining insights from multiple models for optimal results',
      trade_offs: [
        'Higher feasibility may mean lower innovation',
        'Faster implementation may require more resources'
      ]
    };
  }

  private async getUserSession(): Promise<UserSession> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Authenticated user - in a real implementation, we'd fetch from the database
        return {
          id: user.id,
          user_id: user.id,
          is_guest: false,
          request_count: 0,
          max_requests: 1000, // High limit for authenticated users
          problems: [],
          solutions: [],
          preferences: {
            complexity_level: 'intermediate',
            preferred_categories: [],
            urgency_default: 'medium'
          },
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
        };
      } else {
        // Guest user
        const guestId = `guest_${Date.now()}`;
        return {
          id: guestId,
          is_guest: true,
          request_count: this.getGuestRequestCount(),
          max_requests: this.GUEST_REQUEST_LIMIT,
          problems: [],
          solutions: [],
          preferences: {
            complexity_level: 'intermediate',
            preferred_categories: [],
            urgency_default: 'medium'
          },
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
        };
      }
    } catch (error) {
      console.error('Get user session error:', error);
      // Return guest session as fallback
      const guestId = `guest_${Date.now()}`;
      return {
        id: guestId,
        is_guest: true,
        request_count: 0,
        max_requests: this.GUEST_REQUEST_LIMIT,
        problems: [],
        solutions: [],
        preferences: {
          complexity_level: 'intermediate',
          preferred_categories: [],
          urgency_default: 'medium'
        },
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      };
    }
  }

  private async updateUserSession(sessionId: string, updates: Partial<UserSession>): Promise<void> {
    if (sessionId.startsWith('guest_')) {
      // Update localStorage for guest
      const currentCount = this.getGuestRequestCount();
      localStorage.setItem('mental_model_guest_requests', (currentCount + 1).toString());
      return;
    }

    // In a real implementation, we'd update the database
    console.log('Updating session:', sessionId, updates);
  }

  private getGuestRequestCount(): number {
    return parseInt(localStorage.getItem('mental_model_guest_requests') || '0');
  }

  private getMockModels(): MentalModel[] {
    return [
      {
        id: 'first_principles',
        name: 'First Principles Thinking',
        category: 'analytical',
        complexity_score: 7,
        application_scenarios: ['Problem solving', 'Innovation', 'Decision making'],
        prompt_template: 'Break down {problem} into fundamental components...',
        performance_metrics: {
          accuracy: 85,
          relevance_score: 90,
          usage_count: 150,
          success_rate: 78
        },
        description: 'A reasoning method that breaks down complex problems into basic elements and builds up from there.',
        limitations: ['Time-intensive', 'May overlook practical constraints'],
        case_study: 'Elon Musk used first principles to revolutionize rocket design by questioning fundamental assumptions about cost.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'systems_thinking',
        name: 'Systems Thinking',
        category: 'systems',
        complexity_score: 9,
        application_scenarios: ['Complex problems', 'Organizational change', 'Strategy'],
        prompt_template: 'Analyze {problem} as interconnected systems...',
        performance_metrics: {
          accuracy: 82,
          relevance_score: 88,
          usage_count: 120,
          success_rate: 75
        },
        description: 'A holistic approach that views problems as part of larger interconnected systems.',
        limitations: ['Can be overwhelming', 'Requires broad perspective'],
        case_study: 'Toyota Production System uses systems thinking to optimize manufacturing processes.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'nash_equilibrium',
        name: 'Nash Equilibrium',
        category: 'strategic',
        complexity_score: 8,
        application_scenarios: ['Conflict resolution', 'Negotiation', 'Competitive strategy'],
        prompt_template: 'Identify equilibrium states where no actor can unilaterally improve...',
        performance_metrics: {
          accuracy: 78,
          relevance_score: 85,
          usage_count: 90,
          success_rate: 72
        },
        description: 'A concept in game theory where the optimal outcome occurs when there is no incentive for players to deviate from their initial strategy.',
        limitations: ['Assumes rational actors', 'Multiple equilibria may exist'],
        case_study: 'Used to analyze international trade negotiations and tariff strategies.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'second_order_thinking',
        name: 'Second-Order Thinking',
        category: 'cognitive',
        complexity_score: 6,
        application_scenarios: ['Strategic planning', 'Risk assessment', 'Policy analysis'],
        prompt_template: 'Consider the effects of effects for {problem}...',
        performance_metrics: {
          accuracy: 80,
          relevance_score: 85,
          usage_count: 200,
          success_rate: 82
        },
        description: 'Considering not just the immediate results of actions but the subsequent effects of those results.',
        limitations: ['Cognitive complexity', 'Diminishing accuracy with time horizon'],
        case_study: 'Warren Buffett uses second-order thinking to evaluate long-term investment decisions.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'opportunity_cost',
        name: 'Opportunity Cost',
        category: 'analytical',
        complexity_score: 5,
        application_scenarios: ['Resource allocation', 'Decision making', 'Investment analysis'],
        prompt_template: 'Calculate what must be given up for each alternative...',
        performance_metrics: {
          accuracy: 88,
          relevance_score: 82,
          usage_count: 180,
          success_rate: 85
        },
        description: 'The loss of potential gain from other alternatives when one alternative is chosen.',
        limitations: ['Difficult to quantify intangible costs', 'Future value uncertainty'],
        case_study: 'Used in capital budgeting decisions to evaluate project investments.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }
}

export const mentalModelApi = new MentalModelApiService();