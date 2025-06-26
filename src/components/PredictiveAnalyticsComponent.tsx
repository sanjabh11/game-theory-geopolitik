import React, { useEffect, useState } from 'react';
import { geminiApi } from '../services/geminiApi';
import { economicApi } from '../services/economicApi';
import { Prediction } from '../types/api';

const PredictiveAnalyticsComponent: React.FC = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        setLoading(true);

        // Fetch historical and current economic data
        const economicData = await economicApi.getEconomicRiskData('USA');
        if (!economicData.success || !economicData.data) {
          throw new Error(economicData.error || 'Failed to fetch economic data');
        }

        // Generate predictions using AI
        const response = await geminiApi.generatePredictiveAnalysis({
          historicalData: {}, // Provide necessary historical data if available
          currentIndicators: economicData.data.indicators,
          region: 'USA',
          timeframe: 'Next 6 months'
        });

        if (!response.success || !response.data) {
          throw new Error(response.error || 'Failed to generate predictions');
        }

        // Set predictions
if (response.data && response.data.predictions) {
const predictions: Prediction[] = response.data.predictions.map((prediction: any) => ({
    ...prediction, // Ensure all properties of Prediction are accounted for
    id: prediction.id || `pred-${Date.now()}-${Math.random()}`, // Default if missing
    region: prediction.region || 'Unknown Region',
    timeframe: prediction.timeframe || 'N/A',
    methodology: prediction.methodology || 'Default',
    createdAt: prediction.createdAt || new Date().toISOString(),
    validUntil: prediction.validUntil || new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString()
}));
    setPredictions(predictions);
}
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, []);

  if (loading) return <div>Loading Predictive Analytics...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Predictive Analytics</h1>
      <ul>
        {predictions.map((prediction) => (
          <li key={prediction.id}>
            <h2>{prediction.indicator}</h2>
            <p>Current: {prediction.currentValue}</p>
            <p>Predicted: {prediction.predictedValue}</p>
            <p>Trend: {prediction.trend}</p>
            <p>Confidence: {prediction.confidence}%</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PredictiveAnalyticsComponent;

