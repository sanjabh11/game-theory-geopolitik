-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- User profiles extending Supabase auth
CREATE TABLE user_profiles (
    id UUID REFERENCES auth.users PRIMARY KEY,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'professor', 'analyst', 'policymaker', 'researcher')),
    organization TEXT,
    preferences JSONB DEFAULT '{}',
    notification_settings JSONB DEFAULT '{"email": true, "push": false, "sms": false}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Game Theory Learning Progress
CREATE TABLE learning_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    module_id TEXT NOT NULL,
    module_name TEXT NOT NULL,
    completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    score INTEGER DEFAULT 0,
    time_spent_minutes INTEGER DEFAULT 0,
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    performance_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, module_id)
);

-- Geopolitical Risk Assessments
CREATE TABLE risk_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    region TEXT NOT NULL,
    country_code TEXT,
    risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
    risk_level TEXT NOT NULL CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    factors JSONB NOT NULL,
    confidence_interval JSONB NOT NULL,
    trend TEXT CHECK (trend IN ('IMPROVING', 'STABLE', 'DETERIORATING')),
    source_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Scenario Simulations
CREATE TABLE scenario_simulations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    scenario_type TEXT NOT NULL CHECK (scenario_type IN ('military_conflict', 'trade_war', 'diplomatic_crisis', 'cyber_warfare', 'economic_sanctions')),
    scenario_config JSONB NOT NULL,
    results JSONB,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Alert Configurations
CREATE TABLE alert_configurations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    alert_type TEXT NOT NULL CHECK (alert_type IN ('crisis_monitoring', 'risk_threshold', 'custom_keyword', 'economic_indicator')),
    criteria JSONB NOT NULL,
    notification_settings JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_triggered TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crisis Events and Alerts
CREATE TABLE crisis_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    event_type TEXT NOT NULL,
    severity INTEGER NOT NULL CHECK (severity >= 1 AND severity <= 5),
    regions TEXT[] NOT NULL,
    keywords TEXT[] DEFAULT '{}',
    source_urls TEXT[] DEFAULT '{}',
    confidence_score FLOAT CHECK (confidence_score >= 0 AND confidence_score <= 1),
    escalation_potential TEXT CHECK (escalation_potential IN ('LOW', 'MEDIUM', 'HIGH')),
    timeline_urgency TEXT CHECK (timeline_urgency IN ('IMMEDIATE', 'SHORT_TERM', 'MEDIUM_TERM')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Historical Patterns
CREATE TABLE historical_patterns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pattern_type TEXT NOT NULL,
    pattern_name TEXT NOT NULL,
    description TEXT NOT NULL,
    time_period DATERANGE NOT NULL,
    regions TEXT[] NOT NULL,
    examples JSONB NOT NULL,
    statistical_significance FLOAT CHECK (statistical_significance >= 0 AND statistical_significance <= 1),
    confidence_level FLOAT CHECK (confidence_level >= 0 AND confidence_level <= 1),
    predictive_power FLOAT CHECK (predictive_power >= 0 AND predictive_power <= 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Economic Impact Models
CREATE TABLE economic_models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scenario_id TEXT NOT NULL,
    model_name TEXT NOT NULL,
    model_type TEXT NOT NULL CHECK (model_type IN ('CGE', 'VAR', 'INPUT_OUTPUT', 'GAME_THEORETIC')),
    parameters JSONB NOT NULL,
    results JSONB,
    baseline_data JSONB,
    assumptions JSONB DEFAULT '{}',
    uncertainty_range JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Social Media Sentiment Data
CREATE TABLE sentiment_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform TEXT NOT NULL CHECK (platform IN ('twitter', 'facebook', 'reddit', 'telegram', 'tiktok', 'linkedin')),
    region TEXT NOT NULL,
    country_code TEXT,
    sentiment_score FLOAT NOT NULL CHECK (sentiment_score >= -1 AND sentiment_score <= 1),
    volume INTEGER NOT NULL DEFAULT 0,
    topics JSONB NOT NULL DEFAULT '[]',
    demographic_breakdown JSONB DEFAULT '{}',
    influence_metrics JSONB DEFAULT '{}',
    bot_probability FLOAT CHECK (bot_probability >= 0 AND bot_probability <= 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prediction Model Performance Tracking
CREATE TABLE model_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_name TEXT NOT NULL,
    model_version TEXT NOT NULL,
    test_period DATERANGE NOT NULL,
    accuracy_metrics JSONB NOT NULL,
    backtesting_results JSONB NOT NULL,
    performance_score FLOAT CHECK (performance_score >= 0 AND performance_score <= 1),
    improvement_recommendations TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Diplomatic Communications Analysis
CREATE TABLE diplomatic_communications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_country TEXT NOT NULL,
    target_country TEXT,
    communication_type TEXT NOT NULL CHECK (communication_type IN ('official_statement', 'diplomatic_note', 'summit_readout', 'press_conference', 'social_media')),
    content_summary TEXT NOT NULL,
    tone_analysis JSONB NOT NULL,
    hidden_meanings JSONB DEFAULT '{}',
    cultural_context JSONB DEFAULT '{}',
    significance_score INTEGER CHECK (significance_score >= 1 AND significance_score <= 10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    communication_date TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Collaborative Documents
CREATE TABLE collaborative_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    document_type TEXT NOT NULL CHECK (document_type IN ('strategy_analysis', 'risk_assessment', 'scenario_plan', 'policy_brief')),
    content JSONB NOT NULL,
    owner_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    collaborators UUID[] DEFAULT '{}',
    permissions JSONB NOT NULL DEFAULT '{"read": [], "write": [], "admin": []}',
    version INTEGER DEFAULT 1,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Document Versions (for collaboration history)
CREATE TABLE document_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES collaborative_documents(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    content JSONB NOT NULL,
    changes_summary TEXT,
    author_id UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_learning_progress_user_id ON learning_progress(user_id);
CREATE INDEX idx_learning_progress_module_id ON learning_progress(module_id);
CREATE INDEX idx_risk_assessments_region ON risk_assessments(region);
CREATE INDEX idx_risk_assessments_created_at ON risk_assessments(created_at);
CREATE INDEX idx_risk_assessments_expires_at ON risk_assessments(expires_at);
CREATE INDEX idx_scenario_simulations_user_id ON scenario_simulations(user_id);
CREATE INDEX idx_scenario_simulations_type ON scenario_simulations(scenario_type);
CREATE INDEX idx_alert_configurations_user_id ON alert_configurations(user_id);
CREATE INDEX idx_alert_configurations_active ON alert_configurations(is_active);
CREATE INDEX idx_crisis_events_severity ON crisis_events(severity);
CREATE INDEX idx_crisis_events_regions ON crisis_events USING GIN(regions);
CREATE INDEX idx_crisis_events_created_at ON crisis_events(created_at);
CREATE INDEX idx_sentiment_data_platform_region ON sentiment_data(platform, region);
CREATE INDEX idx_sentiment_data_created_at ON sentiment_data(created_at);
CREATE INDEX idx_diplomatic_communications_countries ON diplomatic_communications(source_country, target_country);
CREATE INDEX idx_diplomatic_communications_date ON diplomatic_communications(communication_date);
CREATE INDEX idx_collaborative_documents_owner ON collaborative_documents(owner_id);
CREATE INDEX idx_collaborative_documents_collaborators ON collaborative_documents USING GIN(collaborators);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenario_simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaborative_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_versions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view their own learning progress" ON learning_progress
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own simulations" ON scenario_simulations
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own alerts" ON alert_configurations
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view public risk assessments" ON risk_assessments
    FOR SELECT USING (true);

CREATE POLICY "Users can view public crisis events" ON crisis_events
    FOR SELECT USING (true);

CREATE POLICY "Users can view public historical patterns" ON historical_patterns
    FOR SELECT USING (true);

CREATE POLICY "Users can view public sentiment data" ON sentiment_data
    FOR SELECT USING (true);

CREATE POLICY "Users can view public diplomatic communications" ON diplomatic_communications
    FOR SELECT USING (true);

CREATE POLICY "Document owners and collaborators can access documents" ON collaborative_documents
    FOR SELECT USING (
        auth.uid() = owner_id OR 
        auth.uid() = ANY(collaborators) OR
        auth.uid() = ANY((permissions->>'read')::uuid[]) OR
        auth.uid() = ANY((permissions->>'write')::uuid[]) OR
        auth.uid() = ANY((permissions->>'admin')::uuid[])
    );

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alert_configurations_updated_at BEFORE UPDATE ON alert_configurations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_historical_patterns_updated_at BEFORE UPDATE ON historical_patterns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collaborative_documents_updated_at BEFORE UPDATE ON collaborative_documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
