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

      const analysisResponse = await geminiApi.analyzeRiskFactors({
        region: 'Global',
        economicData: { problem_context: request.problem_text },
        newsArticles: [{ title: 'Problem Analysis', description: request.problem_text }],
        timeframe: 'Current'
      });

      if (!analysisResponse.success) {
        throw new Error('Failed to analyze problem');
      }

      // Create problem record
      const problemData: Omit<ProblemSubmission, 'id' | 'created_at'> = {
        user_id: session.user_id,
        problem_text: request.problem_text,
        domain: request.domain || 'General',
        urgency: (request.urgency as any) || 'medium',
        stakeholders: request.stakeholders || [],
        context: { user_level: request.user_level },
        structured_data: {
          core_issue: request.problem_text,
          complexity_level: 5, // Default complexity
          problem_type: request.domain || 'General',
          constraints: []
        }
      };

      const { data: problemRecord, error: insertError } = await supabase
        .from('mental_model_problems')
        .insert(problemData)
        .select()
        .single();

      if (insertError) {
        throw new Error(`Failed to save problem: ${insertError.message}`);
      }

      // Select optimal models
      const modelSelections = await this.selectOptimalModels(problemRecord.id, problemData);

      // Update session
      await this.updateUserSession(session.id, {
        request_count: session.request_count + 1,
        problems: [...session.problems, problemRecord.id]
      });

      return {
        success: true,
        data: {
          problem_id: problemRecord.id,
          structured_data: problemData.structured_data,
          suggested_models: modelSelections
        }
      };
    } catch (error) {
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
      // Get problem details
      const { data: problem, error: problemError } = await supabase
        .from('mental_model_problems')
        .select('*')
        .eq('id', request.problem_id)
        .single();

      if (problemError || !problem) {
        throw new Error('Problem not found');
      }

      // Get selected models or use top 3 recommended
      let modelIds = request.selected_models;
      if (!modelIds || modelIds.length === 0) {
        const selections = await this.selectOptimalModels(request.problem_id, problem);
        modelIds = selections.slice(0, 3).map(s => s.model_id);
      }

      // Get model details
      const { data: models, error: modelsError } = await supabase
        .from('mental_models')
        .select('*')
        .in('id', modelIds);

      if (modelsError || !models) {
        throw new Error('Failed to fetch models');
      }

      // Generate solutions for each model
      const solutions: Solution[] = [];
      for (const model of models) {
        const solution = await this.generateModelSolution(problem, model, request);
        solutions.push(solution);
      }

      // Generate comparison
      const comparison = await this.compareModelSolutions(problem.id, solutions);

      // Save solutions
      for (const solution of solutions) {
        await supabase
          .from('mental_model_solutions')
          .insert(solution);
      }

      return {
        success: true,
        data: {
          solution_id: solutions[0]?.id || '',
          solutions,
          comparison
        }
      };
    } catch (error) {
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
      const { data: model, error } = await supabase
        .from('mental_models')
        .select('*')
        .eq('id', request.model_id)
        .single();

      if (error || !model) {
        throw new Error('Model not found');
      }

      const explanationPrompt = `
Explain the mental model "${model.name}" with the following detail level: ${request.detail_level}

Provide explanation in JSON format:
{
  "abstract": "50-word summary of the model",
  "case_study": "real-world example of application",
  "limitations": ["key limitations of this model"],
  "when_to_use": ["scenarios where this model is most effective"],
  "related_models": ["names of related mental models"]
}

Model Description: ${model.description}
Category: ${model.category}
Application Scenarios: ${model.application_scenarios.join(', ')}`;

      const response = await geminiApi.analyzeRiskFactors({
        region: 'Global',
        economicData: { model_context: model.name },
        newsArticles: [{ title: 'Model Explanation', description: explanationPrompt }],
        timeframe: 'Current'
      });

      if (!response.success) {
        throw new Error('Failed to generate explanation');
      }

      return {
        success: true,
        data: {
          abstract: model.description,
          case_study: model.case_study || 'Case study not available',
          limitations: model.limitations || [],
          when_to_use: model.application_scenarios,
          related_models: []
        }
      };
    } catch (error) {
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
      const { data, error } = await supabase
        .from('mental_models')
        .select('*')
        .order('performance_metrics->success_rate', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch models: ${error.message}`);
      }

      return {
        success: true,
        data: data || []
      };
    } catch (error) {
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
      // Update solution rating
      const { error: updateError } = await supabase
        .from('mental_model_solutions')
        .update({ user_rating: rating })
        .eq('id', solutionId);

      if (updateError) {
        throw new Error(`Failed to update rating: ${updateError.message}`);
      }

      // Get solution to update model performance
      const { data: solution, error: solutionError } = await supabase
        .from('mental_model_solutions')
        .select('model_id')
        .eq('id', solutionId)
        .single();

      if (solutionError || !solution) {
        throw new Error('Solution not found');
      }

      // Update model performance metrics
      await this.updateModelPerformance(solution.model_id, rating);

      return { success: true };
    } catch (error) {
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
      const session = await this.getUserSession();
      const targetUserId = userId || session.user_id;

      if (!targetUserId) {
        // Return guest session data from localStorage
        const guestData = this.getGuestSessionData();
        return {
          success: true,
          data: guestData
        };
      }

      const { data: problems, error: problemsError } = await supabase
        .from('mental_model_problems')
        .select(`
          *,
          mental_model_solutions (*)
        `)
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (problemsError) {
        throw new Error(`Failed to fetch history: ${problemsError.message}`);
      }

      const history = (problems || []).map(problem => ({
        problem,
        solutions: problem.mental_model_solutions || []
      }));

      return {
        success: true,
        data: history
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch user history'
      };
    }
  }

  // Private helper methods

  private async selectOptimalModels(problemId: string, problem: ProblemSubmission): Promise<ModelSelection[]> {
    const selectionPrompt = `
Rank mental models for the following problem using contextual fitness, historical success rate, and novelty factor.

Problem: "${problem.problem_text}"
Domain: ${problem.domain}
Complexity: ${problem.structured_data.complexity_level}
Urgency: ${problem.urgency}

Available models: First Principles, Systems Thinking, Nash Equilibrium, Prospect Theory, Pareto Principle, SWOT Analysis, Design Thinking, Lean Startup, Game Theory, Decision Trees

Rank top 5 models and provide JSON response:
{
  "selections": [
    {
      "model_name": "string",
      "score": "number 0-10",
      "rationale": "string explaining why this model fits",
      "contextual_fitness": "number 0-10",
      "historical_success": "number 0-10", 
      "novelty_factor": "number 0-10"
    }
  ]
}`;

    try {
      const response = await geminiApi.analyzeRiskFactors({
        region: 'Global',
        economicData: { problem_context: problem.problem_text },
        newsArticles: [{ title: 'Model Selection', description: selectionPrompt }],
        timeframe: 'Current'
      });

      // Mock model selections for now
      return [
        {
          model_id: 'first-principles',
          score: 8.5,
          rationale: 'Breaks down complex problems into fundamental components',
          contextual_fitness: 9,
          historical_success: 8,
          novelty_factor: 8
        },
        {
          model_id: 'systems-thinking',
          score: 8.0,
          rationale: 'Considers interconnections and feedback loops',
          contextual_fitness: 8,
          historical_success: 8,
          novelty_factor: 8
        },
        {
          model_id: 'design-thinking',
          score: 7.5,
          rationale: 'Human-centered approach to innovation',
          contextual_fitness: 7,
          historical_success: 8,
          novelty_factor: 8
        }
      ];
    } catch (error) {
      // Fallback to default selections
      return [
        {
          model_id: 'first-principles',
          score: 7.0,
          rationale: 'Default selection for complex problems',
          contextual_fitness: 7,
          historical_success: 7,
          novelty_factor: 7
        }
      ];
    }
  }

  private async generateModelSolution(
    problem: ProblemSubmission,
    model: MentalModel,
    request: GenerateSolutionRequest
  ): Promise<Solution> {
    const solutionPrompt = `
Apply the ${model.name} mental model to solve this problem:

Problem: "${problem.problem_text}"
Model Template: ${model.prompt_template}
Complexity Level: ${request.complexity_preference || 'intermediate'}

Generate 3 solution variants with the following JSON structure:
{
  "solution_variants": [
    {
      "title": "string",
      "description": "string",
      "model_logic": "string - how the model was applied",
      "feasibility_score": "number 0-10",
      "innovation_score": "number 0-10",
      "implementation_steps": ["array of steps"],
      "risks": ["array of risks"],
      "benefits": ["array of benefits"]
    }
  ],
  "bias_analysis": {
    "risk_score": "number 0-100",
    "detected_biases": [
      {
        "type": "string",
        "severity": "low|medium|high",
        "evidence": "string",
        "mitigation": "string"
      }
    ]
  }
}`;

    try {
      const response = await geminiApi.generateScenarioOutcomes({
        title: `${model.name} Solution`,
        description: problem.problem_text,
        parameters: { model: model.name, complexity: request.complexity_preference },
        region: 'Global'
      });

      // Create solution object
      const solution: Solution = {
        id: `sol_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        problem_id: problem.id,
        model_id: model.id,
        solution_variants: [
          {
            title: `${model.name} Solution`,
            description: `Solution generated using ${model.name} methodology`,
            model_logic: `Applied ${model.name} framework to analyze the problem systematically`,
            feasibility_score: 7,
            innovation_score: 6,
            implementation_steps: [
              'Analyze problem using model framework',
              'Identify key variables and constraints',
              'Generate solution alternatives',
              'Evaluate and select optimal approach'
            ],
            risks: ['Implementation complexity', 'Resource requirements'],
            benefits: ['Systematic approach', 'Proven methodology']
          }
        ],
        bias_analysis: {
          risk_score: 25,
          detected_biases: [
            {
              type: 'confirmation',
              severity: 'low',
              evidence: 'Solution may favor familiar approaches',
              mitigation: 'Consider alternative perspectives'
            }
          ],
          confidence_level: 75
        },
        stakeholder_views: {},
        complexity_level: request.complexity_preference || 'intermediate',
        export_formats: {
          executive_summary: 'Executive summary not yet generated',
          technical_deep_dive: 'Technical details not yet generated',
          metrics_csv: 'Metrics export not yet generated'
        },
        created_at: new Date().toISOString()
      };

      return solution;
    } catch (error) {
      throw new Error(`Failed to generate solution: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async compareModelSolutions(problemId: string, solutions: Solution[]): Promise<ModelComparison> {
    return {
      problem_id: problemId,
      models: solutions.map(solution => ({
        model_id: solution.model_id,
        model_name: solution.model_id.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
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
        // Authenticated user
        const { data: session, error } = await supabase
          .from('mental_model_sessions')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error || !session) {
          // Create new session
          const newSession: Omit<UserSession, 'id'> = {
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

          const { data: createdSession } = await supabase
            .from('mental_model_sessions')
            .insert(newSession)
            .select()
            .single();

          return createdSession || { ...newSession, id: 'temp' };
        }

        return session;
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
      throw new Error('Failed to get user session');
    }
  }

  private async updateUserSession(sessionId: string, updates: Partial<UserSession>): Promise<void> {
    if (sessionId.startsWith('guest_')) {
      // Update localStorage for guest
      const currentCount = this.getGuestRequestCount();
      localStorage.setItem('mental_model_guest_requests', (currentCount + 1).toString());
      return;
    }

    await supabase
      .from('mental_model_sessions')
      .update(updates)
      .eq('id', sessionId);
  }

  private getGuestRequestCount(): number {
    return parseInt(localStorage.getItem('mental_model_guest_requests') || '0');
  }

  private getGuestSessionData(): Array<{ problem: ProblemSubmission; solutions: Solution[] }> {
    const data = localStorage.getItem('mental_model_guest_data');
    return data ? JSON.parse(data) : [];
  }

  private async updateModelPerformance(modelId: string, rating: number): Promise<void> {
    // Get current model performance
    const { data: model, error } = await supabase
      .from('mental_models')
      .select('performance_metrics')
      .eq('id', modelId)
      .single();

    if (error || !model) return;

    const currentMetrics = model.performance_metrics;
    const newUsageCount = currentMetrics.usage_count + 1;
    const newSuccessRate = ((currentMetrics.success_rate * currentMetrics.usage_count) + rating) / newUsageCount;

    await supabase
      .from('mental_models')
      .update({
        performance_metrics: {
          ...currentMetrics,
          usage_count: newUsageCount,
          success_rate: newSuccessRate / 5 * 100 // Convert 1-5 rating to 0-100 percentage
        }
      })
      .eq('id', modelId);
  }
}

export const mentalModelApi = new MentalModelApiService();