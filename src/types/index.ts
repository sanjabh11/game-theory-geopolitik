// Core User and Authentication Types
export interface UserProfile {
  id: string;
  role: 'student' | 'professor' | 'analyst' | 'policymaker' | 'researcher';
  organization?: string;
  preferences: Record<string, string | number | boolean>;
  notification_settings: NotificationSettings;
  created_at: string;
  updated_at: string;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
}

// Game Theory Learning Types
export interface LearningProgress {
  id: string;
  user_id: string;
  module_id: string;
  module_name: string;
  completion_percentage: number;
  score: number;
  time_spent_minutes: number;
  last_accessed: string;
  performance_data: Record<string, string | number | boolean>;
  created_at: string;
}

export interface TutorialRequest {
  level: 'basic' | 'intermediate' | 'advanced';
  topic: string;
  userProgress: {
    completedModules: string[];
    currentScore: number;
  };
}

export interface TutorialResponse {
  concept: string;
  explanation: string;
  geopoliticalExample?: string;
  example?: {
    scenario: string;
    analysis: string;
    solution: string;
  };
  interactiveElement?: {
    type: 'scenario' | 'calculation' | 'game_tree';
    data: Record<string, unknown>;
  };
  assessmentQuestion: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
  };
}

// Risk Assessment Types
export interface RiskAssessment {
  id: string;
  region: string;
  country_code?: string;
  risk_score: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  factors: Record<string, string | number | boolean>;
  confidence_interval: [number, number];
  trend?: 'IMPROVING' | 'STABLE' | 'DETERIORATING';
  source_data: Record<string, string | number | boolean>;
  created_at: string;
  expires_at: string;
}

export interface RiskAssessmentRequest {
  regions: string[];
  timeframe: '30d' | '90d' | '1y';
  factors: string[];
}

export interface RiskAssessmentResponse {
  assessments: Array<{
    region: string;
    riskScore: number;
    confidenceInterval: [number, number];
    primaryDrivers: Array<{
      factor: string;
      weight: number;
      trend: 'increasing' | 'stable' | 'decreasing';
    }>;
    scenarios: {
      best: { probability: number; description: string };
      worst: { probability: number; description: string };
      mostLikely: { probability: number; description: string };
    };
    lastUpdated: string;
  }>;
}

// Scenario Simulation Types
export interface ScenarioActor {
  name: string;
  capabilities: {
    military: number;
    economic: number;
    diplomatic: number;
  };
  preferences: {
    riskTolerance: number;
    timeHorizon: 'short' | 'medium' | 'long';
  };
}

export interface ScenarioConfig {
  actors: ScenarioActor[];
  scenario: {
    type: 'military_conflict' | 'trade_war' | 'diplomatic_crisis' | 'cyber_warfare' | 'economic_sanctions';
    parameters: Record<string, string | number | boolean>;
  };
  simulationSettings: {
    iterations: number;
    timeSteps: number;
  };
}

export interface ScenarioSimulation {
  id: string;
  user_id: string;
  name: string;
  scenario_type: string;
  scenario_config: ScenarioConfig;
  results?: SimulationResults;
  status: 'pending' | 'running' | 'completed' | 'failed';
  created_at: string;
  completed_at?: string;
}

export interface SimulationResults {
  equilibria: Array<{
    type: string;
    strategies: Record<string, string | number>;
    payoffs: Record<string, number>;
    stability: number;
  }>;
  outcomeDistribution: Array<{
    outcome: string;
    probability: number;
    description: string;
  }>;
  recommendations: Array<{
    actor: string;
    strategy: string;
    reasoning: string;
    confidence: number;
  }>;
  sensitivityAnalysis: Record<string, number>;
}

// Alert and Crisis Types
export interface AlertConfiguration {
  id: string;
  user_id: string;
  name: string;
  alert_type: 'crisis_monitoring' | 'risk_threshold' | 'custom_keyword' | 'economic_indicator';
  criteria: Record<string, string | number | boolean>;
  notification_settings: NotificationSettings;
  is_active: boolean;
  last_triggered?: string;
  created_at: string;
  updated_at: string;
}

export interface CrisisEvent {
  id: string;
  title: string;
  description: string;
  event_type: string;
  severity: number; // 1-5
  regions: string[];
  keywords: string[];
  source_urls: string[];
  confidence_score?: number;
  escalation_potential?: 'LOW' | 'MEDIUM' | 'HIGH';
  timeline_urgency?: 'IMMEDIATE' | 'SHORT_TERM' | 'MEDIUM_TERM';
  created_at: string;
  expires_at?: string;
}

// Economic Modeling Types
export interface EconomicModel {
  id: string;
  scenario_id: string;
  model_name: string;
  model_type: 'CGE' | 'VAR' | 'INPUT_OUTPUT' | 'GAME_THEORETIC';
  parameters: Record<string, string | number | boolean>;
  results?: EconomicModelResults;
  baseline_data?: Record<string, string | number | boolean>;
  assumptions: Record<string, string | number | boolean>;
  uncertainty_range?: Record<string, number>;
  created_at: string;
  expires_at?: string;
}

export interface EconomicModelRequest {
  scenario: {
    type: 'sanctions' | 'trade_war' | 'alliance_change';
    actors: string[];
    parameters: Record<string, number>;
  };
  modelTypes: string[];
  timeHorizon: string;
}

export interface EconomicModelResults {
  gdpImpact: Record<string, { percentage: number; confidence: [number, number] }>;
  tradeChanges: Record<string, { volume: number; value: number }>;
  employmentEffects: Record<string, { jobs: number; sectors: Record<string, number> }>;
  welfareCalculations: Record<string, { consumer: number; producer: number }>;
  fiscalImplications: Record<string, { revenue: number; expenditure: number }>;
  timelineAnalysis: Array<{
    period: string;
    effects: Record<string, number>;
  }>;
}

// Social Media and Sentiment Types
export interface SentimentData {
  id: string;
  platform: 'twitter' | 'facebook' | 'reddit' | 'telegram' | 'tiktok' | 'linkedin';
  region: string;
  country_code?: string;
  sentiment_score: number; // -1 to 1
  volume: number;
  topics: string[];
  demographic_breakdown: Record<string, number>;
  influence_metrics: Record<string, number>;
  bot_probability?: number;
  created_at: string;
}

export interface SentimentRequest {
  platforms: string[];
  regions: string[];
  topics: string[];
  timeframe: string;
}

export interface SentimentAnalysis {
  [platform: string]: {
    [region: string]: {
      score: number;
      volume: number;
      topics: Array<{
        name: string;
        sentiment: number;
        volume: number;
        trending: boolean;
      }>;
      demographics: Record<string, number>;
      influenceNetworks: Array<{
        account: string;
        reach: number;
        engagement: number;
        credibility: number;
      }>;
    };
  };
}

// Historical Patterns Types
export interface HistoricalPattern {
  id: string;
  pattern_type: string;
  pattern_name: string;
  description: string;
  time_period: [string, string]; // Date range
  regions: string[];
  examples: Array<{
    event: string;
    date: string;
    outcome: string;
    similarity: number;
  }>;
  statistical_significance?: number;
  confidence_level?: number;
  predictive_power?: number;
  created_at: string;
  updated_at: string;
}

// Model Performance Types
export interface ModelPerformance {
  id: string;
  model_name: string;
  model_version: string;
  test_period: [string, string];
  accuracy_metrics: {
    precision: number;
    recall: number;
    f1_score: number;
    auc_roc: number;
    calibration_score: number;
  };
  backtesting_results: {
    total_predictions: number;
    correct_predictions: number;
    false_positives: number;
    false_negatives: number;
    economic_value: number;
  };
  performance_score?: number;
  improvement_recommendations: string[];
  created_at: string;
}

export interface BacktestRequest {
  modelName: string;
  testPeriods: Array<{
    start: string;
    end: string;
  }>;
  metrics: string[];
}

// Diplomatic Communications Types
export interface DiplomaticCommunication {
  id: string;
  source_country: string;
  target_country?: string;
  communication_type: 'official_statement' | 'diplomatic_note' | 'summit_readout' | 'press_conference' | 'social_media';
  content_summary: string;
  tone_analysis: {
    overall_tone: string;
    key_phrases: string[];
    emotional_indicators: Record<string, number>;
    formality_level: number;
  };
  hidden_meanings: Record<string, string>;
  cultural_context: Record<string, string>;
  significance_score?: number; // 1-10
  created_at: string;
  communication_date: string;
}

// Collaborative Documents Types
export interface CollaborativeDocument {
  id: string;
  title: string;
  document_type: 'strategy_analysis' | 'risk_assessment' | 'scenario_plan' | 'policy_brief';
  content: Record<string, unknown>;
  owner_id: string;
  collaborators: string[];
  permissions: {
    read: string[];
    write: string[];
    admin: string[];
  };
  version: number;
  status: 'draft' | 'review' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface DocumentVersion {
  id: string;
  document_id: string;
  version_number: number;
  content: Record<string, unknown>;
  changes_summary?: string;
  author_id?: string;
  created_at: string;
}

// Assessment Types
export interface AssessmentRequest {
  studentId: string;
  moduleId: string;
  responses: Array<{
    questionId: string;
    answer: string | number | boolean | string[];
    timeSpent: number;
  }>;
}

export interface AssessmentResponse {
  overallScore: number;
  completionPercentage: number;
  conceptMastery: Record<string, number>;
  detailedFeedback: Array<{
    questionId: string;
    correct: boolean;
    feedback: string;
    conceptsInvolved: string[];
  }>;
  recommendations: {
    nextModules: string[];
    reviewTopics: string[];
    studyStrategies: string[];
  };
  performanceAnalytics: {
    timeSpentPerQuestion: Record<string, number>;
    difficultyProgression: number[];
    learningVelocity: number;
  };
}

// Predictive Analytics Types
export interface PredictiveRequest {
  metrics: string[];
  timeframe: string;
  regions: string[];
  eventTypes: string[];
}

export interface PredictiveAnalytics {
  predictions: Array<{
    event: string;
    probability: number;
    confidence_interval: [number, number];
    timeline: {
      expected_date: string;
      earliest_date: string;
      latest_date: string;
    };
    impact_assessment: {
      market_impact_score: number; // -100 to 100
      affected_sectors: string[];
      geographic_scope: string[];
    };
    trigger_indicators: Array<{
      indicator: string;
      current_value: number;
      threshold_value: number;
      importance: number;
    }>;
  }>;
  correlation_matrix: Record<string, Record<string, number>>;
  risk_adjusted_returns: Record<string, number>;
  scenario_analysis: {
    best_case: { probability: number; description: string };
    worst_case: { probability: number; description: string };
    base_case: { probability: number; description: string };
  };
  generatedAt: string;
  dataFreshness: Record<string, string>;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// WebSocket Message Types
export interface WebSocketMessage {
  type: 'risk_update' | 'crisis_alert' | 'simulation_complete' | 'sentiment_update';
  payload: Record<string, unknown>;
  timestamp: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

// Error Types
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string | number | boolean>;
  timestamp: string;
}

// Configuration Types
export interface PlatformConfig {
  apiEndpoints: Record<string, string>;
  updateIntervals: Record<string, number>;
  cacheSettings: Record<string, number>;
  features: Record<string, boolean>;
}

// Export utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
