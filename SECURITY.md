# Security Guidelines

## Environment Variables and API Key Management

### ⚠️ CRITICAL SECURITY WARNING

**NEVER** commit API keys, secrets, or sensitive configuration to version control!

### Secure Setup Instructions

1. **Copy the environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Add your actual API keys to `.env`:**
   ```env
   VITE_GEMINI_API_KEY=your_actual_gemini_api_key
   VITE_NEWS_API_KEY=your_actual_news_api_key
   # ... etc
   ```

3. **Verify `.env` is in `.gitignore`:**
   ```bash
   # This should show .env is ignored
   git check-ignore .env
   ```

### Required API Keys

| Service | Environment Variable | Where to Get |
|---------|---------------------|--------------|
| Google Gemini | `VITE_GEMINI_API_KEY` | [Google AI Studio](https://makersuite.google.com/app/apikey) |
| News API | `VITE_NEWS_API_KEY` | [NewsAPI.org](https://newsapi.org/register) |
| Alpha Vantage | `VITE_ALPHA_VANTAGE_API_KEY` | [Alpha Vantage](https://www.alphavantage.co/support/#api-key) |
| Reddit API | `VITE_REDDIT_API_KEY` | [Reddit Apps](https://www.reddit.com/prefs/apps) |
| Supabase | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` | [Supabase Dashboard](https://supabase.com/dashboard) |

### Security Best Practices

#### 1. Environment Separation
- **Development**: Use `.env` file locally
- **Production**: Use platform environment variables (Vercel, Netlify, etc.)
- **Never** use development keys in production

#### 2. API Key Rotation
- Rotate API keys regularly (monthly/quarterly)
- Immediately rotate if compromised
- Monitor API usage for unusual activity

#### 3. Access Controls
- Use least-privilege principle
- Restrict API keys to specific domains/IPs when possible
- Monitor API usage and set rate limits

#### 4. Code Security
- Use environment variables, never hardcode secrets
- Validate environment variables at startup
- Fail fast if required secrets are missing

#### 5. Repository Security
- Enable GitHub security scanning
- Review all commits for accidentally committed secrets
- Use `.gitignore` to prevent secret files from being tracked

### Error Handling for Missing Keys

The application is configured to:
- Throw clear errors if required API keys are missing
- Fail at startup rather than runtime
- Provide helpful error messages for developers

### Emergency Response

If you accidentally commit API keys:

1. **Immediately rotate the compromised keys**
2. **Remove from git history:**
   ```bash
   # For the most recent commit
   git reset --soft HEAD~1
   git reset HEAD .env
   git commit -m "Remove accidentally committed secrets"
   
   # For older commits, use git filter-branch or BFG Repo-Cleaner
   ```
3. **Force push the cleaned history**
4. **Notify team members to pull the cleaned repository**

### Monitoring and Alerts

Set up monitoring for:
- Unusual API usage patterns
- Failed authentication attempts
- Rate limit violations
- Unexpected geographic access patterns

### Compliance

This application handles:
- No personally identifiable information (PII) in normal operation
- Public geopolitical data only
- Educational content and simulations

Ensure compliance with:
- API provider terms of service
- Data protection regulations in your jurisdiction
- Institutional security policies if applicable

## Reporting Security Issues

If you discover a security vulnerability, please:
1. **Do not** create a public GitHub issue
2. Email security concerns to the maintainers
3. Provide detailed information about the vulnerability
4. Allow reasonable time for response before public disclosure
