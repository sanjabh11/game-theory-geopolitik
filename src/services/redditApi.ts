import { ApiResponse } from '../types/api';

// const REDDIT_API_KEY = import.meta.env.VITE_REDDIT_API_KEY; // Unused variable
const BASE_URL = 'https://oauth.reddit.com';

export interface RedditPost {
  id: string;
  title: string;
  selftext: string;
  author: string;
  score: number;
  num_comments: number;
  created_utc: number;
  subreddit: string;
  url: string;
  permalink: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  relevanceScore: number;
}

export interface RedditComment {
  id: string;
  body: string;
  author: string;
  score: number;
  created_utc: number;
  replies: RedditComment[];
}

export class RedditApiService {
  // private accessToken: string | null = null; // Unused for demo
  // private tokenExpiry: number = 0; // Unused for demo

  // private async getAccessToken(): Promise<string> {
  //   if (this.accessToken && Date.now() < this.tokenExpiry) {
  //     return this.accessToken;
  //   }

  //   // For demo purposes, we'll simulate Reddit API access
  //   // In a real implementation, you'd need proper OAuth2 flow
  //   this.accessToken = 'demo_token';
  //   this.tokenExpiry = Date.now() + 3600000; // 1 hour
    
  //   return this.accessToken;
  // }

  private async makeRequest<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    // const token = await this.getAccessToken(); // OAuth token not used for public endpoints
    const url = new URL(`${BASE_URL}${endpoint}`);
    
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    // For demo purposes, return mock data instead of actual API call
    // In production, you'd make the actual request here
    return this.getMockData(endpoint, params) as T;
  }

  private getMockData(endpoint: string, params: Record<string, string>): { data: { children: Array<{ kind: string; data: Record<string, unknown> }> } } {
    if (endpoint.includes('/search')) {
      return this.getMockSearchResults(params.q || '');
    }
    
    if (endpoint.includes('/hot') || endpoint.includes('/new')) {
      return this.getMockSubredditPosts();
    }

    return { data: { children: [] } };
  }

  private getMockSearchResults(query: string): { data: { children: Array<{ kind: string; data: Record<string, unknown> }> } } {
    const mockPosts = [
      {
        kind: 't3',
        data: {
          id: '1a2b3c',
          title: `Breaking: Major geopolitical development regarding ${query}`,
          selftext: 'Analysis of recent events and their implications...',
          author: 'geopolitics_analyst',
          score: 245,
          num_comments: 67,
          created_utc: Date.now() / 1000 - 3600,
          subreddit: 'geopolitics',
          url: 'https://reddit.com/r/geopolitics/comments/1a2b3c',
          permalink: '/r/geopolitics/comments/1a2b3c'
        }
      },
      {
        kind: 't3',
        data: {
          id: '4d5e6f',
          title: `Economic implications of ${query} situation`,
          selftext: 'Discussion on market reactions and economic indicators...',
          author: 'economics_expert',
          score: 189,
          num_comments: 43,
          created_utc: Date.now() / 1000 - 7200,
          subreddit: 'economics',
          url: 'https://reddit.com/r/economics/comments/4d5e6f',
          permalink: '/r/economics/comments/4d5e6f'
        }
      }
    ];

    return {
      data: {
        children: mockPosts
      }
    };
  }

  private getMockSubredditPosts(): { data: { children: Array<{ kind: string; data: Record<string, unknown> }> } } {
    const mockPosts = [
      {
        kind: 't3',
        data: {
          id: 'g7h8i9',
          title: 'Current tensions in international relations',
          selftext: 'Comprehensive analysis of ongoing diplomatic challenges...',
          author: 'diplomatic_observer',
          score: 156,
          num_comments: 29,
          created_utc: Date.now() / 1000 - 1800,
          subreddit: 'worldnews',
          url: 'https://reddit.com/r/worldnews/comments/g7h8i9',
          permalink: '/r/worldnews/comments/g7h8i9'
        }
      }
    ];

    return {
      data: {
        children: mockPosts
      }
    };
  }

  /**
   * Search Reddit for posts related to geopolitical topics
   */
  async searchPosts(query: string, options: {
    subreddit?: string;
    sort?: 'relevance' | 'hot' | 'new' | 'comments';
    time?: 'hour' | 'day' | 'week' | 'month' | 'year' | 'all';
    limit?: number;
  } = {}): Promise<ApiResponse<RedditPost[]>> {
    try {
      const params: Record<string, string> = {
        q: query,
        type: 'link',
        sort: options.sort || 'relevance',
        t: options.time || 'day',
        limit: (options.limit || 25).toString()
      };

      if (options.subreddit) {
        params.restrict_sr = 'true';
      }

      const endpoint = options.subreddit 
        ? `/r/${options.subreddit}/search`
        : '/search';

      const result = await this.makeRequest<{ data: { children: Array<{ data: Record<string, unknown> }> } }>(endpoint, params);
      
      const posts: RedditPost[] = result.data.children.map((child) => 
        this.transformPost(child.data)
      );

      return {
        success: true,
        data: posts
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to search Reddit posts'
      };
    }
  }

  /**
   * Get hot posts from geopolitical subreddits
   */
  async getGeopoliticalPosts(): Promise<ApiResponse<RedditPost[]>> {
    const subreddits = [
      'geopolitics',
      'worldnews',
      'politics',
      'economics',
      'internationalpolitics',
      'foreignpolicy'
    ];

    try {
      const allPosts: RedditPost[] = [];

      for (const subreddit of subreddits) {
        const result = await this.makeRequest<{ data: { children: Array<{ data: Record<string, unknown> }> } }>(`/r/${subreddit}/hot`, {
          limit: '10'
        });

        const posts = result.data.children.map((child) => 
          this.transformPost(child.data)
        );

        allPosts.push(...posts);
      }

      // Sort by relevance score and limit results
      const sortedPosts = allPosts
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, 30);

      return {
        success: true,
        data: sortedPosts
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch geopolitical posts'
      };
    }
  }

  /**
   * Monitor crisis-related discussions
   */
  async getCrisisDiscussions(): Promise<ApiResponse<RedditPost[]>> {
    const crisisKeywords = [
      'crisis',
      'emergency',
      'conflict',
      'war',
      'sanctions',
      'diplomatic crisis',
      'international incident',
      'security threat'
    ];

    const searchQuery = crisisKeywords.join(' OR ');
    
    return this.searchPosts(searchQuery, {
      sort: 'new',
      time: 'day',
      limit: 20
    });
  }

  /**
   * Get sentiment analysis for a region
   */
  async getRegionalSentiment(region: string): Promise<ApiResponse<{
    region: string;
    overallSentiment: 'positive' | 'negative' | 'neutral';
    sentimentScore: number;
    posts: RedditPost[];
    trends: Array<{
      keyword: string;
      mentions: number;
      sentiment: 'positive' | 'negative' | 'neutral';
    }>;
  }>> {
    try {
      const searchResult = await this.searchPosts(region, {
        sort: 'new',
        time: 'week',
        limit: 50
      });

      if (!searchResult.success || !searchResult.data) {
        throw new Error('Failed to fetch posts for sentiment analysis');
      }

      const posts = searchResult.data;
      
      // Calculate overall sentiment
      const sentiments = posts.map(post => post.sentiment);
      const positiveCount = sentiments.filter(s => s === 'positive').length;
      const negativeCount = sentiments.filter(s => s === 'negative').length;
      const neutralCount = sentiments.filter(s => s === 'neutral').length;

      let overallSentiment: 'positive' | 'negative' | 'neutral';
      if (positiveCount > negativeCount && positiveCount > neutralCount) {
        overallSentiment = 'positive';
      } else if (negativeCount > positiveCount && negativeCount > neutralCount) {
        overallSentiment = 'negative';
      } else {
        overallSentiment = 'neutral';
      }

      const sentimentScore = ((positiveCount - negativeCount) / posts.length) * 100;

      // Generate trending keywords (mock implementation)
      const trends = [
        { keyword: region, mentions: posts.length, sentiment: overallSentiment },
        { keyword: 'economy', mentions: 15, sentiment: 'negative' },
        { keyword: 'politics', mentions: 12, sentiment: 'neutral' },
        { keyword: 'trade', mentions: 8, sentiment: 'positive' }
      ];

      return {
        success: true,
        data: {
          region,
          overallSentiment,
          sentimentScore,
          posts: posts.slice(0, 10), // Return top 10 posts
          trends: trends.map(trend => ({
            keyword: trend.keyword,
            mentions: trend.mentions,
            sentiment: trend.sentiment as 'positive' | 'negative' | 'neutral'
          }))
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to analyze regional sentiment'
      };
    }
  }

  private transformPost(postData: Record<string, unknown>): RedditPost {
    return {
      id: postData.id,
      title: postData.title,
      selftext: postData.selftext || '',
      author: postData.author,
      score: postData.score,
      num_comments: postData.num_comments,
      created_utc: postData.created_utc,
      subreddit: postData.subreddit,
      url: postData.url,
      permalink: postData.permalink,
      sentiment: this.analyzeSentiment(postData.title + ' ' + (postData.selftext || '')),
      relevanceScore: this.calculateRelevance(postData.title + ' ' + (postData.selftext || ''))
    };
  }

  private analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
    const positiveWords = ['growth', 'success', 'agreement', 'peace', 'cooperation', 'stability'];
    const negativeWords = ['crisis', 'war', 'conflict', 'threat', 'sanctions', 'instability', 'collapse'];
    
    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    
    if (negativeCount > positiveCount) return 'negative';
    if (positiveCount > negativeCount) return 'positive';
    return 'neutral';
  }

  private calculateRelevance(text: string): number {
    const geopoliticalKeywords = [
      'geopolitics', 'international', 'foreign policy', 'diplomacy',
      'sanctions', 'trade war', 'military', 'security', 'alliance',
      'conflict', 'crisis', 'treaty', 'negotiation', 'summit'
    ];
    
    const lowerText = text.toLowerCase();
    const matchCount = geopoliticalKeywords.filter(keyword => 
      lowerText.includes(keyword)
    ).length;
    
    return Math.min(matchCount / geopoliticalKeywords.length, 1) * 100;
  }
}

export const redditApi = new RedditApiService();
