import { ApiResponse, EconomicData, EconomicIndicator } from '../types/api';

const ALPHA_VANTAGE_API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

export class EconomicApiService {
  private async makeRequest<T>(params: Record<string, string>): Promise<T> {
    const url = new URL(BASE_URL);
    
    // Add API key and parameters
    url.searchParams.append('apikey', ALPHA_VANTAGE_API_KEY);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Alpha Vantage API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data['Error Message']) {
      throw new Error(data['Error Message']);
    }

    if (data['Note']) {
      throw new Error('API call frequency limit reached. Please try again later.');
    }

    return data;
  }

  /**
   * Get real GDP data
   */
  async getRealGDP(country: string = 'USA'): Promise<ApiResponse<EconomicIndicator>> {
    try {
      const result = await this.makeRequest<{ data?: Array<{ date: string; value: string }> }>({
        function: 'REAL_GDP',
        interval: 'annual',
        datatype: 'json'
      });

      const data = result.data || [];
      const latestData = data.slice(0, 10); // Last 10 years

      return {
        success: true,
        data: {
          name: 'Real GDP',
          country,
          unit: 'Billions of USD',
          data: latestData.map((item: { date: string; value: string }) => ({
            date: item.date,
            value: parseFloat(item.value),
            change: 0 // Calculate change if needed
          })),
          lastUpdated: new Date().toISOString()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch GDP data'
      };
    }
  }

  /**
   * Get inflation data
   */
  async getInflationRate(country: string = 'USA'): Promise<ApiResponse<EconomicIndicator>> {
    try {
      const result = await this.makeRequest<{ data?: Array<{ date: string; value: string }> }>({
        function: 'INFLATION',
        datatype: 'json'
      });

      const data = result.data || [];
      const latestData = data.slice(0, 24); // Last 24 months

      return {
        success: true,
        data: {
          name: 'Inflation Rate',
          country,
          unit: 'Percent',
          data: latestData.map((item: { date: string; value: string }) => ({
            date: item.date,
            value: parseFloat(item.value),
            change: 0
          })),
          lastUpdated: new Date().toISOString()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch inflation data'
      };
    }
  }

  /**
   * Get unemployment rate
   */
  async getUnemploymentRate(country: string = 'USA'): Promise<ApiResponse<EconomicIndicator>> {
    try {
      const result = await this.makeRequest<{ data?: Array<{ date: string; value: string }> }>({
        function: 'UNEMPLOYMENT',
        datatype: 'json'
      });

      const data = result.data || [];
      const latestData = data.slice(0, 36); // Last 36 months

      return {
        success: true,
        data: {
          name: 'Unemployment Rate',
          country,
          unit: 'Percent',
          data: latestData.map((item: { date: string; value: string }) => ({
            date: item.date,
            value: parseFloat(item.value),
            change: 0
          })),
          lastUpdated: new Date().toISOString()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch unemployment data'
      };
    }
  }

  /**
   * Get foreign exchange rates
   */
  async getExchangeRate(fromCurrency: string, toCurrency: string): Promise<ApiResponse<{ pair: string; data: Array<{ date: string; open: number; high: number; low: number; close: number }>; lastUpdated: string }>> {
    try {
      const result = await this.makeRequest<{ 'Time Series (Daily)'?: Record<string, { '1. open': string; '2. high': string; '3. low': string; '4. close': string }> }>({
        function: 'FX_DAILY',
        from_symbol: fromCurrency,
        to_symbol: toCurrency,
        datatype: 'json'
      });

      const timeSeries = result['Time Series (Daily)'] || {};
      const dates = Object.keys(timeSeries).slice(0, 30); // Last 30 days
      
      const data = dates.map(date => ({
        date,
        open: parseFloat(timeSeries[date]['1. open']),
        high: parseFloat(timeSeries[date]['2. high']),
        low: parseFloat(timeSeries[date]['3. low']),
        close: parseFloat(timeSeries[date]['4. close'])
      }));

      return {
        success: true,
        data: {
          pair: `${fromCurrency}/${toCurrency}`,
          data,
          lastUpdated: new Date().toISOString()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch exchange rate data'
      };
    }
  }

  /**
   * Get comprehensive economic data for risk assessment
   */
  async getEconomicRiskData(country: string = 'USA'): Promise<ApiResponse<EconomicData>> {
    try {
      // For demo purposes, we'll simulate comprehensive economic data
      // In a real implementation, you'd make multiple API calls and aggregate
      
      const mockData: EconomicData = {
        country,
        indicators: {
          gdp: {
            value: 25.4,
            change: 2.1,
            trend: 'positive',
            unit: 'Trillion USD'
          },
          inflation: {
            value: 3.2,
            change: -0.4,
            trend: 'negative',
            unit: 'Percent'
          },
          unemployment: {
            value: 3.7,
            change: 0.1,
            trend: 'stable',
            unit: 'Percent'
          },
          interestRate: {
            value: 5.25,
            change: 0.25,
            trend: 'positive',
            unit: 'Percent'
          },
          tradeBalance: {
            value: -67.4,
            change: -2.1,
            trend: 'negative',
            unit: 'Billion USD'
          },
          currencyStrength: {
            value: 102.5,
            change: 1.2,
            trend: 'positive',
            unit: 'Index'
          }
        },
        riskScore: this.calculateEconomicRiskScore(country),
        lastUpdated: new Date().toISOString()
      };

      return {
        success: true,
        data: mockData
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch economic risk data'
      };
    }
  }

  private calculateEconomicRiskScore(country: string): number {
    // Simplified risk scoring based on country
    const riskFactors: Record<string, number> = {
      'USA': 25,
      'Germany': 20,
      'Japan': 30,
      'China': 40,
      'Russia': 70,
      'Turkey': 65,
      'Argentina': 80,
      'Venezuela': 95
    };

    return riskFactors[country] || 50;
  }

  /**
   * Get commodity prices (oil, gold, etc.)
   */
  async getCommodityPrices(): Promise<ApiResponse<Array<{ name: string; symbol: string; price: number; change: number; unit: string; lastUpdated: string }>>> {
    try {
      // Get crude oil prices
      const oilResult = await this.makeRequest<{ data?: Array<{ value: number }> }>({
        function: 'WTI',
        interval: 'daily',
        datatype: 'json'
      });

      const oilData = oilResult.data || [];
      
      return {
        success: true,
        data: [
          {
            name: 'Crude Oil (WTI)',
            symbol: 'WTI',
            price: oilData[0]?.value || 75.50,
            change: 2.1,
            unit: 'USD/barrel',
            lastUpdated: new Date().toISOString()
          },
          {
            name: 'Gold',
            symbol: 'GOLD',
            price: 2050.25,
            change: -12.30,
            unit: 'USD/oz',
            lastUpdated: new Date().toISOString()
          },
          {
            name: 'Natural Gas',
            symbol: 'NATGAS',
            price: 2.85,
            change: 0.15,
            unit: 'USD/MMBtu',
            lastUpdated: new Date().toISOString()
          }
        ]
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch commodity prices'
      };
    }
  }
}

export const economicApi = new EconomicApiService();
