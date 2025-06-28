// Mental Model Advisor Types
export interface MentalModel {
  id: string;
  name: string;
  category: 'cognitive' | 'strategic' | 'analytical' | 'creative' | 'systems';
  complexity_score: number; // 1-10
  application_scenarios: string[];
  prompt_template: string;
  performance_metrics: {
    accuracy: number;
    relevance_score: number;
    usage_count: number;
    success_rate: number;
  };
  description: string;
  limitations: string[];
  case_study: string;
  created_at: string;
  updated_at: string;
}

export interface ProblemSubmission {
  id: string;
  user_id?: string;
  problem_text: string;
  domain: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  stakeholders: string[];
  context: Record<string, unknown>;
  structured_data: {
    core_issue: string;
    complexity_level: number;
    problem_type: string;
    constraints: string[];
  };
  created_at: string;
}

export interface ModelSelection {
  model_id: string;
  score: number;
  rationale: string;
  contextual_fitness: number;
  historical_success: number;
  novelty_factor: number;
}

export interface Solution {
  id: string;
  problem_id: string;
  model_id: string;
  solution_variants: SolutionVariant[];
  bias_analysis: BiasAnalysis;
  stakeholder_views: Record<string, string>;
  complexity_level: 'novice' | 'intermediate' | 'expert';
  export_formats: {
    executive_summary: string;
    technical_deep_dive: string;
    metrics_csv: string;
  };
  user_rating?: number;
  created_at: string;
}

export interface SolutionVariant {
  title: string;
  description: string;
  model_logic: string;
  feasibility_score: number;
  innovation_score: number;
  implementation_steps: string[];
  risks: string[];
  benefits: string[];
}

export interface BiasAnalysis {
  risk_score: number; // 0-100
  detected_biases: Array<{
    type: 'confirmation' | 'anchoring' | 'base_rate_neglect' | 'availability' | 'overconfidence';
    severity: 'low' | 'medium' | 'high';
    evidence: string;
    mitigation: string;
  }>;
  confidence_level: number;
}

export interface UserSession {
  id: string;
  user_id?: string;
  is_guest: boolean;
  request_count: number;
  max_requests: number;
  problems: string[];
  solutions: string[];
  preferences: {
    complexity_level: 'novice' | 'intermediate' | 'expert';
    preferred_categories: string[];
    urgency_default: string;
  };
  created_at: string;
  expires_at: string;
}

export interface ModelComparison {
  problem_id: string;
  models: Array<{
    model_id: string;
    model_name: string;
    solution_summary: string;
    metrics: {
      feasibility: number;
      innovation: number;
      complexity: number;
      time_to_implement: number;
      resource_requirements: number;
    };
  }>;
  recommendation: string;
  trade_offs: string[];
}

export interface CollaborativeSession {
  id: string;
  problem_id: string;
  participants: Array<{
    user_id: string;
    role: string;
    permissions: string[];
  }>;
  shared_solutions: string[];
  comments: Array<{
    id: string;
    user_id: string;
    content: string;
    timestamp: string;
    solution_id?: string;
  }>;
  version_history: Array<{
    version: number;
    changes: string;
    author_id: string;
    timestamp: string;
  }>;
  status: 'active' | 'completed' | 'archived';
  created_at: string;
}

// API Request/Response Types
export interface SubmitProblemRequest {
  problem_text: string;
  domain?: string;
  urgency?: string;
  stakeholders?: string[];
  user_level?: 'novice' | 'intermediate' | 'expert';
}

export interface SubmitProblemResponse {
  success: boolean;
  data?: {
    problem_id: string;
    structured_data: ProblemSubmission['structured_data'];
    suggested_models: ModelSelection[];
  };
  error?: string;
}

export interface GenerateSolutionRequest {
  problem_id: string;
  selected_models?: string[];
  complexity_preference?: 'novice' | 'intermediate' | 'expert';
  stakeholder_focus?: string;
}

export interface GenerateSolutionResponse {
  success: boolean;
  data?: {
    solution_id: string;
    solutions: Solution[];
    comparison: ModelComparison;
  };
  error?: string;
}

export interface ModelExplanationRequest {
  model_id: string;
  detail_level: 'brief' | 'detailed' | 'comprehensive';
}

export interface ModelExplanationResponse {
  success: boolean;
  data?: {
    abstract: string;
    case_study: string;
    limitations: string[];
    when_to_use: string[];
    related_models: string[];
  };
  error?: string;
}