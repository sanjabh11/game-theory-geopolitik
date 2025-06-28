# Game Theory Geopolitical Platform - Deployment Guide

This guide provides instructions for deploying the Game Theory Geopolitical Platform to production environments.

## Prerequisites

Before deploying, ensure you have:

1. **API Keys**: Obtain the necessary API keys for:
   - Supabase (for authentication and database)
   - Google Gemini API (for AI-powered analysis)
   - News API (for real-time news data)
   - Alpha Vantage (for economic data)

2. **Node.js**: Version 18.0.0 or higher
3. **npm**: Version 8.0.0 or higher
4. **Git**: For version control

## Environment Configuration

1. Create a `.env` file in the project root with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# AI/LLM Configuration
VITE_GEMINI_API_KEY=your_gemini_api_key

# External Data Sources
VITE_NEWS_API_KEY=your_news_api_key
VITE_ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key

# Environment
NODE_ENV=production
```

## Supabase Setup

1. **Create a Supabase Project**:
   - Go to [Supabase](https://supabase.com/) and create a new project
   - Note your project URL and API keys

2. **Database Setup**:
   - Execute the SQL migrations in the `supabase/migrations` directory
   - Set up Row Level Security (RLS) policies as defined in the migrations

3. **Authentication Setup**:
   - Configure authentication providers in the Supabase dashboard
   - Set up email templates for authentication emails

## Build Process

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Build the Application**:
   ```bash
   npm run build
   ```

   This will create a `dist` directory with the production-ready files.

## Deployment Options

### Option 1: Netlify

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:
   ```bash
   netlify login
   ```

3. **Initialize Netlify**:
   ```bash
   netlify init
   ```

4. **Deploy to Netlify**:
   ```bash
   netlify deploy --prod
   ```

5. **Configure Environment Variables**:
   - Go to the Netlify dashboard
   - Navigate to Site settings > Build & deploy > Environment
   - Add all the environment variables from your `.env` file

### Option 2: Vercel

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy to Vercel**:
   ```bash
   vercel --prod
   ```

4. **Configure Environment Variables**:
   - Go to the Vercel dashboard
   - Navigate to Project settings > Environment Variables
   - Add all the environment variables from your `.env` file

### Option 3: AWS Amplify

1. **Install AWS Amplify CLI**:
   ```bash
   npm install -g @aws-amplify/cli
   ```

2. **Configure Amplify**:
   ```bash
   amplify configure
   ```

3. **Initialize Amplify**:
   ```bash
   amplify init
   ```

4. **Add Hosting**:
   ```bash
   amplify add hosting
   ```

5. **Deploy to Amplify**:
   ```bash
   amplify publish
   ```

6. **Configure Environment Variables**:
   - Go to the AWS Amplify Console
   - Navigate to App settings > Environment variables
   - Add all the environment variables from your `.env` file

## Post-Deployment Verification

After deployment, verify the following:

1. **Authentication**: Test user registration and login
2. **API Integrations**: Verify all API integrations are working
3. **Database Operations**: Test database read and write operations
4. **Real-time Features**: Verify real-time updates and subscriptions
5. **Error Handling**: Test error scenarios to ensure proper handling

## Monitoring and Maintenance

1. **Set Up Monitoring**:
   - Configure error tracking (e.g., Sentry)
   - Set up performance monitoring
   - Implement logging for critical operations

2. **Regular Maintenance**:
   - Update dependencies regularly
   - Monitor API usage and quotas
   - Back up database regularly

3. **Scaling Considerations**:
   - Monitor performance metrics
   - Scale resources as needed
   - Optimize database queries for performance

## Troubleshooting

### Common Issues

1. **API Rate Limiting**:
   - Implement proper rate limiting and caching
   - Consider upgrading API plans for production use

2. **CORS Issues**:
   - Ensure proper CORS configuration in Supabase
   - Check browser console for CORS errors

3. **Authentication Problems**:
   - Verify Supabase configuration
   - Check for expired tokens
   - Ensure proper redirect URLs

4. **Performance Issues**:
   - Implement code splitting
   - Optimize bundle size
   - Use CDN for static assets

## Security Considerations

1. **API Keys**:
   - Never expose API keys in client-side code
   - Use environment variables for all sensitive information
   - Consider using proxy functions for API calls

2. **Authentication**:
   - Implement proper session management
   - Use secure cookies
   - Enable multi-factor authentication where possible

3. **Data Protection**:
   - Implement proper Row Level Security in Supabase
   - Sanitize user inputs
   - Validate data on both client and server

## Conclusion

Following this deployment guide will help you successfully deploy the Game Theory Geopolitical Platform to production. For additional support or questions, please refer to the project documentation or contact the development team.