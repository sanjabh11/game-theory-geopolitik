-- Check if policies exist before creating them
DO $$
BEGIN
    -- Drop existing policies if they exist to avoid conflicts
    DROP POLICY IF EXISTS "Mental models are publicly readable" ON mental_models;
    DROP POLICY IF EXISTS "Users can manage their own problems" ON mental_model_problems;
    DROP POLICY IF EXISTS "Users can access solutions for their problems" ON mental_model_solutions;
    DROP POLICY IF EXISTS "Users can create solutions for their problems" ON mental_model_solutions;
    DROP POLICY IF EXISTS "Users can update their own solutions" ON mental_model_solutions;
    DROP POLICY IF EXISTS "Users can manage their own sessions" ON mental_model_sessions;
    DROP POLICY IF EXISTS "Performance tracking is publicly readable" ON model_performance_tracking;
    DROP POLICY IF EXISTS "Users can add performance tracking" ON model_performance_tracking;
    DROP POLICY IF EXISTS "Users can access collaborations they participate in" ON mental_model_collaborations;
END
$$;

-- Mental Models Table
CREATE TABLE IF NOT EXISTS mental_models (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('cognitive', 'strategic', 'analytical', 'creative', 'systems')),
  complexity_score INTEGER NOT NULL CHECK (complexity_score >= 1 AND complexity_score <= 10),
  application_scenarios TEXT[] NOT NULL DEFAULT '{}',
  prompt_template TEXT NOT NULL,
  performance_metrics JSONB NOT NULL DEFAULT '{"accuracy": 0, "usage_count": 0, "success_rate": 0, "relevance_score": 0}',
  description TEXT NOT NULL,
  limitations TEXT[] DEFAULT '{}',
  case_study TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- User Problem Submissions
CREATE TABLE IF NOT EXISTS mental_model_problems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id),
  problem_text TEXT NOT NULL,
  domain TEXT NOT NULL,
  urgency TEXT NOT NULL,
  stakeholders TEXT[] DEFAULT '{}',
  context JSONB DEFAULT '{}',
  structured_data JSONB NOT NULL DEFAULT '{"core_issue": "", "constraints": [], "problem_type": "", "complexity_level": 5}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Model-Generated Solutions
CREATE TABLE IF NOT EXISTS mental_model_solutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  problem_id UUID REFERENCES mental_model_problems(id),
  model_id TEXT REFERENCES mental_models(id),
  solution_variants JSONB NOT NULL DEFAULT '[]',
  bias_analysis JSONB NOT NULL DEFAULT '{"risk_score": 0, "detected_biases": [], "confidence_level": 0}',
  stakeholder_views JSONB DEFAULT '{}',
  complexity_level TEXT NOT NULL CHECK (complexity_level IN ('novice', 'intermediate', 'expert')),
  export_formats JSONB DEFAULT '{"metrics_csv": "", "executive_summary": "", "technical_deep_dive": ""}',
  user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- User Sessions
CREATE TABLE IF NOT EXISTS mental_model_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id),
  is_guest BOOLEAN DEFAULT false,
  request_count INTEGER DEFAULT 0,
  max_requests INTEGER DEFAULT 1000,
  problems TEXT[] DEFAULT '{}',
  solutions TEXT[] DEFAULT '{}',
  preferences JSONB DEFAULT '{"urgency_default": "medium", "complexity_level": "intermediate", "preferred_categories": []}',
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL
);

-- Model Performance Tracking
CREATE TABLE IF NOT EXISTS model_performance_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id TEXT REFERENCES mental_models(id),
  problem_domain TEXT NOT NULL,
  user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
  solution_effectiveness INTEGER CHECK (solution_effectiveness >= 1 AND solution_effectiveness <= 10),
  time_to_solution INTEGER,
  user_feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Collaborative Problem Solving
CREATE TABLE IF NOT EXISTS mental_model_collaborations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  problem_id UUID REFERENCES mental_model_problems(id),
  participants JSONB NOT NULL DEFAULT '[]',
  shared_solutions UUID[] DEFAULT '{}',
  comments JSONB DEFAULT '[]',
  version_history JSONB DEFAULT '[]',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_mental_models_category ON mental_models(category);
CREATE INDEX IF NOT EXISTS idx_mental_models_complexity ON mental_models(complexity_score);
CREATE INDEX IF NOT EXISTS idx_mental_model_problems_user_id ON mental_model_problems(user_id);
CREATE INDEX IF NOT EXISTS idx_mental_model_problems_domain ON mental_model_problems(domain);
CREATE INDEX IF NOT EXISTS idx_mental_model_solutions_problem_id ON mental_model_solutions(problem_id);
CREATE INDEX IF NOT EXISTS idx_mental_model_solutions_model_id ON mental_model_solutions(model_id);
CREATE INDEX IF NOT EXISTS idx_mental_model_sessions_user_id ON mental_model_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_mental_model_sessions_expires_at ON mental_model_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_model_performance_model_id ON model_performance_tracking(model_id);

-- Enable Row Level Security
DO $$
BEGIN
    -- Only enable RLS if it's not already enabled
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE tablename = 'mental_models' 
        AND rowsecurity = true
    ) THEN
        ALTER TABLE mental_models ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE tablename = 'mental_model_problems' 
        AND rowsecurity = true
    ) THEN
        ALTER TABLE mental_model_problems ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE tablename = 'mental_model_solutions' 
        AND rowsecurity = true
    ) THEN
        ALTER TABLE mental_model_solutions ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE tablename = 'mental_model_sessions' 
        AND rowsecurity = true
    ) THEN
        ALTER TABLE mental_model_sessions ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE tablename = 'model_performance_tracking' 
        AND rowsecurity = true
    ) THEN
        ALTER TABLE model_performance_tracking ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE tablename = 'mental_model_collaborations' 
        AND rowsecurity = true
    ) THEN
        ALTER TABLE mental_model_collaborations ENABLE ROW LEVEL SECURITY;
    END IF;
END
$$;

-- RLS Policies
DO $$
BEGIN
    -- Only create policies if they don't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'mental_models' 
        AND policyname = 'Mental models are publicly readable'
    ) THEN
        CREATE POLICY "Mental models are publicly readable" ON mental_models
          FOR SELECT TO public USING (true);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'mental_model_problems' 
        AND policyname = 'Users can manage their own problems'
    ) THEN
        CREATE POLICY "Users can manage their own problems" ON mental_model_problems
          FOR ALL TO public USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'mental_model_solutions' 
        AND policyname = 'Users can access solutions for their problems'
    ) THEN
        CREATE POLICY "Users can access solutions for their problems" ON mental_model_solutions
          FOR SELECT TO public USING (EXISTS (
            SELECT 1 FROM mental_model_problems
            WHERE mental_model_problems.id = mental_model_solutions.problem_id
            AND mental_model_problems.user_id = auth.uid()
          ));
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'mental_model_solutions' 
        AND policyname = 'Users can create solutions for their problems'
    ) THEN
        CREATE POLICY "Users can create solutions for their problems" ON mental_model_solutions
          FOR INSERT TO public WITH CHECK (EXISTS (
            SELECT 1 FROM mental_model_problems
            WHERE mental_model_problems.id = mental_model_solutions.problem_id
            AND mental_model_problems.user_id = auth.uid()
          ));
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'mental_model_solutions' 
        AND policyname = 'Users can update their own solutions'
    ) THEN
        CREATE POLICY "Users can update their own solutions" ON mental_model_solutions
          FOR UPDATE TO public USING (EXISTS (
            SELECT 1 FROM mental_model_problems
            WHERE mental_model_problems.id = mental_model_solutions.problem_id
            AND mental_model_problems.user_id = auth.uid()
          ));
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'mental_model_sessions' 
        AND policyname = 'Users can manage their own sessions'
    ) THEN
        CREATE POLICY "Users can manage their own sessions" ON mental_model_sessions
          FOR ALL TO public USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'model_performance_tracking' 
        AND policyname = 'Performance tracking is publicly readable'
    ) THEN
        CREATE POLICY "Performance tracking is publicly readable" ON model_performance_tracking
          FOR SELECT TO public USING (true);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'model_performance_tracking' 
        AND policyname = 'Users can add performance tracking'
    ) THEN
        CREATE POLICY "Users can add performance tracking" ON model_performance_tracking
          FOR INSERT TO public WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'mental_model_collaborations' 
        AND policyname = 'Users can access collaborations they participate in'
    ) THEN
        CREATE POLICY "Users can access collaborations they participate in" ON mental_model_collaborations
          FOR SELECT TO public USING (
            EXISTS (
              SELECT 1 FROM mental_model_problems
              WHERE mental_model_problems.id = mental_model_collaborations.problem_id
              AND mental_model_problems.user_id = auth.uid()
            ) OR 
            auth.uid()::text IN (
              SELECT jsonb_array_elements_text(mental_model_collaborations.participants->'user_ids')
            )
          );
    END IF;
END
$$;

-- Triggers for updated_at timestamps
DO $$
BEGIN
    -- Create function if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_proc 
        WHERE proname = 'update_mental_models_updated_at'
    ) THEN
        CREATE OR REPLACE FUNCTION update_mental_models_updated_at()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
    END IF;
    
    -- Create trigger if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_mental_models_updated_at'
    ) THEN
        CREATE TRIGGER update_mental_models_updated_at
        BEFORE UPDATE ON mental_models
        FOR EACH ROW EXECUTE FUNCTION update_mental_models_updated_at();
    END IF;
END
$$;

-- Insert initial mental models if table is empty
INSERT INTO mental_models (id, name, category, complexity_score, application_scenarios, prompt_template, description, limitations)
SELECT 
  'first_principles', 'First Principles', 'analytical', 7, 
  ARRAY['problem decomposition', 'innovation', 'strategic planning'],
  'Analyze {problem} by breaking it down to its fundamental truths and reasoning up from there. Identify the core components, question assumptions, and rebuild from essential elements.',
  'A method of thinking that involves breaking down complex problems into basic elements and then reassembling them from the ground up.',
  ARRAY['Time-consuming', 'Requires deep domain knowledge', 'May miss emergent properties']
WHERE NOT EXISTS (SELECT 1 FROM mental_models WHERE id = 'first_principles');

INSERT INTO mental_models (id, name, category, complexity_score, application_scenarios, prompt_template, description, limitations)
SELECT 
  'nash_equilibrium', 'Nash Equilibrium', 'strategic', 8, 
  ARRAY['conflict resolution', 'negotiation', 'competitive strategy'],
  'Identify the key actors in {problem}, their possible strategies, and payoffs. Find the state where no actor can benefit by changing only their own strategy while others remain constant.',
  'A concept in game theory where the optimal outcome occurs when there is no incentive for players to deviate from their initial strategy.',
  ARRAY['Assumes rational actors', 'Multiple equilibria may exist', 'Difficult to calculate in complex scenarios']
WHERE NOT EXISTS (SELECT 1 FROM mental_models WHERE id = 'nash_equilibrium');

INSERT INTO mental_models (id, name, category, complexity_score, application_scenarios, prompt_template, description, limitations)
SELECT 
  'systems_thinking', 'Systems Thinking', 'systems', 9, 
  ARRAY['complex problem solving', 'organizational design', 'policy development'],
  'Analyze {problem} as an interconnected system. Map the key components, relationships, feedback loops, and emergent behaviors to understand how changes propagate through the system.',
  'An approach to understanding how different components within a system influence one another within a complete entity.',
  ARRAY['Can become overwhelmingly complex', 'Difficult to quantify relationships', 'May lack predictive precision']
WHERE NOT EXISTS (SELECT 1 FROM mental_models WHERE id = 'systems_thinking');

INSERT INTO mental_models (id, name, category, complexity_score, application_scenarios, prompt_template, description, limitations)
SELECT 
  'opportunity_cost', 'Opportunity Cost', 'analytical', 5, 
  ARRAY['resource allocation', 'decision making', 'investment analysis'],
  'For {problem}, identify all available options and what must be given up to obtain a particular choice. Calculate the value of the next best alternative foregone.',
  'The loss of potential gain from other alternatives when one alternative is chosen.',
  ARRAY['Difficult to quantify intangible costs', 'Future value uncertainty', 'Psychological biases in assessment']
WHERE NOT EXISTS (SELECT 1 FROM mental_models WHERE id = 'opportunity_cost');

INSERT INTO mental_models (id, name, category, complexity_score, application_scenarios, prompt_template, description, limitations)
SELECT 
  'second_order_thinking', 'Second-Order Thinking', 'cognitive', 6, 
  ARRAY['strategic planning', 'risk assessment', 'policy analysis'],
  'For {problem}, go beyond immediate consequences and consider the effects of those effects. Map out cascading impacts, unintended consequences, and how systems will adapt to changes.',
  'Considering not just the immediate results of actions but the subsequent effects of those results.',
  ARRAY['Cognitive complexity', 'Diminishing accuracy with time horizon', 'Analysis paralysis risk']
WHERE NOT EXISTS (SELECT 1 FROM mental_models WHERE id = 'second_order_thinking');