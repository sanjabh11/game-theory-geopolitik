# PRD for Game Theory Geopolitical Platform

## Executive Summary

### Product Vision
To create the world's most advanced interactive platform that combines game theory education with real-time geopolitical prediction capabilities, empowering users to understand and forecast international relations through mathematical modeling and AI-driven insights.

### Product Mission
Enable students, researchers, policymakers, and analysts to master game theory concepts while accessing cutting-edge geopolitical predictions through an intuitive, AI-powered educational platform. Secure and efficient environment variable management ensures data integrity and user protection.

### Success Metrics
- **Educational**: 90% course completion rate, 85% assessment pass rate
- **Prediction**: 75% accuracy on 30-day geopolitical forecasts
- **Engagement**: 60% monthly active user retention
- **Performance**: <2s page load times, 99.9% uptime

---

## Core User Stories & LLM System Prompts

### User Story 1: Interactive Game Theory Tutorial
**As a** student new to game theory  
**I want to** learn fundamental concepts through interactive tutorials  
**So that** I can understand strategic decision-making in geopolitics

**Acceptance Criteria:**
- Progressive difficulty levels from basic to advanced
- Interactive Nash Equilibrium calculators
- Real-time feedback on strategic choices
- Visual game trees and payoff matrices
- Geopolitical examples and case studies

**LLM System Prompt:**
```
You are an expert Game Theory Tutor AI specialized in teaching strategic decision-making concepts. Generate comprehensive tutorials with clear explanations, real geopolitical examples, interactive elements, and assessments tailored to the student's level and progress.
```

### User Story 2: Real-Time Geopolitical Risk Assessment
**As a** policy analyst  
**I want to** receive real-time geopolitical risk assessments  
**So that** I can make informed strategic recommendations

**Acceptance Criteria:**
- Live risk scoring (0-100) for global regions
- Multi-factor analysis (political, economic, military)
- Historical trend visualization
- Automated alert system for significant changes
- Confidence intervals and uncertainty measures

**LLM System Prompt:**
```
You are an Elite Geopolitical Risk Assessment AI. Generate comprehensive risk analysis with quantitative scoring, primary risk drivers, best/worst/most likely scenarios, and mathematical justification for your assessments.
```

### User Story 3: Strategic Scenario Simulation
**As a** strategic analyst  
**I want to** model complex geopolitical scenarios  
**So that** I can understand potential outcomes and strategic implications

**Acceptance Criteria:**
- Multi-actor game-theoretic modeling
- Nash Equilibrium calculations
- Outcome probability distributions
- Sensitivity analysis for key parameters
- Strategic recommendations with confidence levels

**LLM System Prompt:**
```
You are a Strategic Scenario Simulation AI. Perform comprehensive game-theoretic analysis using Nash Equilibrium, dominant strategy elimination, and Monte Carlo simulation to determine outcome probabilities and strategic recommendations.
```

### User Story 4: Crisis Monitoring & Alert System
**As a** crisis response coordinator  
**I want to** monitor emerging global situations  
**So that** I can respond quickly to developing crises

**Acceptance Criteria:**
- Real-time news and social media monitoring
- Crisis severity classification (1-5)
- Escalation potential assessment
- Timeline urgency evaluation
- Automated alert notifications

**LLM System Prompt:**
```
You are an Advanced Crisis Monitoring AI specialized in geopolitical event analysis. Analyze potential crisis events, classify severity, assess escalation potential, and provide recommended response options based on historical precedents.
```

### User Story 5: Predictive Analytics Dashboard
**As a** investment analyst  
**I want to** forecast geopolitical trends and market impacts  
**So that** I can make informed investment decisions

**Acceptance Criteria:**
- Probability forecasts with confidence intervals
- Market impact scores (-100 to 100)
- Timeline analysis with trigger points
- Risk-adjusted return predictions
- Correlation analysis between events

**LLM System Prompt:**
```
You are a Quantitative Geopolitical Analytics AI. Generate predictions using time series analysis, machine learning ensemble methods, and Bayesian updating to provide probability forecasts with confidence intervals and market impact assessments.
```

### User Story 6: Collaborative Workspace
**As a** research team lead  
**I want to** collaborate with team members on analyses  
**So that** we can produce comprehensive strategic assessments

**Acceptance Criteria:**
- Multi-user document sharing and editing
- Real-time commenting and discussions
- Version control for analyses
- Task management workflows
- AI-powered insight generation

### User Story 7: Mental Model Library & Advisor
**As a** strategic thinker  
**I want to** access a library of mental models with AI recommendations  
**So that** I can apply the most effective frameworks to complex problems

**Acceptance Criteria:**
- Comprehensive library of mental models
- AI-powered model selection based on problem description
- Application steps and guidance
- Categorization by complexity and domain
- Relevance scoring and explanations

**LLM System Prompt:**
```
You are a Mental Model Advisor AI. Analyze problem descriptions and recommend the most appropriate mental models based on problem characteristics, domain, and urgency. Provide clear explanations of why each model is relevant and step-by-step application guidance.
```

---

## Architecture Overview

### Tech Stack
- **Frontend**: React 18 with TypeScript, Vite, Tailwind CSS, Framer Motion
- **Backend**: Supabase (PostgreSQL + Real-time + Auth + Edge Functions)
- **LLM Integration**: Google Gemini 2.5 Pro API
- **Frontend Storage**: Browser LocalStorage + IndexedDB
- **Real-time**: Supabase Realtime subscriptions
- **Caching**: Browser Cache API + Local Storage

### Supabase Database Schema

#### Core Tables

**user_profiles**
```sql
CREATE TABLE user_profiles (
    id UUID REFERENCES auth.users PRIMARY KEY,
    role TEXT NOT NULL DEFAULT 'student',
    preferences JSONB DEFAULT '{}',
    notification_settings JSONB DEFAULT '{"email": true, "push": false, "sms": false}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**learning_progress**
```sql
CREATE TABLE learning_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_profiles(id),
    module_id TEXT NOT NULL,
    completion_percentage INTEGER DEFAULT 0,
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    performance_data JSONB DEFAULT '{}'
);
```

**risk_assessments**
```sql
CREATE TABLE risk_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    region TEXT NOT NULL,
    risk_score INTEGER NOT NULL,
    risk_level TEXT NOT NULL,
    factors JSONB NOT NULL,
    confidence_interval NUMERIC[] NOT NULL,
    trend TEXT,
    source_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);
```

**scenario_simulations**
```sql
CREATE TABLE scenario_simulations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_profiles(id),
    name TEXT NOT NULL,
    scenario_type TEXT NOT NULL,
    scenario_config JSONB NOT NULL,
    results JSONB,
    status TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);
```

**crisis_events**
```sql
CREATE TABLE crisis_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    event_type TEXT NOT NULL,
    severity INTEGER NOT NULL,
    regions TEXT[] NOT NULL,
    keywords TEXT[] NOT NULL,
    source_urls TEXT[] NOT NULL,
    confidence_score NUMERIC,
    escalation_potential TEXT,
    timeline_urgency TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);
```

**mental_models**
```sql
CREATE TABLE mental_models (
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### API Integrations

#### Google Gemini API
- Used for AI-powered analysis and insights
- Integrated with fallback mechanisms for reliability
- Structured prompt engineering for consistent responses

#### News API
- Used for real-time news monitoring
- Integrated with crisis monitoring and risk assessment
- Sentiment analysis and relevance scoring

#### Alpha Vantage API
- Used for economic data and indicators
- Integrated with risk assessment and predictive analytics
- Trend analysis and forecasting

### Security & Data Protection
- Row Level Security (RLS) policies for all tables
- JWT-based authentication with Supabase
- Environment variable isolation for API keys
- Secure data handling and validation

---

## Implementation Details

### Frontend Components

#### Authentication
- Login and registration forms
- Session management
- Protected routes
- User profile management

#### Game Theory Tutorial
- Interactive learning modules
- Progress tracking
- Assessment system
- Adaptive difficulty

#### Risk Assessment
- Region selection
- Multi-factor analysis
- Visualization of risk factors
- Trend analysis

#### Scenario Simulation
- Scenario configuration
- Actor and parameter definition
- Results visualization
- Strategic recommendations

#### Crisis Monitoring
- Real-time alerts
- Severity classification
- Escalation tracking
- Response recommendations

#### Predictive Analytics
- Forecast visualization
- Confidence intervals
- Market impact assessment
- Correlation analysis

#### Collaborative Workspace
- Document sharing
- Task management
- Discussion threads
- Version control

#### Mental Models Library & Advisor
- Model browsing and filtering
- Problem analysis
- Model recommendations
- Application guidance

### Backend Services

#### Supabase Edge Functions
- `game-theory-tutor`: Generates tutorial content
- `risk-assessment`: Analyzes geopolitical risks
- `scenario-simulation`: Runs game-theoretic simulations
- `crisis-monitoring`: Monitors and alerts on crises

#### Database Operations
- User data management
- Learning progress tracking
- Risk assessment storage
- Scenario simulation results
- Crisis event tracking
- Mental model management

### API Services

#### GeminiApiService
- `analyzeRiskFactors`: Analyzes geopolitical risk factors
- `generateScenarioOutcomes`: Generates scenario outcomes
- `analyzeCrisis`: Analyzes crisis severity and impact
- `generatePredictiveAnalysis`: Generates predictive analytics
- `generateCollaborationInsights`: Generates collaboration insights
- `analyzeMentalModelProblem`: Analyzes problems for mental model selection

#### NewsApiService
- `getTopHeadlines`: Gets top news headlines
- `searchArticles`: Searches for specific news articles
- `getGeopoliticalNews`: Gets geopolitical news
- `getCrisisNews`: Gets crisis-related news

#### EconomicApiService
- `getRealGDP`: Gets real GDP data
- `getInflationRate`: Gets inflation rate data
- `getUnemploymentRate`: Gets unemployment rate data
- `getExchangeRate`: Gets exchange rate data
- `getEconomicRiskData`: Gets comprehensive economic risk data

---

## Deployment & Operations

### Deployment Options
- **Vercel**: Recommended for React applications
- **Netlify**: Good alternative with CI/CD
- **AWS Amplify**: Enterprise-scale deployment

### Environment Configuration
- Production environment variables
- API key management
- Database connection settings
- Feature flags

### Monitoring & Maintenance
- Error tracking and reporting
- Performance monitoring
- Usage analytics
- Regular updates and maintenance

---

## Future Enhancements

### Short-term (1-3 months)
- Mobile application development
- Advanced visualization options
- Enhanced user profile management
- Notification system improvements

### Medium-term (3-6 months)
- Machine learning model training
- Custom prediction model builder
- Advanced collaboration features
- Integration with additional data sources

### Long-term (6-12 months)
- Enterprise features (multi-tenant, advanced permissions)
- Custom AI model fine-tuning
- Advanced analytics and reporting
- API for third-party integrations

---

## Appendix

### User Roles
- **Student**: Learning game theory concepts
- **Professor**: Teaching and research
- **Analyst**: Professional analysis and reporting
- **Policymaker**: Decision-making and strategy
- **Researcher**: Academic and applied research

### Mental Model Categories
- **Cognitive**: Thinking patterns and biases
- **Strategic**: Decision-making frameworks
- **Analytical**: Problem-solving approaches
- **Creative**: Innovation and ideation methods
- **Systems**: Understanding complex systems

### Risk Assessment Methodology
- **Risk Score**: 0-100 scale based on multiple factors
- **Risk Levels**: Low (0-25), Moderate (26-50), High (51-75), Critical (76-100)
- **Confidence Intervals**: Statistical reliability measures
- **Trend Analysis**: Direction and rate of change over time