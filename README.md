# Game Theory Geopolitical Platform

A comprehensive platform for geopolitical analysis, strategic modeling, and crisis monitoring using game theory principles and AI-powered insights.

## 🚀 Features

### Core Functionality

1. **Interactive Game Theory Tutorial**
   - Nash Equilibrium concepts with real-world examples
   - Dominant Strategies analysis and practice
   - Prisoner's Dilemma scenarios with geopolitical context
   - Interactive assessments and knowledge checks
   - Progress tracking and personalized learning paths

2. **Real-time Risk Assessment**
   - AI-powered analysis of geopolitical risks
   - Economic indicator monitoring and correlation
   - Regional risk scoring with confidence intervals
   - Multi-source data integration and validation
   - Trend analysis and predictive insights

3. **Scenario Simulation**
   - Multi-party strategic modeling
   - Game-theoretic equilibrium analysis
   - Economic impact assessments
   - Timeline and probability predictions
   - Outcome visualization with sensitivity analysis

4. **Crisis Monitoring**
   - Real-time news and social media monitoring
   - Crisis severity assessment with AI analysis
   - Escalation potential prediction
   - Automated alert system for emerging threats
   - Historical pattern recognition and matching

5. **Predictive Analytics**
   - Economic indicator forecasting
   - Market impact predictions with confidence bands
   - Multi-factor correlation analysis
   - Trend identification and extrapolation
   - Investment-focused risk metrics

6. **Collaborative Workspace**
   - Multi-user document sharing and editing
   - Real-time discussions and commenting
   - Task management and workflow tracking
   - Version control for analyses
   - AI-powered insights generation

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript for type safety
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for responsive, modern styling
- **Framer Motion** for smooth animations
- **React Router** for client-side navigation
- **React Query** for efficient data fetching and caching
- **React Hot Toast** for user notifications

### Backend & Database
- **Supabase** for authentication, real-time database, and edge functions
- **PostgreSQL** with Row Level Security for data protection
- **Real-time subscriptions** for live updates

### AI & External APIs
- **Google Gemini AI** for advanced analysis and natural language processing
- **News API** for real-time global news data
- **Alpha Vantage** for economic and financial indicators
- **Reddit API** for social media sentiment analysis

### Development Tools
- **TypeScript** for compile-time type checking
- **ESLint** and **Prettier** for code quality
- **Heroicons** for consistent UI iconography

## 📦 Quick Start

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager
- Git for version control

### Installation

1. **Clone and install**
   ```bash
   git clone <repository-url>
   cd game-theory-platform
   npm install
   ```

2. **Environment Setup**
   
   Create a `.env` file with the following variables:
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

   # AI Services
   VITE_GEMINI_API_KEY=your_gemini_api_key

   # Data Sources
   VITE_NEWS_API_KEY=your_news_api_key
   VITE_ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key
   VITE_REDDIT_API_KEY=your_reddit_api_key

   # Development
   NODE_ENV=development
   LOG_LEVEL=debug
   ```

3. **Database Setup**
   
   Execute in your Supabase SQL editor:
   ```sql
   -- Create user profiles table
   CREATE TABLE user_profiles (
     id UUID REFERENCES auth.users(id) PRIMARY KEY,
     role TEXT NOT NULL CHECK (role IN ('student', 'professor', 'analyst', 'policymaker', 'researcher')),
     organization TEXT,
     preferences JSONB DEFAULT '{}',
     notification_settings JSONB DEFAULT '{"email": true, "push": false, "sms": false}',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable Row Level Security
   ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

   -- Create policy for user access
   CREATE POLICY "Users can view and update own profile" ON user_profiles
   USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
   ```

4. **Start Development**
   ```bash
   npm run dev
   ```

## 🎯 Usage Guide

### Getting Started

1. **Create Account**: Register with email and select your role
2. **Complete Profile**: Add organization and preferences
3. **Start Tutorial**: Learn game theory fundamentals
4. **Explore Features**: Navigate between analysis tools
5. **Set Up Monitoring**: Configure alerts for your regions of interest

### Key Workflows

- **Risk Analysis**: Select regions → Review AI insights → Generate reports
- **Scenario Planning**: Choose templates → Configure parameters → Run simulations
- **Crisis Monitoring**: Set keywords → Define thresholds → Receive alerts
- **Collaboration**: Create workspace → Invite team → Share analyses

## 🏗 Architecture

### Component Structure
```
src/
├── components/
│   ├── Auth/              # Authentication components
│   ├── Dashboard/         # Main dashboard and overview
│   ├── GameTheory/        # Interactive tutorial modules
│   ├── RiskAssessment/    # Risk analysis tools
│   ├── Simulation/        # Scenario modeling
│   ├── Crisis/            # Crisis monitoring dashboard
│   ├── Analytics/         # Predictive analytics
│   ├── Collaboration/     # Team workspace
│   └── Layout/            # Shared layout components
├── services/              # API integration layer
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions and helpers
└── hooks/                 # Custom React hooks
```

### Data Flow
1. **User Authentication**: Supabase Auth manages secure login
2. **Real-time Data**: External APIs provide current information
3. **AI Processing**: Gemini AI analyzes and generates insights
4. **State Management**: React Query handles caching and updates
5. **Real-time Updates**: Supabase subscriptions for live data

## 🔐 Security & Performance

- **Authentication**: JWT tokens with automatic refresh
- **Authorization**: Row-level security policies
- **Data Protection**: Environment variable isolation
- **Type Safety**: Comprehensive TypeScript coverage
- **Performance**: Code splitting and lazy loading
- **Caching**: Intelligent data caching strategies

## 🧪 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Code Quality
- **TypeScript**: Strict type checking enabled
- **ESLint**: Consistent code style enforcement
- **Prettier**: Automatic code formatting
- **Git Hooks**: Pre-commit quality checks

## 📊 Monitoring & Analytics

- User engagement tracking
- Feature usage analytics
- Performance monitoring
- Error reporting and alerting
- API usage and rate limiting

## 🚀 Deployment

### Production Deployment
1. Build the application: `npm run build`
2. Deploy to hosting platform (Vercel, Netlify, etc.)
3. Configure environment variables
4. Set up domain and SSL
5. Enable monitoring and analytics

### Recommended Hosting
- **Vercel**: Optimal for React applications
- **Netlify**: Good alternative with CI/CD
- **AWS Amplify**: Enterprise-scale deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation for new features
- Use conventional commit messages

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check README and inline comments
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Join community discussions
- **Contact**: Reach out to the development team

---

**Built with ❤️ for strategic analysis and geopolitical research**
