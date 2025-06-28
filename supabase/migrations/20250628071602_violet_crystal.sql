/*
  # Mental Model Advisor Schema

  1. New Tables
    - `mental_models` - Core mental model definitions
    - `mental_model_problems` - User submitted problems
    - `mental_model_solutions` - Generated solutions
    - `mental_model_sessions` - User sessions and preferences
    - `model_performance_tracking` - Performance analytics

  2. Security
    - Enable RLS on all tables
    - Add policies for user access control
*/

-- Mental Models Core Table
CREATE TABLE mental_models (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('cognitive', 'strategic', 'analytical', 'creative', 'systems')),
    complexity_score INTEGER NOT NULL CHECK (complexity_score >= 1 AND complexity_score <= 10),
    application_scenarios TEXT[] NOT NULL DEFAULT '{}',
    prompt_template TEXT NOT NULL,
    performance_metrics JSONB NOT NULL DEFAULT '{
        "accuracy": 0,
        "relevance_score": 0,
        "usage_count": 0,
        "success_rate": 0
    }',
    description TEXT NOT NULL,
    limitations TEXT[] DEFAULT '{}',
    case_study TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Problems Table
CREATE TABLE mental_model_problems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    problem_text TEXT NOT NULL,
    domain TEXT NOT NULL,
    urgency TEXT NOT NULL CHECK (urgency IN ('low', 'medium', 'high', 'critical')),
    stakeholders TEXT[] DEFAULT '{}',
    context JSONB DEFAULT '{}',
    structured_data JSONB NOT NULL DEFAULT '{
        "core_issue": "",
        "complexity_level": 5,
        "problem_type": "",
        "constraints": []
    }',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Generated Solutions Table
CREATE TABLE mental_model_solutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    problem_id UUID REFERENCES mental_model_problems(id) ON DELETE CASCADE,
    model_id TEXT REFERENCES mental_models(id) ON DELETE CASCADE,
    solution_variants JSONB NOT NULL DEFAULT '[]',
    bias_analysis JSONB NOT NULL DEFAULT '{
        "risk_score": 0,
        "detected_biases": [],
        "confidence_level": 0
    }',
    stakeholder_views JSONB DEFAULT '{}',
    complexity_level TEXT NOT NULL CHECK (complexity_level IN ('novice', 'intermediate', 'expert')),
    export_formats JSONB DEFAULT '{
        "executive_summary": "",
        "technical_deep_dive": "",
        "metrics_csv": ""
    }',
    user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Sessions Table
CREATE TABLE mental_model_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    is_guest BOOLEAN DEFAULT false,
    request_count INTEGER DEFAULT 0,
    max_requests INTEGER DEFAULT 1000,
    problems TEXT[] DEFAULT '{}',
    solutions TEXT[] DEFAULT '{}',
    preferences JSONB DEFAULT '{
        "complexity_level": "intermediate",
        "preferred_categories": [],
        "urgency_default": "medium"
    }',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Model Performance Tracking
CREATE TABLE model_performance_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_id TEXT REFERENCES mental_models(id) ON DELETE CASCADE,
    problem_domain TEXT NOT NULL,
    user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
    solution_effectiveness INTEGER CHECK (solution_effectiveness >= 1 AND solution_effectiveness <= 10),
    time_to_solution INTEGER, -- in seconds
    user_feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Collaborative Sessions for Mental Models
CREATE TABLE mental_model_collaborations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    problem_id UUID REFERENCES mental_model_problems(id) ON DELETE CASCADE,
    participants JSONB NOT NULL DEFAULT '[]',
    shared_solutions UUID[] DEFAULT '{}',
    comments JSONB DEFAULT '[]',
    version_history JSONB DEFAULT '[]',
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_mental_models_category ON mental_models(category);
CREATE INDEX idx_mental_models_complexity ON mental_models(complexity_score);
CREATE INDEX idx_mental_model_problems_user_id ON mental_model_problems(user_id);
CREATE INDEX idx_mental_model_problems_domain ON mental_model_problems(domain);
CREATE INDEX idx_mental_model_solutions_problem_id ON mental_model_solutions(problem_id);
CREATE INDEX idx_mental_model_solutions_model_id ON mental_model_solutions(model_id);
CREATE INDEX idx_mental_model_sessions_user_id ON mental_model_sessions(user_id);
CREATE INDEX idx_mental_model_sessions_expires_at ON mental_model_sessions(expires_at);
CREATE INDEX idx_model_performance_model_id ON model_performance_tracking(model_id);

-- Enable Row Level Security
ALTER TABLE mental_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE mental_model_problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE mental_model_solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mental_model_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_performance_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE mental_model_collaborations ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Mental models are publicly readable
CREATE POLICY "Mental models are publicly readable" ON mental_models
    FOR SELECT USING (true);

-- Users can only access their own problems
CREATE POLICY "Users can manage their own problems" ON mental_model_problems
    FOR ALL USING (auth.uid() = user_id);

-- Users can only access solutions for their problems
CREATE POLICY "Users can access solutions for their problems" ON mental_model_solutions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM mental_model_problems 
            WHERE mental_model_problems.id = mental_model_solutions.problem_id 
            AND mental_model_problems.user_id = auth.uid()
        )
    );

-- Users can insert solutions for their problems
CREATE POLICY "Users can create solutions for their problems" ON mental_model_solutions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM mental_model_problems 
            WHERE mental_model_problems.id = mental_model_solutions.problem_id 
            AND mental_model_problems.user_id = auth.uid()
        )
    );

-- Users can update their own solutions
CREATE POLICY "Users can update their own solutions" ON mental_model_solutions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM mental_model_problems 
            WHERE mental_model_problems.id = mental_model_solutions.problem_id 
            AND mental_model_problems.user_id = auth.uid()
        )
    );

-- Users can manage their own sessions
CREATE POLICY "Users can manage their own sessions" ON mental_model_sessions
    FOR ALL USING (auth.uid() = user_id);

-- Users can add performance tracking data
CREATE POLICY "Users can add performance tracking" ON model_performance_tracking
    FOR INSERT WITH CHECK (true);

-- Users can view performance tracking data
CREATE POLICY "Performance tracking is publicly readable" ON model_performance_tracking
    FOR SELECT USING (true);

-- Collaboration policies
CREATE POLICY "Users can access collaborations they participate in" ON mental_model_collaborations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM mental_model_problems 
            WHERE mental_model_problems.id = mental_model_collaborations.problem_id 
            AND mental_model_problems.user_id = auth.uid()
        ) OR
        auth.uid()::text = ANY(
            SELECT jsonb_array_elements_text(participants->'user_ids')
        )
    );

-- Triggers for updated_at timestamps
CREATE TRIGGER update_mental_models_updated_at BEFORE UPDATE ON mental_models
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default mental models
INSERT INTO mental_models (id, name, category, complexity_score, application_scenarios, prompt_template, description, limitations, case_study) VALUES
('first-principles', 'First Principles Thinking', 'analytical', 6, 
 ARRAY['Problem solving', 'Innovation', 'Decision making'], 
 'Break down {problem} into fundamental components and rebuild from basic truths. Question all assumptions and start from verified facts.',
 'A reasoning method that breaks down complex problems into basic elements and builds up from there.',
 ARRAY['Time-intensive', 'May overlook practical constraints', 'Requires deep domain knowledge'],
 'Elon Musk used first principles to revolutionize rocket design by questioning fundamental assumptions about cost and materials.'),

('systems-thinking', 'Systems Thinking', 'systems', 8,
 ARRAY['Complex problems', 'Organizational change', 'Strategy'],
 'Analyze {problem} as part of interconnected systems. Map relationships, feedback loops, and emergent properties.',
 'A holistic approach that views problems as part of larger interconnected systems.',
 ARRAY['Can be overwhelming', 'Requires broad perspective', 'May lead to analysis paralysis'],
 'Toyota Production System uses systems thinking to optimize manufacturing processes through continuous improvement.'),

('design-thinking', 'Design Thinking', 'creative', 5,
 ARRAY['Innovation', 'User experience', 'Product development'],
 'Apply human-centered design to {problem}. Empathize with users, define problems, ideate solutions, prototype, and test.',
 'A human-centered approach to innovation that integrates needs, technology, and business requirements.',
 ARRAY['May lack analytical rigor', 'Time-consuming process', 'Requires diverse team'],
 'IDEO used design thinking to redesign the shopping cart, focusing on user needs and constraints.'),

('pareto-principle', 'Pareto Principle (80/20 Rule)', 'analytical', 3,
 ARRAY['Prioritization', 'Resource allocation', 'Efficiency'],
 'Apply the 80/20 rule to {problem}. Identify the 20% of causes that create 80% of effects.',
 'The principle that roughly 80% of effects come from 20% of causes.',
 ARRAY['Oversimplification', 'Not always 80/20 split', 'May ignore important minorities'],
 'Microsoft found that fixing the top 20% of bugs eliminated 80% of crashes and errors.'),

('swot-analysis', 'SWOT Analysis', 'strategic', 4,
 ARRAY['Strategic planning', 'Business analysis', 'Decision making'],
 'Analyze {problem} through Strengths, Weaknesses, Opportunities, and Threats framework.',
 'A strategic planning technique to evaluate internal and external factors affecting a situation.',
 ARRAY['Static snapshot', 'Subjective assessments', 'No prioritization guidance'],
 'Starbucks used SWOT analysis to identify expansion opportunities in emerging markets.');