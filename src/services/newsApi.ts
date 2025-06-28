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

    try {
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`News API error: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.warn('News API error, using mock data:', error);
      return this.getMockData(endpoint, params) as T;
    }
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
      console.warn('Using mock headlines data');
      
      // Generate mock headlines based on country/category
      const mockHeadlines = this.generateMockHeadlines(params.country || 'us', params.category);
      
      return {
        success: true,
        data: mockHeadlines,
        meta: {
          totalResults: mockHeadlines.length,
          page: params.page || 1,
          pageSize: params.pageSize || 50
        }
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
      console.warn('Using mock search data');
      
      // Generate mock search results based on query
      const mockArticles = this.generateMockSearchResults(query.q);
      
      return {
        success: true,
        data: mockArticles,
        meta: {
          totalResults: mockArticles.length,
          page: query.page || 1,
          pageSize: query.pageSize || 50
        }
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

    try {
      return await this.searchArticles({
        q: query,
        sortBy: 'publishedAt',
        pageSize: 30
      });
    } catch (error) {
      console.warn('Using mock geopolitical news data');
      
      // Generate mock geopolitical news
      const mockArticles = this.generateMockGeopoliticalNews(region);
      
      return {
        success: true,
        data: mockArticles,
        meta: {
          totalResults: mockArticles.length,
          page: 1,
          pageSize: 30
        }
      };
    }
  }

  /**
   * Get crisis-related news
   */
  async getCrisisNews(): Promise<ApiResponse<NewsArticle[]>> {
    try {
      return await this.searchArticles({
        q: 'crisis OR emergency OR conflict OR war OR attack OR terrorism OR disaster',
        sortBy: 'publishedAt',
        pageSize: 20
      });
    } catch (error) {
      console.warn('Using mock crisis news data');
      
      // Generate mock crisis news
      const mockArticles = this.generateMockCrisisNews();
      
      return {
        success: true,
        data: mockArticles,
        meta: {
          totalResults: mockArticles.length,
          page: 1,
          pageSize: 20
        }
      };
    }
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

  // Mock data generation methods
  private getMockData(endpoint: string, params: Record<string, string>): { articles: any[]; totalResults: number } {
    if (endpoint.includes('/top-headlines')) {
      const mockHeadlines = this.generateMockHeadlines(params.country || 'us', params.category);
      return {
        articles: mockHeadlines,
        totalResults: mockHeadlines.length
      };
    }
    
    if (endpoint.includes('/everything')) {
      const mockArticles = this.generateMockSearchResults(params.q || '');
      return {
        articles: mockArticles,
        totalResults: mockArticles.length
      };
    }
    
    return {
      articles: [],
      totalResults: 0
    };
  }

  private generateMockHeadlines(country: string, category?: string): NewsArticle[] {
    const now = new Date();
    const headlines: NewsArticle[] = [];
    
    // Generate country-specific headlines
    const countryHeadlines = this.getCountrySpecificHeadlines(country);
    
    // Add category-specific headlines if provided
    if (category) {
      const categoryHeadlines = this.getCategorySpecificHeadlines(category);
      countryHeadlines.push(...categoryHeadlines);
    }
    
    // Transform to NewsArticle format
    for (let i = 0; i < countryHeadlines.length; i++) {
      const headline = countryHeadlines[i];
      const publishedDate = new Date(now);
      publishedDate.setHours(now.getHours() - i);
      
      headlines.push({
        id: `mock_headline_${i}`,
        title: headline.title,
        description: headline.description,
        content: headline.description,
        url: 'https://example.com/news',
        urlToImage: headline.imageUrl,
        publishedAt: publishedDate.toISOString(),
        source: {
          id: headline.source.id,
          name: headline.source.name
        },
        author: headline.author,
        sentiment: this.analyzeSentiment(headline.title + ' ' + headline.description),
        relevanceScore: this.calculateRelevance(headline.title + ' ' + headline.description)
      });
    }
    
    return headlines;
  }

  private getCountrySpecificHeadlines(country: string): Array<{
    title: string;
    description: string;
    imageUrl?: string;
    source: { id: string; name: string };
    author?: string;
  }> {
    const countryMap: Record<string, string> = {
      'us': 'United States',
      'gb': 'United Kingdom',
      'de': 'Germany',
      'fr': 'France',
      'cn': 'China',
      'jp': 'Japan',
      'ru': 'Russia'
    };
    
    const countryName = countryMap[country.toLowerCase()] || country;
    
    return [
      {
        title: `${countryName} Announces New Economic Policy Initiative`,
        description: `The government of ${countryName} has unveiled a comprehensive economic policy package aimed at boosting growth and addressing inflation concerns. The measures include tax incentives for businesses, infrastructure investments, and targeted support for key industries.`,
        source: { id: 'mock-economic', name: 'Economic Times' },
        author: 'Economic Correspondent'
      },
      {
        title: `Diplomatic Tensions Rise Between ${countryName} and Neighboring States`,
        description: `Recent diplomatic exchanges have highlighted growing tensions between ${countryName} and several neighboring countries over territorial disputes and trade issues. Analysts suggest these developments could impact regional stability if not addressed through multilateral dialogue.`,
        source: { id: 'mock-diplomatic', name: 'Diplomatic Observer' },
        author: 'Foreign Affairs Analyst'
      },
      {
        title: `${countryName} Central Bank Signals Shift in Monetary Policy`,
        description: `The central bank of ${countryName} has indicated a potential shift in its monetary policy stance, citing changing economic conditions and inflation outlook. Market participants are closely monitoring upcoming announcements for implications on interest rates and financial markets.`,
        source: { id: 'mock-financial', name: 'Financial Review' },
        author: 'Financial Reporter'
      },
      {
        title: `New Trade Agreement Negotiations Underway for ${countryName}`,
        description: `${countryName} has initiated negotiations for a comprehensive trade agreement with key global partners. The proposed deal aims to reduce tariffs, harmonize regulations, and enhance market access for goods and services, potentially reshaping regional economic relationships.`,
        source: { id: 'mock-trade', name: 'Trade Monitor' },
        author: 'Trade Policy Expert'
      },
      {
        title: `${countryName} Faces Environmental Policy Challenges`,
        description: `Environmental policy implementation in ${countryName} is facing significant challenges as the government balances economic growth objectives with sustainability commitments. Recent data shows mixed progress on emission reduction targets and renewable energy adoption.`,
        source: { id: 'mock-environment', name: 'Environmental Journal' },
        author: 'Climate Policy Analyst'
      }
    ];
  }

  private getCategorySpecificHeadlines(category: string): Array<{
    title: string;
    description: string;
    imageUrl?: string;
    source: { id: string; name: string };
    author?: string;
  }> {
    const headlines: Record<string, Array<{
      title: string;
      description: string;
      imageUrl?: string;
      source: { id: string; name: string };
      author?: string;
    }>> = {
      'business': [
        {
          title: 'Global Markets React to Inflation Data',
          description: 'Financial markets worldwide showed significant volatility following the release of higher-than-expected inflation figures from major economies. Equity indices declined while bond yields rose as investors reassessed monetary policy expectations.',
          source: { id: 'mock-market', name: 'Market Watch' },
          author: 'Financial Analyst'
        },
        {
          title: 'Tech Sector Leads Economic Growth',
          description: 'The technology sector continues to drive economic expansion, with latest figures showing above-average growth rates and job creation. Industry leaders point to artificial intelligence and cloud computing as key drivers for the coming year.',
          source: { id: 'mock-tech', name: 'Tech Business' },
          author: 'Technology Correspondent'
        }
      ],
      'politics': [
        {
          title: 'Legislative Gridlock Threatens Economic Package',
          description: 'Political divisions in the legislature have created uncertainty around the passage of a major economic stimulus package. Negotiations continue as both sides seek compromise on key provisions related to tax policy and spending priorities.',
          source: { id: 'mock-politics', name: 'Political Observer' },
          author: 'Political Correspondent'
        },
        {
          title: 'Election Results Reshape Regional Power Balance',
          description: 'Recent election outcomes have significantly altered the political landscape, with implications for policy direction and international relations. Analysts are assessing the potential impact on trade agreements, defense cooperation, and diplomatic initiatives.',
          source: { id: 'mock-election', name: 'Election Monitor' },
          author: 'Political Analyst'
        }
      ],
      'technology': [
        {
          title: 'AI Regulation Framework Proposed',
          description: 'A comprehensive regulatory framework for artificial intelligence has been proposed by policymakers, aiming to balance innovation with ethical considerations and risk management. The proposal addresses data privacy, algorithmic transparency, and safety standards.',
          source: { id: 'mock-ai', name: 'Tech Policy' },
          author: 'Technology Policy Expert'
        },
        {
          title: 'Quantum Computing Breakthrough Announced',
          description: 'Researchers have reported a significant advancement in quantum computing technology, potentially accelerating the timeline for practical applications. The development could have far-reaching implications for cryptography, materials science, and complex system modeling.',
          source: { id: 'mock-quantum', name: 'Science & Tech' },
          author: 'Science Correspondent'
        }
      ]
    };
    
    return headlines[category.toLowerCase()] || [];
  }

  private generateMockSearchResults(query: string): NewsArticle[] {
    const now = new Date();
    const articles: NewsArticle[] = [];
    
    // Generate query-relevant mock articles
    const queryTerms = query.toLowerCase().split(/\s+OR\s+|\s+AND\s+|\s+/);
    const relevantTopics = this.getRelevantTopics(queryTerms);
    
    for (let i = 0; i < relevantTopics.length; i++) {
      const topic = relevantTopics[i];
      const publishedDate = new Date(now);
      publishedDate.setHours(now.getHours() - i * 4); // Space out publication times
      
      articles.push({
        id: `mock_article_${i}`,
        title: topic.title,
        description: topic.description,
        content: topic.description + ' ' + this.generateLoremIpsum(3),
        url: 'https://example.com/article',
        urlToImage: topic.imageUrl,
        publishedAt: publishedDate.toISOString(),
        source: {
          id: topic.source.id,
          name: topic.source.name
        },
        author: topic.author,
        sentiment: this.analyzeSentiment(topic.title + ' ' + topic.description),
        relevanceScore: this.calculateRelevance(topic.title + ' ' + topic.description)
      });
    }
    
    return articles;
  }

  private getRelevantTopics(queryTerms: string[]): Array<{
    title: string;
    description: string;
    imageUrl?: string;
    source: { id: string; name: string };
    author?: string;
  }> {
    // Map of keywords to relevant topics
    const topicMap: Record<string, Array<{
      title: string;
      description: string;
      imageUrl?: string;
      source: { id: string; name: string };
      author?: string;
    }>> = {
      'geopolitics': [
        {
          title: 'Shifting Alliances Reshape Global Power Dynamics',
          description: 'Recent diplomatic developments signal a significant realignment of international alliances, with implications for global governance, security cooperation, and economic partnerships. Experts suggest these changes reflect deeper structural shifts in the international order.',
          source: { id: 'mock-geopolitics', name: 'Global Affairs' },
          author: 'International Relations Expert'
        },
        {
          title: 'Resource Competition Intensifies in Strategic Regions',
          description: 'Competition for critical resources is escalating in several strategic regions, raising concerns about potential conflicts and governance challenges. The situation highlights the intersection of economic interests, environmental considerations, and security priorities.',
          source: { id: 'mock-resources', name: 'Resource Monitor' },
          author: 'Strategic Resources Analyst'
        }
      ],
      'international': [
        {
          title: 'International Organizations Face Reform Pressure',
          description: 'Major international organizations are under increasing pressure to implement structural reforms to address representation, effectiveness, and funding challenges. The debate reflects broader questions about global governance in a changing world order.',
          source: { id: 'mock-international', name: 'Global Institutions' },
          author: 'Global Governance Specialist'
        },
        {
          title: 'Cross-Border Cooperation Framework Proposed',
          description: 'A new framework for enhanced cross-border cooperation on transnational challenges has been proposed by a coalition of countries. The initiative aims to address issues ranging from climate change to cybersecurity through coordinated policy approaches.',
          source: { id: 'mock-cooperation', name: 'International Policy' },
          author: 'Transnational Affairs Correspondent'
        }
      ],
      'crisis': [
        {
          title: 'Humanitarian Crisis Escalates in Conflict Zone',
          description: 'The humanitarian situation has deteriorated rapidly in the conflict-affected region, with reports of civilian casualties, infrastructure damage, and population displacement. Aid organizations are calling for immediate access and increased international support.',
          source: { id: 'mock-humanitarian', name: 'Humanitarian Observer' },
          author: 'Crisis Response Reporter'
        },
        {
          title: 'Economic Crisis Triggers Social Unrest',
          description: 'Severe economic challenges have led to widespread social unrest in several countries, with protests over rising costs of living, unemployment, and perceived governance failures. Authorities are struggling to address underlying grievances while maintaining stability.',
          source: { id: 'mock-economic-crisis', name: 'Economic Monitor' },
          author: 'Social Affairs Analyst'
        }
      ],
      'conflict': [
        {
          title: 'Border Conflict Escalates Despite Diplomatic Efforts',
          description: 'Tensions along the disputed border have intensified despite ongoing diplomatic initiatives, with reports of military buildups and occasional skirmishes. International mediators are urging restraint and a return to negotiations.',
          source: { id: 'mock-border', name: 'Conflict Monitor' },
          author: 'Border Affairs Correspondent'
        },
        {
          title: 'Internal Conflict Creates Regional Security Challenges',
          description: 'The ongoing internal conflict has created significant security challenges for neighboring countries, including refugee flows, cross-border militant activities, and economic disruption. Regional cooperation mechanisms are being tested by the complex crisis.',
          source: { id: 'mock-internal', name: 'Regional Security' },
          author: 'Security Affairs Analyst'
        }
      ],
      'trade': [
        {
          title: 'Trade Tensions Escalate with New Tariff Measures',
          description: 'Economic relations between major trading partners have deteriorated following the announcement of new tariff measures targeting key industries. Business leaders warn of supply chain disruptions and increased costs for consumers and manufacturers.',
          source: { id: 'mock-tariff', name: 'Trade & Economics' },
          author: 'Trade Policy Analyst'
        },
        {
          title: 'Regional Trade Agreement Enters Final Negotiation Phase',
          description: 'Negotiations for a comprehensive regional trade agreement have entered their final phase, with participants working to resolve remaining differences on market access, regulatory standards, and dispute resolution mechanisms.',
          source: { id: 'mock-trade-agreement', name: 'Trade Monitor' },
          author: 'International Trade Correspondent'
        }
      ]
    };
    
    // Collect relevant topics based on query terms
    const relevantTopics: Array<{
      title: string;
      description: string;
      imageUrl?: string;
      source: { id: string; name: string };
      author?: string;
    }> = [];
    
    for (const term of queryTerms) {
      if (topicMap[term]) {
        relevantTopics.push(...topicMap[term]);
      }
    }
    
    // If no specific matches, return general geopolitical topics
    if (relevantTopics.length === 0) {
      relevantTopics.push(...topicMap['geopolitics']);
      relevantTopics.push(...topicMap['international']);
    }
    
    return relevantTopics;
  }

  private generateMockGeopoliticalNews(region?: string): NewsArticle[] {
    const now = new Date();
    const articles: NewsArticle[] = [];
    
    // Generate region-specific geopolitical news
    const geopoliticalTopics = this.getGeopoliticalTopics(region);
    
    for (let i = 0; i < geopoliticalTopics.length; i++) {
      const topic = geopoliticalTopics[i];
      const publishedDate = new Date(now);
      publishedDate.setHours(now.getHours() - i * 6); // Space out publication times
      
      articles.push({
        id: `mock_geopolitical_${i}`,
        title: topic.title,
        description: topic.description,
        content: topic.description + ' ' + this.generateLoremIpsum(3),
        url: 'https://example.com/geopolitical-news',
        urlToImage: topic.imageUrl,
        publishedAt: publishedDate.toISOString(),
        source: {
          id: topic.source.id,
          name: topic.source.name
        },
        author: topic.author,
        sentiment: this.analyzeSentiment(topic.title + ' ' + topic.description),
        relevanceScore: this.calculateRelevance(topic.title + ' ' + topic.description)
      });
    }
    
    return articles;
  }

  private getGeopoliticalTopics(region?: string): Array<{
    title: string;
    description: string;
    imageUrl?: string;
    source: { id: string; name: string };
    author?: string;
  }> {
    // General geopolitical topics
    const generalTopics = [
      {
        title: 'Global Security Architecture Under Strain',
        description: 'The international security architecture is facing unprecedented challenges as traditional alliances evolve and new powers assert their influence. Experts point to a combination of technological change, shifting economic weight, and emerging security threats as key factors reshaping global dynamics.',
        source: { id: 'mock-security', name: 'Security Affairs' },
        author: 'Global Security Analyst'
      },
      {
        title: 'Multilateral Institutions Seek Renewal Amid Criticism',
        description: 'Major multilateral institutions are pursuing reform agendas in response to mounting criticism about their effectiveness, representation, and legitimacy. The initiatives aim to adapt these organizations to contemporary global challenges while preserving their core functions.',
        source: { id: 'mock-multilateral', name: 'Global Governance' },
        author: 'International Organizations Correspondent'
      },
      {
        title: 'Technology Competition Reshapes International Relations',
        description: 'Competition for technological leadership is increasingly shaping diplomatic relations, trade policies, and security arrangements. The race for dominance in artificial intelligence, quantum computing, and advanced manufacturing has significant geopolitical implications.',
        source: { id: 'mock-tech-competition', name: 'Technology & Policy' },
        author: 'Technology Policy Expert'
      }
    ];
    
    // Region-specific topics
    if (region) {
      const regionTopics = this.getRegionSpecificGeopoliticalTopics(region);
      return [...regionTopics, ...generalTopics];
    }
    
    return generalTopics;
  }

  private getRegionSpecificGeopoliticalTopics(region: string): Array<{
    title: string;
    description: string;
    imageUrl?: string;
    source: { id: string; name: string };
    author?: string;
  }> {
    const regionMap: Record<string, Array<{
      title: string;
      description: string;
      imageUrl?: string;
      source: { id: string; name: string };
      author?: string;
    }>> = {
      'USA': [
        {
          title: 'US Foreign Policy Priorities Shift Amid Global Challenges',
          description: 'The United States is recalibrating its foreign policy priorities in response to evolving global challenges, with particular focus on strategic competition, alliance management, and transnational issues. The approach reflects both continuity and change in American international engagement.',
          source: { id: 'mock-us-policy', name: 'Foreign Policy Review' },
          author: 'US Foreign Policy Analyst'
        },
        {
          title: 'US-China Relations Enter New Phase of Strategic Competition',
          description: 'Relations between the United States and China are entering a new phase characterized by intensified strategic competition across multiple domains, including technology, trade, and security. Both sides are recalibrating their approaches while seeking to manage escalation risks.',
          source: { id: 'mock-us-china', name: 'International Relations' },
          author: 'Asia-Pacific Correspondent'
        }
      ],
      'CHN': [
        {
          title: 'China Expands Diplomatic and Economic Influence',
          description: 'China continues to expand its diplomatic and economic influence through infrastructure investments, trade agreements, and institutional engagement. The strategy reflects Beijing\'s long-term vision for a more multipolar international order with China playing a central role.',
          source: { id: 'mock-china', name: 'Global Affairs' },
          author: 'China Foreign Policy Expert'
        },
        {
          title: 'Regional Responses to China\'s Growing Influence',
          description: 'Countries across Asia are developing nuanced strategies to navigate China\'s growing regional influence, balancing economic opportunities with sovereignty concerns. The approaches reflect diverse national interests and historical relationships.',
          source: { id: 'mock-asia', name: 'Asian Affairs' },
          author: 'Regional Security Specialist'
        }
      ],
      'EUR': [
        {
          title: 'European Strategic Autonomy Debate Intensifies',
          description: 'The debate over European strategic autonomy has intensified amid changing transatlantic relations and evolving security challenges. Policymakers are reassessing defense capabilities, technological sovereignty, and diplomatic independence while maintaining alliance commitments.',
          source: { id: 'mock-europe', name: 'European Affairs' },
          author: 'European Policy Analyst'
        },
        {
          title: 'EU Seeks Unified Approach to External Challenges',
          description: 'The European Union is working to develop more coherent and effective approaches to external challenges, including relations with major powers, neighborhood policy, and global governance. Internal divisions remain a significant constraint on strategic cohesion.',
          source: { id: 'mock-eu', name: 'EU Observer' },
          author: 'Brussels Correspondent'
        }
      ],
      'RUS': [
        {
          title: 'Russia Adapts Foreign Policy Amid Western Sanctions',
          description: 'Russia is adapting its foreign policy approach in response to Western sanctions and diplomatic isolation, with increased emphasis on non-Western partnerships, alternative economic arrangements, and strategic assertiveness in regions of interest.',
          source: { id: 'mock-russia', name: 'Eurasian Affairs' },
          author: 'Russia Foreign Policy Expert'
        },
        {
          title: 'Russia-China Strategic Partnership Deepens',
          description: 'The strategic partnership between Russia and China continues to deepen across multiple dimensions, including military cooperation, energy trade, and diplomatic coordination. The relationship reflects both shared interests and pragmatic considerations.',
          source: { id: 'mock-russia-china', name: 'Strategic Relations' },
          author: 'International Security Analyst'
        }
      ],
      'MED': [
        {
          title: 'Middle East Regional Dynamics Shift Amid Diplomatic Initiatives',
          description: 'Regional dynamics in the Middle East are evolving as diplomatic initiatives gain momentum alongside persistent security challenges. The developments reflect changing strategic calculations among regional powers and external actors.',
          source: { id: 'mock-mideast', name: 'Middle East Monitor' },
          author: 'Regional Affairs Correspondent'
        },
        {
          title: 'Energy Security Remains Central to Middle East Geopolitics',
          description: 'Energy security considerations continue to shape geopolitical dynamics in the Middle East, even as the region navigates energy transition pressures and diversification efforts. Traditional and emerging powers are recalibrating their approaches accordingly.',
          source: { id: 'mock-energy', name: 'Energy & Geopolitics' },
          author: 'Energy Security Analyst'
        }
      ]
    };
    
    return regionMap[region] || [];
  }

  private generateMockCrisisNews(): NewsArticle[] {
    const now = new Date();
    const articles: NewsArticle[] = [];
    
    // Generate mock crisis news
    const crisisTopics = [
      {
        title: 'Humanitarian Crisis Worsens in Conflict Zone',
        description: 'The humanitarian situation has deteriorated significantly in the conflict-affected region, with acute shortages of food, medicine, and shelter. Aid organizations report limited access to affected populations and warn of potential famine conditions if immediate assistance is not provided.',
        source: { id: 'mock-humanitarian', name: 'Humanitarian Affairs' },
        author: 'Humanitarian Correspondent'
      },
      {
        title: 'Natural Disaster Prompts International Response',
        description: 'A major natural disaster has prompted a coordinated international response, with search and rescue teams, medical personnel, and relief supplies being deployed to the affected area. Local authorities are working with international organizations to address immediate needs and plan recovery efforts.',
        source: { id: 'mock-disaster', name: 'Disaster Response' },
        author: 'Emergency Response Reporter'
      },
      {
        title: 'Political Crisis Threatens Regional Stability',
        description: 'A deepening political crisis is raising concerns about regional stability as constitutional processes are contested and tensions rise between competing factions. International mediators are engaged in efforts to facilitate dialogue and prevent further escalation.',
        source: { id: 'mock-political', name: 'Political Affairs' },
        author: 'Political Crisis Analyst'
      },
      {
        title: 'Economic Crisis Triggers Social Unrest',
        description: 'Severe economic challenges have triggered widespread social unrest, with protests over rising costs of living, unemployment, and perceived governance failures. Authorities are struggling to address underlying grievances while maintaining public order.',
        source: { id: 'mock-economic', name: 'Economic Monitor' },
        author: 'Economic Affairs Correspondent'
      },
      {
        title: 'Security Crisis Prompts Diplomatic Initiatives',
        description: 'An escalating security crisis has prompted intensive diplomatic initiatives aimed at de-escalation and conflict prevention. Multiple stakeholders are engaged in parallel efforts to address immediate security concerns and underlying causes of tension.',
        source: { id: 'mock-security-crisis', name: 'Security Affairs' },
        author: 'Security Correspondent'
      }
    ];
    
    for (let i = 0; i < crisisTopics.length; i++) {
      const topic = crisisTopics[i];
      const publishedDate = new Date(now);
      publishedDate.setHours(now.getHours() - i * 8); // Space out publication times
      
      articles.push({
        id: `mock_crisis_${i}`,
        title: topic.title,
        description: topic.description,
        content: topic.description + ' ' + this.generateLoremIpsum(3),
        url: 'https://example.com/crisis-news',
        urlToImage: undefined,
        publishedAt: publishedDate.toISOString(),
        source: {
          id: topic.source.id,
          name: topic.source.name
        },
        author: topic.author,
        sentiment: this.analyzeSentiment(topic.title + ' ' + topic.description),
        relevanceScore: this.calculateRelevance(topic.title + ' ' + topic.description)
      });
    }
    
    return articles;
  }

  private generateLoremIpsum(paragraphs: number): string {
    const loremIpsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
    
    let result = '';
    for (let i = 0; i < paragraphs; i++) {
      result += loremIpsum + '\n\n';
    }
    
    return result.trim();
  }
}

export const newsApi = new NewsApiService();