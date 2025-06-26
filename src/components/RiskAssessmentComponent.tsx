import React, { useEffect, useState } from 'react';
import { newsApi } from '../services/newsApi';
import { economicApi } from '../services/economicApi';
import { geminiApi } from '../services/geminiApi';
import { RiskAssessment } from '../types/api';

const RiskAssessmentComponent: React.FC = () => {
    const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);

                // Fetch economic data
                const economicData = await economicApi.getEconomicRiskData('USA');
                if (!economicData.success || !economicData.data) throw new Error(economicData.error || 'Failed to fetch economic data');

                // Fetch news articles
                const newsData = await newsApi.getGeopoliticalNews('USA');
                if (!newsData.success || !newsData.data) throw new Error(newsData.error || 'Failed to fetch news data');

                // Analyze risk factors
                const analyzedData = await geminiApi.analyzeRiskFactors({
                    region: 'USA',
                    economicData: economicData.data,
                    newsArticles: newsData.data,
                    timeframe: 'Past Month'
                });

                if (!analyzedData.success || !analyzedData.data) throw new Error(analyzedData.error || 'Failed to analyze risk factors');

                setRiskAssessment({
                    region: 'USA',
                    overallRiskScore: analyzedData.data.riskScore,
                    riskLevel:
                        analyzedData.data.riskScore > 75
                            ? 'critical'
                            : analyzedData.data.riskScore > 50
                            ? 'high'
                            : analyzedData.data.riskScore > 25
                            ? 'moderate'
                            : 'low',
                    confidence: analyzedData.data.confidence,
                    factors: [], // Obtain detailed factors from analyzedData if available
                    trends: analyzedData.data.riskFactors.map(factor => ({
                        factor,
                        direction:
                            Math.random() > 0.5
                                ? 'increasing'
                                : 'decreasing', // Dummy logic for trends
                        rate: Math.floor(Math.random() * 10) // Dummy rate
                    })),
                    recommendations: analyzedData.data.recommendations,
                    lastAnalyzed: new Date().toISOString()
                });
            } catch (error) {
                setError(error instanceof Error ? error.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) return <div>Loading Risk Assessment...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Risk Assessment</h1>
            {riskAssessment ? (
                <div>
                    <p>Region: {riskAssessment.region}</p>
                    <p>Overall Risk Score: {riskAssessment.overallRiskScore}</p>
                    <p>Risk Level: {riskAssessment.riskLevel}</p>
                    <p>Confidence: {riskAssessment.confidence}%</p>
                    <h2>Recommendations</h2>
                    <ul>
                        {riskAssessment.recommendations.map((rec, index) => (
                            <li key={index}>{rec}</li>
                        ))}
                    </ul>
                    <h2>Trends</h2>
                    <ul>
                        {riskAssessment.trends.map((trend, index) => (
                            <li key={index}>{trend.factor}: {trend.direction} at rate {trend.rate}</li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>No data available.</p>
            )}
        </div>
    );
};

export default RiskAssessmentComponent;

