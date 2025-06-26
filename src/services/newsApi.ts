import { ApiResponse, NewsArticle, NewsQuery } from '../types/api';

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2';

export class NewsApiService {
  private async makeRequest<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const url = new URL(`${BASE_URL}${endpoint}`);
    
    // Add API key and default parameters
    url.searchParams.append('apiKey', NEWS_API_KEY);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`News API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get top headlines
   */
  async getTopHeadlines(params: {
    country?: string;
    category?: string;
    sources?: string;
    q?: string;
    pageSize?: number;
    page?: number;
  } = {}): Promise<ApiResponse<NewsArticle[]>> {
    try {
      const result = await this.makeRequest<{ articles: Array<{ title?: string; description?: string; content?: string; url?: string; urlToImage?: string; publishedAt: string; source?: { id?: string; name?: string }; author?: string }>; totalResults: number }>('/top-headlines', {
        ...params,
        pageSize: params.pageSize?.toString() || '50',
        page: params.page?.toString() || '1'
      });

      return {
        success: true,
        data: result.articles.map((article) => this.transformArticle(article)),
        meta: {
          totalResults: result.totalResults,
          page: params.page || 1,
          pageSize: params.pageSize || 50
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch headlines'
      };
    }
  }

  /**
   * Search for articles
   */
  async searchArticles(query: NewsQuery): Promise<ApiResponse<NewsArticle[]>> {
    try {
      const params: Record<string, string> = {
        q: query.q,
        pageSize: query.pageSize?.toString() || '50',
        page: query.page?.toString() || '1'
      };

      if (query.from) params.from = query.from;
      if (query.to) params.to = query.to;
      if (query.sortBy) params.sortBy = query.sortBy;
      if (query.sources) params.sources = query.sources;
      if (query.domains) params.domains = query.domains;
      if (query.language) params.language = query.language;

      const result = await this.makeRequest<{ articles: Array<{ title?: string; description?: string; content?: string; url?: string; urlToImage?: string; publishedAt: string; source?: { id?: string; name?: string }; author?: string }>; totalResults: number }>('/everything', params);

      return {
        success: true,
        data: result.articles.map((article) => this.transformArticle(article)),
        meta: {
          totalResults: result.totalResults,
          page: query.page || 1,
          pageSize: query.pageSize || 50
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to search articles'
      };
    }
  }

  /**
   * Get geopolitical news
   */
  async getGeopoliticalNews(region?: string): Promise<ApiResponse<NewsArticle[]>> {
    const queries = [
      'geopolitics',
      'international relations',
      'foreign policy',
      'diplomatic crisis',
      'trade war',
      'sanctions',
      'military conflict',
      'political instability'
    ];

    const query = region 
      ? `${queries.join(' OR ')} AND ${region}`
      : queries.join(' OR ');

    return this.searchArticles({
      q: query,
      sortBy: 'publishedAt',
      pageSize: 30
    });
  }

  /**
   * Get crisis-related news
   */
  async getCrisisNews(): Promise<ApiResponse<NewsArticle[]>> {
    return this.searchArticles({
      q: 'crisis OR emergency OR conflict OR war OR attack OR terrorism OR disaster',
      sortBy: 'publishedAt',
      pageSize: 20
    });
  }

  private transformArticle(article: { title?: string; description?: string; content?: string; url?: string; urlToImage?: string; publishedAt: string; source?: { id?: string; name?: string }; author?: string }): NewsArticle {
    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
    let relevanceScore = 0;
    
    try {
      sentiment = this.analyzeSentiment(article.title + ' ' + (article.description || ''));
      relevanceScore = this.calculateRelevance(article.title + ' ' + (article.description || ''));
    } catch (error) {
      // Error analyzing article sentiment/relevance - using defaults
    }

    return {
      id: `${article.source?.id || 'unknown'}_${Date.now()}_${Math.random()}`,
      title: article.title || 'No title',
      description: article.description || '',
      content: article.content || '',
      url: article.url || '',
      urlToImage: article.urlToImage,
      publishedAt: article.publishedAt,
      source: {
        id: article.source?.id || '',
        name: article.source?.name || 'Unknown'
      },
      author: article.author,
      sentiment,
      relevanceScore
    };
  }

  private analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
    const positiveWords = ['peace', 'agreement', 'cooperation', 'success', 'growth', 'stability'];
    const negativeWords = ['war', 'conflict', 'crisis', 'attack', 'threat', 'instability', 'sanctions'];
    
    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    
    if (negativeCount > positiveCount) return 'negative';
    if (positiveCount > negativeCount) return 'positive';
    return 'neutral';
  }

  private calculateRelevance(text: string): number {
    const geopoliticalKeywords = [
      'geopolitics', 'diplomacy', 'foreign policy', 'international',
      'sanctions', 'trade', 'military', 'security', 'alliance',
      'conflict', 'crisis', 'treaty', 'negotiation'
    ];
    
    const lowerText = text.toLowerCase();
    const matchCount = geopoliticalKeywords.filter(keyword => 
      lowerText.includes(keyword)
    ).length;
    
    return Math.min(matchCount / geopoliticalKeywords.length, 1) * 100;
  }
}

export const newsApi = new NewsApiService();
