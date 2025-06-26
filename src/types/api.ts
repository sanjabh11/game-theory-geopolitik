// Base API Response Type
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    totalResults?: number;
    page?: number;
    pageSize?: number;
    lastUpdated?: string;
  };
}

// News API Types
export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  source: {
    id: string;
    name: string;
  };
  author?: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  relevanceScore: number;
}

export interface NewsQuery {
  q: string;
  from?: string;
  to?: string;
  sortBy?: 'relevancy' | 'popularity' | 'publishedAt';
  sources?: string;
  domains?: string;
  language?: string;
  pageSize?: number;
  page?: number;
}

// Economic Data Types
export interface EconomicIndicator {
  name: string;
  country: string;
  unit: string;
  data: Array<{
    date: string;
    value: number;
    change: number;
  }>;
  lastUpdated: string;
}

export interface EconomicData {
  country: string;
  indicators: {
    gdp: {
      value: number;
      change: number;
      trend: 'positive' | 'negative' | 'stable';
      unit: string;
    };
    inflation: {
      value: number;
      change: number;
      trend: 'positive' | 'negative' | 'stable';
      unit: string;
    };
    unemployment: {
      value: number;
      change: number;
      trend: 'positive' | 'negative' | 'stable';
      unit: string;
    };
    interestRate: {
      value: number;
      change: number;
      trend: 'positive' | 'negative' | 'stable';
      unit: string;
    };
    tradeBalance: {
      value: number;
      change: number;
      trend: 'positive' | 'negative' | 'stable';
      unit: string;
    };
    currencyStrength: {
      value: number;
      change: number;
      trend: 'positive' | 'negative' | 'stable';
      unit: string;
    };
  };
  riskScore: number;
  lastUpdated: string;
}

// Risk Assessment Types
export interface RiskFactor {
  id: string;
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  likelihood: number; // 0-100
  impact: number; // 0-100
  category: 'economic' | 'political' | 'social' | 'military' | 'environmental';
  region: string;
  sources: string[];
  lastUpdated: string;
}

export interface RiskAssessment {
  region: string;
  overallRiskScore: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  confidence: number;
  factors: RiskFactor[];
  trends: Array<{
    factor: string;
    direction: 'increasing' | 'decreasing' | 'stable';
    rate: number;
  }>;
  recommendations: string[];
  lastAnalyzed: string;
}

// Scenario Types
export interface Scenario {
  id: string;
  title: string;
  description: string;
  region: string;
  category: 'economic' | 'political' | 'military' | 'environmental' | 'social';
  parameters: Record<string, string | number | boolean>;
  outcomes: ScenarioOutcome[];
  probability: number;
  timeframe: string;
  createdBy: string;
  createdAt: string;
  status: 'draft' | 'active' | 'archived';
}

export interface ScenarioOutcome {
  id: string;
  title: string;
  description: string;
  probability: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
  timeframe: string;
  consequences: string[];
  mitigation: string[];
}

// Crisis Types
export interface Crisis {
  id: string;
  title: string;
  description: string;
  region: string;
  type: 'political' | 'economic' | 'military' | 'natural' | 'technological' | 'social';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'emerging' | 'active' | 'escalating' | 'de-escalating' | 'resolved';
  startDate: string;
  endDate?: string;
  affectedCountries: string[];
  keyEvents: CrisisEvent[];
  indicators: CrisisIndicator[];
  response: CrisisResponse[];
  lastUpdated: string;
}

export interface CrisisEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  source: string;
  impact: number; // 0-100
}

export interface CrisisIndicator {
  name: string;
  value: number;
  threshold: number;
  status: 'normal' | 'warning' | 'critical';
  trend: 'improving' | 'worsening' | 'stable';
  lastUpdated: string;
}

export interface CrisisResponse {
  id: string;
  actor: string;
  action: string;
  timestamp: string;
  effectiveness: number; // 0-100
  category: 'diplomatic' | 'economic' | 'military' | 'humanitarian';
}

// Predictive Analytics Types
export interface Prediction {
  id: string;
  indicator: string;
  region: string;
  currentValue: number;
  predictedValue: number;
  confidence: number; // 0-100
  timeframe: string;
  trend: 'increasing' | 'decreasing' | 'stable';
  factors: string[];
  methodology: string;
  createdAt: string;
  validUntil: string;
}

export interface PredictiveModel {
  id: string;
  name: string;
  description: string;
  type: 'regression' | 'classification' | 'time_series' | 'neural_network';
  accuracy: number; // 0-100
  inputs: string[];
  outputs: string[];
  lastTrained: string;
  version: string;
}

// Collaboration Types
export interface CollaborationWorkspace {
  id: string;
  name: string;
  description: string;
  type: 'analysis' | 'scenario' | 'crisis_response' | 'research';
  participants: WorkspaceParticipant[];
  documents: WorkspaceDocument[];
  discussions: Discussion[];
  tasks: Task[];
  status: 'active' | 'archived' | 'suspended';
  createdBy: string;
  createdAt: string;
  lastActivity: string;
}

export interface WorkspaceParticipant {
  userId: string;
  role: 'owner' | 'admin' | 'analyst' | 'viewer' | 'contributor';
  permissions: string[];
  joinedAt: string;
  lastActive: string;
}

export interface WorkspaceDocument {
  id: string;
  title: string;
  type: 'analysis' | 'report' | 'data' | 'presentation' | 'other';
  content: string;
  version: number;
  authorId: string;
  createdAt: string;
  lastModified: string;
  tags: string[];
  attachments: string[];
}

export interface Discussion {
  id: string;
  title: string;
  category: 'general' | 'analysis' | 'planning' | 'review';
  messages: Message[];
  participants: string[];
  status: 'open' | 'closed' | 'resolved';
  createdBy: string;
  createdAt: string;
  lastMessage: string;
}

export interface Message {
  id: string;
  content: string;
  authorId: string;
  timestamp: string;
  edited?: boolean;
  editedAt?: string;
  reactions: Array<{
    emoji: string;
    count: number;
    users: string[];
  }>;
  replies: Message[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assigneeId: string;
  status: 'pending' | 'in_progress' | 'review' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: string;
  createdBy: string;
  createdAt: string;
  completedAt?: string;
  dependencies: string[];
  tags: string[];
}

// Social Media Types (Reddit)
export interface SocialMediaPost {
  id: string;
  platform: 'reddit' | 'twitter' | 'facebook' | 'linkedin';
  title: string;
  content: string;
  author: string;
  timestamp: string;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
  sentiment: 'positive' | 'negative' | 'neutral';
  relevanceScore: number;
  topics: string[];
  region?: string;
}

export interface SentimentAnalysis {
  overall: 'positive' | 'negative' | 'neutral';
  score: number; // -100 to 100
  breakdown: {
    positive: number;
    negative: number;
    neutral: number;
  };
  trends: Array<{
    period: string;
    sentiment: number;
    volume: number;
  }>;
  topics: Array<{
    name: string;
    sentiment: number;
    mentions: number;
  }>;
}

// General Analytics Types
export interface AnalyticsData {
  timeframe: {
    start: string;
    end: string;
  };
  metrics: Array<{
    name: string;
    value: number;
    change: number;
    unit: string;
  }>;
  charts: Array<{
    type: 'line' | 'bar' | 'pie' | 'area' | 'scatter';
    title: string;
    data: Array<Record<string, unknown>>;
    config: Record<string, unknown>;
  }>;
}

// Alert Types
export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  category: 'crisis' | 'risk' | 'prediction' | 'news' | 'system';
  source: string;
  timestamp: string;
  read: boolean;
  actionRequired: boolean;
  relatedItems: Array<{
    type: string;
    id: string;
    title: string;
  }>;
}
