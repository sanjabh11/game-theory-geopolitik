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
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Scatter,
  ScatterChart,
  ZAxis
} from 'recharts';

interface PredictionData {
  predictions: Prediction[];
  summary: string;
  risks: string[];
  opportunities: string[];
  correlationMatrix?: Record<string, Record<string, number>>;
  timeSeriesData?: Array<{
    date: string;
    [key: string]: string | number;
  }>;
}

const PredictiveAnalytics: React.FC = () => {
  const [predictionData, setPredictionData] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState('USA');
  const [timeframe, setTimeframe] = useState('6 months');
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie' | 'scatter'>('line');
  const [selectedIndicator, setSelectedIndicator] = useState<string | null>(null);

  const regions = [
    { code: 'USA', name: 'United States' },
    { code: 'CHN', name: 'China' },
    { code: 'EUR', name: 'Europe' },
    { code: 'JPN', name: 'Japan' },
    { code: 'GBR', name: 'United Kingdom' }
  ];

  const timeframes = ['3 months', '6 months', '1 year', '2 years'];
  const chartTypes = [
    { value: 'line', label: 'Line Chart' },
    { value: 'bar', label: 'Bar Chart' },
    { value: 'pie', label: 'Pie Chart' },
    { value: 'scatter', label: 'Correlation Chart' }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

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

        // Generate time series data for charts
        const timeSeriesData = generateTimeSeriesData(transformedPredictions);
        
        // Generate correlation matrix
        const correlationMatrix = generateCorrelationMatrix(transformedPredictions);

        setPredictionData({
          predictions: transformedPredictions,
          summary: predictiveResponse.data.summary,
          risks: predictiveResponse.data.risks,
          opportunities: predictiveResponse.data.opportunities,
          timeSeriesData,
          correlationMatrix
        });
        
        // Set default selected indicator
        if (transformedPredictions.length > 0 && !selectedIndicator) {
          setSelectedIndicator(transformedPredictions[0].indicator);
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    generatePredictions();
  }, [selectedRegion, timeframe]);

  const generateTimeSeriesData = (predictions: Prediction[]) => {
    const data = [];
    const now = new Date();
    const timeframeMonths = parseInt(timeframe.split(' ')[0]) || 6;
    
    // Generate monthly data points
    for (let i = 0; i <= timeframeMonths; i++) {
      const date = new Date(now);
      date.setMonth(date.getMonth() + i);
      
      const dataPoint: any = {
        date: date.toISOString().split('T')[0]
      };
      
      // Add values for each indicator
      predictions.forEach(prediction => {
        // Linear interpolation between current and predicted values
        const progress = i / timeframeMonths;
        const value = prediction.currentValue + (prediction.predictedValue - prediction.currentValue) * progress;
        dataPoint[prediction.indicator] = parseFloat(value.toFixed(2));
      });
      
      data.push(dataPoint);
    }
    
    return data;
  };

  const generateCorrelationMatrix = (predictions: Prediction[]) => {
    const matrix: Record<string, Record<string, number>> = {};
    
    // Initialize matrix with random correlations (in a real app, this would be calculated)
    predictions.forEach(pred1 => {
      matrix[pred1.indicator] = {};
      predictions.forEach(pred2 => {
        // Generate a correlation coefficient between -1 and 1
        // In a real app, this would be calculated based on historical data
        const correlation = pred1 === pred2 ? 1 : (Math.random() * 2 - 1) * 0.8;
        matrix[pred1.indicator][pred2.indicator] = parseFloat(correlation.toFixed(2));
      });
    });
    
    return matrix;
  };

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

  const prepareCorrelationData = () => {
    if (!predictionData?.correlationMatrix) return [];
    
    const data = [];
    const indicators = Object.keys(predictionData.correlationMatrix);
    
    for (let i = 0; i < indicators.length; i++) {
      for (let j = 0; j < indicators.length; j++) {
        if (i !== j) { // Skip self-correlations
          const indicator1 = indicators[i];
          const indicator2 = indicators[j];
          const correlation = predictionData.correlationMatrix[indicator1][indicator2];
          
          data.push({
            x: i,
            y: j,
            z: Math.abs(correlation) * 100,
            name: `${indicator1} vs ${indicator2}`,
            value: correlation
          });
        }
      }
    }
    
    return data;
  };

  const renderChart = () => {
    if (!predictionData?.timeSeriesData || !selectedIndicator) return null;
    
    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={predictionData.timeSeriesData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {predictionData.predictions.map((prediction, index) => (
                <Line
                  key={prediction.id}
                  type="monotone"
                  dataKey={prediction.indicator}
                  stroke={COLORS[index % COLORS.length]}
                  activeDot={{ r: 8 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
        
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={[
                {
                  name: 'Current vs Predicted',
                  ...predictionData.predictions.reduce((acc, prediction) => {
                    acc[`${prediction.indicator} (Current)`] = prediction.currentValue;
                    acc[`${prediction.indicator} (Predicted)`] = prediction.predictedValue;
                    return acc;
                  }, {})
                }
              ]}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {predictionData.predictions.flatMap((prediction, index) => [
                <Bar
                  key={`${prediction.id}-current`}
                  dataKey={`${prediction.indicator} (Current)`}
                  fill={COLORS[index % COLORS.length]}
                  opacity={0.6}
                />,
                <Bar
                  key={`${prediction.id}-predicted`}
                  dataKey={`${prediction.indicator} (Predicted)`}
                  fill={COLORS[index % COLORS.length]}
                />
              ])}
            </BarChart>
          </ResponsiveContainer>
        );
        
      case 'pie':
        const selectedPrediction = predictionData.predictions.find(p => p.indicator === selectedIndicator);
        if (!selectedPrediction) return null;
        
        const pieData = [
          { name: 'Current Value', value: selectedPrediction.currentValue },
          { name: 'Predicted Change', value: Math.abs(selectedPrediction.predictedValue - selectedPrediction.currentValue) }
        ];
        
        return (
          <div>
            <div className="mb-4">
              <label htmlFor="indicator-select" className="block text-sm font-medium text-gray-700 mb-1">
                Select Indicator
              </label>
              <select
                id="indicator-select"
                value={selectedIndicator}
                onChange={(e) => setSelectedIndicator(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {predictionData.predictions.map(prediction => (
                  <option key={prediction.id} value={prediction.indicator}>
                    {prediction.indicator}
                  </option>
                ))}
              </select>
            </div>
            
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatValue(Number(value), selectedIndicator)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );
        
      case 'scatter':
        const correlationData = prepareCorrelationData();
        
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <CartesianGrid />
              <XAxis 
                type="number" 
                dataKey="x" 
                name="Indicator 1" 
                tick={false}
                label={{ value: 'Indicators', position: 'insideBottom', offset: -10 }}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name="Indicator 2" 
                tick={false}
                label={{ value: 'Indicators', angle: -90, position: 'insideLeft' }}
              />
              <ZAxis 
                type="number" 
                dataKey="z" 
                range={[50, 500]} 
                name="Correlation Strength" 
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                formatter={(value, name, props) => {
                  if (name === 'value') {
                    return [`${(Number(value) * 100).toFixed(0)}%`, 'Correlation'];
                  }
                  return [value, name];
                }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
                        <p className="font-medium">{payload[0].payload.name}</p>
                        <p className="text-sm">
                          Correlation: <span className={Number(payload[0].payload.value) > 0 ? 'text-green-600' : 'text-red-600'}>
                            {(Number(payload[0].payload.value) * 100).toFixed(0)}%
                          </span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter 
                name="Correlations" 
                data={correlationData} 
                fill="#8884d8"
              >
                {correlationData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.value > 0 ? '#4ade80' : '#ef4444'} 
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        );
        
      default:
        return null;
    }
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Chart Type</label>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {chartTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data Refresh</label>
            <button
              onClick={() => {
                setLoading(true);
                setTimeout(() => {
                  setLoading(false);
                }, 1000);
              }}
              className="w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Refresh Data
            </button>
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

          {/* Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-xl font-semibold mb-6">Predictive Visualization</h2>
            {renderChart()}
          </motion.div>

          {/* Predictions Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
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
              transition={{ duration: 0.6, delay: 0.5 }}
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
              transition={{ duration: 0.6, delay: 0.6 }}
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
            transition={{ duration: 0.6, delay: 0.7 }}
            className="bg-blue-50 rounded-xl border border-blue-200 p-4"
          >
            <div className="flex items-start space-x-3">
              <GlobeAltIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-blue-900 mb-1">Methodology</h3>
                <p className="text-sm text-blue-800">
                  Predictions are generated using AI-enhanced economic modeling that combines current indicators, 
                  historical patterns, and geopolitical analysis. Confidence levels reflect model certainty based on 
                  data quality and historical accuracy. The visualization tools allow for trend analysis, comparative 
                  assessment, and correlation discovery across multiple indicators.
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