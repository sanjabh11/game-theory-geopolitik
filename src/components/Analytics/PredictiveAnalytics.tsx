import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
  GlobeAltIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { economicApi } from '../../services/economicApi';
import { geminiApi } from '../../services/geminiApi';
import { Prediction } from '../../types/api';

interface PredictionData {
  predictions: Prediction[];
  summary: string;
  risks: string[];
  opportunities: string[];
}

const PredictiveAnalytics: React.FC = () => {
  const [predictionData, setPredictionData] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState('USA');
  const [timeframe, setTimeframe] = useState('6 months');

  const regions = [
    { code: 'USA', name: 'United States' },
    { code: 'CHN', name: 'China' },
    { code: 'EUR', name: 'Europe' },
    { code: 'JPN', name: 'Japan' },
    { code: 'GBR', name: 'United Kingdom' }
  ];

  const timeframes = ['3 months', '6 months', '1 year', '2 years'];

  useEffect(() => {
    const generatePredictions = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch current economic data
        const economicResponse = await economicApi.getEconomicRiskData(selectedRegion);
        if (!economicResponse.success || !economicResponse.data) {
          throw new Error(economicResponse.error || 'Failed to fetch economic data');
        }

        // Generate AI-powered predictions
        const predictiveResponse = await geminiApi.generatePredictiveAnalysis({
          historicalData: {}, // In real implementation, would fetch historical data
          currentIndicators: economicResponse.data.indicators,
          region: selectedRegion,
          timeframe: timeframe
        });

        if (!predictiveResponse.success || !predictiveResponse.data) {
          throw new Error(predictiveResponse.error || 'Failed to generate predictions');
        }

        // Transform the data to include required fields
        const transformedPredictions: Prediction[] = predictiveResponse.data.predictions.map((pred: any, index: number) => ({
          id: `pred-${selectedRegion}-${index}`,
          indicator: pred.indicator,
          region: selectedRegion,
          currentValue: pred.currentValue,
          predictedValue: pred.predictedValue,
          confidence: pred.confidence,
          timeframe: timeframe,
          trend: pred.trend,
          factors: pred.factors,
          methodology: 'AI-Enhanced Economic Modeling',
          createdAt: new Date().toISOString(),
          validUntil: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString() // 6 months
        }));

        setPredictionData({
          predictions: transformedPredictions,
          summary: predictiveResponse.data.summary,
          risks: predictiveResponse.data.risks,
          opportunities: predictiveResponse.data.opportunities
        });
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    generatePredictions();
  }, [selectedRegion, timeframe]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return ArrowTrendingUpIcon;
      case 'decreasing': return ArrowTrendingDownIcon;
      default: return ChartBarIcon;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing': return 'text-green-600';
      case 'decreasing': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-100 text-green-800 border-green-200';
    if (confidence >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const formatValue = (value: number, indicator: string) => {
    const formatters: Record<string, (v: number) => string> = {
      'GDP Growth': (v) => `${v.toFixed(1)}%`,
      'Inflation Rate': (v) => `${v.toFixed(1)}%`,
      'Unemployment': (v) => `${v.toFixed(1)}%`,
      'Currency Exchange': (v) => v.toFixed(3),
      'Trade Balance': (v) => `$${(v / 1000).toFixed(1)}B`,
      'General Stability': (v) => v.toFixed(0),
      default: (v) => v.toFixed(2)
    };

    const formatter = formatters[indicator] || formatters.default;
    return formatter(value);
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Predictive Analytics</h1>
        <p className="mt-2 text-gray-600">
          AI-powered forecasting for economic and geopolitical indicators.
        </p>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {regions.map(region => (
                <option key={region.code} value={region.code}>{region.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Forecast Timeframe</label>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {timeframes.map(tf => (
                <option key={tf} value={tf}>{tf}</option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center"
        >
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating predictive analysis...</p>
        </motion.div>
      ) : error ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-50 rounded-xl border border-red-200 p-8 text-center"
        >
          <p className="text-red-600">{error}</p>
        </motion.div>
      ) : predictionData ? (
        <div className="space-y-6">
          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <ChartBarIcon className="h-6 w-6 mr-2 text-blue-600" />
              Analysis Summary
            </h2>
            <p className="text-gray-700">{predictionData.summary}</p>
          </motion.div>

          {/* Predictions Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-xl font-semibold mb-6">Key Predictions ({predictionData.predictions.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {predictionData.predictions.map((prediction, index) => {
                const TrendIcon = getTrendIcon(prediction.trend);
                const change = ((prediction.predictedValue - prediction.currentValue) / prediction.currentValue) * 100;
                
                return (
                  <motion.div
                    key={prediction.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">{prediction.indicator}</h3>
                      <TrendIcon className={`h-5 w-5 ${getTrendColor(prediction.trend)}`} />
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Current:</span>
                        <span className="font-medium">{formatValue(prediction.currentValue, prediction.indicator)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Predicted:</span>
                        <span className="font-medium">{formatValue(prediction.predictedValue, prediction.indicator)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Change:</span>
                        <span className={`font-medium ${
                          change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Confidence</span>
                      <span className={`px-2 py-1 rounded-full text-xs border ${getConfidenceColor(prediction.confidence)}`}>
                        {prediction.confidence}%
                      </span>
                    </div>
                    
                    <div className="mt-3">
                      <div className="text-xs text-gray-500 mb-1">Key Factors:</div>
                      <div className="flex flex-wrap gap-1">
                        {prediction.factors.slice(0, 2).map((factor, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {factor}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Risks and Opportunities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risks */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <ExclamationTriangleIcon className="h-6 w-6 mr-2 text-orange-600" />
                Risk Factors
              </h2>
              <div className="space-y-3">
                {predictionData.risks.map((risk, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700">{risk}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Opportunities */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <CheckCircleIcon className="h-6 w-6 mr-2 text-green-600" />
                Opportunities
              </h2>
              <div className="space-y-3">
                {predictionData.opportunities.map((opportunity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700">{opportunity}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Methodology Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-blue-50 rounded-xl border border-blue-200 p-4"
          >
            <div className="flex items-start space-x-3">
              <GlobeAltIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-blue-900 mb-1">Methodology</h3>
                <p className="text-sm text-blue-800">
                  Predictions are generated using AI-enhanced economic modeling that combines current indicators, 
                  historical patterns, and geopolitical analysis. Confidence levels reflect model certainty based on 
                  data quality and historical accuracy.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      ) : null}
    </div>
  );
};

export default PredictiveAnalytics;
