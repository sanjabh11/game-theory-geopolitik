# Game Theory Geopolitical Platform

A comprehensive platform for geopolitical analysis, strategic modeling, and crisis monitoring using game theory principles and AI-powered insights.

## 🚀 Features & Capabilities

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
   - AI-powered insight generation

7. **Mental Models Library & Advisor**
   - Comprehensive mental model library
   - AI-powered model selection advisor
   - Application steps and guidance
   - Categorization and filtering
   - Relevance scoring and recommendations

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript for type safety
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for responsive, modern styling
- **Framer Motion** for smooth animations and interactions
- **React Router** for client-side routing
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
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

   # AI Services
   VITE_GEMINI_API_KEY=your_gemini_api_key

   # Data Sources
   VITE_NEWS_API_KEY=your_news_api_key
   VITE_ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key

   # Development
   NODE_ENV=development
   ```

3. **Start Development**
   ```bash
   npm run dev
   ```

## 🎯 Usage Guide

### Getting Started

1. **Create Account**: Register with email and select your role
2. **Complete Profile**: Add your organization and preferences
3. **Start Tutorial**: Learn game theory fundamentals
4. **Explore Features**: Navigate between analysis tools
5. **Set Up Monitoring**: Configure alerts for your regions of interest

### Key Workflows

- **Risk Analysis**: Select regions → Review AI insights → Generate reports
- **Scenario Planning**: Choose templates → Configure parameters → Run simulations
- **Crisis Monitoring**: Set keywords → Define thresholds → Receive alerts
- **Collaboration**: Create workspace → Invite team → Share analyses
- **Mental Models**: Explore library → Get AI recommendations → Apply to problems

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
│   ├── MentalModels/      # Mental models library and advisor
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

## 🚀 Deployment

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

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

---

**Built with ❤️ for strategic analysis and geopolitical research**