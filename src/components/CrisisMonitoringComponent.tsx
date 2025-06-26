import React, { useEffect, useState } from 'react';
import { newsApi } from '../services/newsApi';
import { redditApi } from '../services/redditApi';
import { geminiApi } from '../services/geminiApi';
import { Crisis } from '../types/api';

const CrisisMonitoringComponent: React.FC = () => {
  const [crises, setCrises] = useState<Crisis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const monitorCrises = async () => {
      try {
        setLoading(true);

        // Fetch crisis-related news
        const newsResponse = await newsApi.getCrisisNews();
        if (!newsResponse.success || !newsResponse.data) {
          throw new Error(newsResponse.error || 'Failed to fetch crisis news');
        }

        // Fetch crisis discussions from Reddit
        const redditResponse = await redditApi.getCrisisDiscussions();
        if (!redditResponse.success || !redditResponse.data) {
          throw new Error(redditResponse.error || 'Failed to fetch crisis discussions');
        }

        // Analyze crisis severity using AI
        const crisisAnalysis = await geminiApi.analyzeCrisis({
          title: 'Current Global Crisis Monitoring',
          description: 'Analysis of current crisis indicators based on news and social media',
          region: 'Global',
          newsArticles: newsResponse.data,
          timeframe: 'Last 24 hours'
        });

        if (!crisisAnalysis.success || !crisisAnalysis.data) {
          throw new Error(crisisAnalysis.error || 'Failed to analyze crisis data');
        }

        // Create crisis objects from analysis
        const detectedCrises: Crisis[] = [
          {
            id: 'crisis-1',
            title: 'Geopolitical Tensions Analysis',
            description: 'Ongoing monitoring of global geopolitical developments',
            region: 'Global',
            type: 'political',
            severity: crisisAnalysis.data.severity.toLowerCase() as Crisis['severity'],
            status: 'active',
            startDate: new Date().toISOString(),
            affectedCountries: ['Multiple'],
            keyEvents: newsResponse.data.slice(0, 5).map((article, index) => ({
              id: `event-${index}`,
              timestamp: article.publishedAt,
              title: article.title,
              description: article.description,
              source: article.source.name,
              impact: Math.floor(Math.random() * 100)
            })),
            indicators: [
              {
                name: 'Media Coverage',
                value: newsResponse.data.length,
                threshold: 50,
                status: newsResponse.data.length > 50 ? 'critical' : 'normal',
                trend: 'stable',
                lastUpdated: new Date().toISOString()
              },
              {
                name: 'Social Media Activity',
                value: redditResponse.data.length,
                threshold: 20,
                status: redditResponse.data.length > 20 ? 'warning' : 'normal',
                trend: 'worsening',
                lastUpdated: new Date().toISOString()
              }
            ],
            response: crisisAnalysis.data.immediateActions.map((action, index) => ({
              id: `response-${index}`,
              actor: 'Automated System',
              action,
              timestamp: new Date().toISOString(),
              effectiveness: 75,
              category: 'diplomatic'
            })),
            lastUpdated: new Date().toISOString()
          }
        ];

        setCrises(detectedCrises);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    monitorCrises();

    // Set up real-time monitoring (every 5 minutes)
    const interval = setInterval(monitorCrises, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: Crisis['severity']) => {
    switch (severity) {
      case 'critical': return '#ff4444';
      case 'high': return '#ff8800';
      case 'medium': return '#ffcc00';
      case 'low': return '#44aa44';
      default: return '#888888';
    }
  };

  const getStatusColor = (status: Crisis['status']) => {
    switch (status) {
      case 'escalating': return '#ff4444';
      case 'active': return '#ff8800';
      case 'emerging': return '#ffcc00';
      case 'de-escalating': return '#44aa44';
      case 'resolved': return '#888888';
      default: return '#888888';
    }
  };

  if (loading) return <div className="p-6">Loading Crisis Monitoring...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Crisis Monitoring</h1>
      
      <div className="mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span>Real-time Monitoring Active</span>
          </div>
          <div className="text-sm text-gray-600">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {crises.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No active crises detected</p>
        </div>
      ) : (
        <div className="space-y-6">
          {crises.map((crisis) => (
            <div key={crisis.id} className="border rounded-lg p-6 bg-white shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">{crisis.title}</h2>
                <div className="flex items-center space-x-2">
                  <span 
                    className="px-2 py-1 rounded text-white text-sm"
                    style={{ backgroundColor: getSeverityColor(crisis.severity) }}
                  >
                    {crisis.severity.toUpperCase()}
                  </span>
                  <span 
                    className="px-2 py-1 rounded text-white text-sm"
                    style={{ backgroundColor: getStatusColor(crisis.status) }}
                  >
                    {crisis.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{crisis.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="font-semibold mb-2">Crisis Details</h3>
                  <ul className="text-sm space-y-1">
                    <li><strong>Region:</strong> {crisis.region}</li>
                    <li><strong>Type:</strong> {crisis.type}</li>
                    <li><strong>Started:</strong> {new Date(crisis.startDate).toLocaleDateString()}</li>
                    <li><strong>Affected Countries:</strong> {crisis.affectedCountries.join(', ')}</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Key Indicators</h3>
                  {crisis.indicators.map((indicator, index) => (
                    <div key={index} className="flex items-center justify-between text-sm mb-1">
                      <span>{indicator.name}:</span>
                      <div className="flex items-center space-x-2">
                        <span>{indicator.value}</span>
                        <span 
                          className="px-1 py-0.5 rounded text-xs text-white"
                          style={{ 
                            backgroundColor: indicator.status === 'critical' ? '#ff4444' : 
                                           indicator.status === 'warning' ? '#ff8800' : '#44aa44'
                          }}
                        >
                          {indicator.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold mb-2">Recent Events ({crisis.keyEvents.length})</h3>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {crisis.keyEvents.map((event) => (
                    <div key={event.id} className="text-sm border-l-2 border-blue-300 pl-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{event.title}</span>
                        <span className="text-gray-500">
                          {new Date(event.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600">{event.description}</p>
                      <p className="text-xs text-gray-500">Source: {event.source}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Response Actions ({crisis.response.length})</h3>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {crisis.response.map((response) => (
                    <div key={response.id} className="text-sm flex items-center justify-between">
                      <span>{response.action}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">{response.actor}</span>
                        <span className="text-green-600">{response.effectiveness}% effective</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CrisisMonitoringComponent;
