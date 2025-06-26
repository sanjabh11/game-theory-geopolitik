import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ExclamationTriangleIcon,
  ClockIcon,
  MapPinIcon,
  FireIcon,
  ShieldExclamationIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { newsApi } from '../../services/newsApi';
import { redditApi } from '../../services/redditApi';
import { geminiApi } from '../../services/geminiApi';

interface CrisisAlert {
  id: string;
  title: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  region: string;
  type: string;
  description: string;
  sources: string[];
  timestamp: string;
  escalationRisk: number;
}

const CrisisMonitoring: React.FC = () => {
  const [crises, setCrises] = useState<CrisisAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState('Global');
  const [alertThreshold, setAlertThreshold] = useState('Medium');

  const regions = ['Global', 'North America', 'Europe', 'Asia-Pacific', 'Middle East', 'Africa', 'Latin America'];
  const thresholds = ['Low', 'Medium', 'High', 'Critical'];

  useEffect(() => {
    const fetchCrisisData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch crisis-related news
        const newsResponse = await newsApi.getCrisisNews();
        if (!newsResponse.success || !newsResponse.data) {
          throw new Error(newsResponse.error || 'Failed to fetch crisis news');
        }

        // Fetch social media sentiment
        const redditResponse = await redditApi.getCrisisDiscussions();
        if (!redditResponse.success || !redditResponse.data) {
          throw new Error(redditResponse.error || 'Failed to fetch social media data');
        }

        // Analyze crisis severity for each major news item
        const crisisAlerts: CrisisAlert[] = [];
        const topCrisisNews = newsResponse.data.slice(0, 5);

        for (const article of topCrisisNews) {
          try {
            const analysisResponse = await geminiApi.analyzeCrisis({
              title: article.title,
              description: article.description,
              region: selectedRegion,
              newsArticles: [article],
              timeframe: 'Current'
            });

            if (analysisResponse.success && analysisResponse.data) {
              const crisis: CrisisAlert = {
                id: article.id,
                title: article.title,
                severity: analysisResponse.data.severity,
                region: determineRegion(article.title + ' ' + article.description),
                type: determineCrisisType(article.title),
                description: article.description,
                sources: [article.source.name],
                timestamp: article.publishedAt,
                escalationRisk: analysisResponse.data.severityScore
              };
              crisisAlerts.push(crisis);
            }
          } catch (analysisError) {
            console.warn('Failed to analyze crisis for article:', article.id, analysisError);
          }
        }

        // Filter by severity threshold
        const filteredCrises = crisisAlerts.filter(crisis => {
          const severityLevels = { 'Low': 1, 'Medium': 2, 'High': 3, 'Critical': 4 };
          return severityLevels[crisis.severity] >= severityLevels[alertThreshold as keyof typeof severityLevels];
        });

        setCrises(filteredCrises);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCrisisData();
  }, [selectedRegion, alertThreshold]);

  const determineRegion = (text: string): string => {
    const regionKeywords = {
      'North America': ['usa', 'america', 'canada', 'mexico', 'united states'],
      'Europe': ['europe', 'eu', 'germany', 'france', 'uk', 'britain', 'russia', 'ukraine'],
      'Asia-Pacific': ['china', 'japan', 'korea', 'india', 'asia', 'pacific'],
      'Middle East': ['middle east', 'israel', 'iran', 'saudi', 'iraq', 'syria'],
      'Africa': ['africa', 'nigeria', 'egypt', 'south africa'],
      'Latin America': ['brazil', 'argentina', 'venezuela', 'colombia', 'latin america']
    };

    const lowerText = text.toLowerCase();
    for (const [region, keywords] of Object.entries(regionKeywords)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        return region;
      }
    }
    return 'Global';
  };

  const determineCrisisType = (title: string): string => {
    const typeKeywords = {
      'Military': ['war', 'military', 'attack', 'invasion', 'conflict', 'battle'],
      'Political': ['election', 'government', 'coup', 'political', 'democracy'],
      'Economic': ['economic', 'recession', 'financial', 'market', 'trade'],
      'Natural': ['earthquake', 'flood', 'hurricane', 'disaster', 'climate'],
      'Terrorism': ['terrorist', 'bombing', 'attack', 'security'],
      'Diplomatic': ['sanctions', 'embassy', 'diplomatic', 'treaty']
    };

    const lowerTitle = title.toLowerCase();
    for (const [type, keywords] of Object.entries(typeKeywords)) {
      if (keywords.some(keyword => lowerTitle.includes(keyword))) {
        return type;
      }
    }
    return 'General';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'Critical': return FireIcon;
      case 'High': return ExclamationTriangleIcon;
      case 'Medium': return ShieldExclamationIcon;
      case 'Low': return BellIcon;
      default: return BellIcon;
    }
  };

  const handleCrisisClick = (crisis: CrisisAlert) => {
    // Show detailed crisis information in a modal or navigate to detail page
    alert(`Crisis Details:\n\n` +
          `Title: ${crisis.title}\n` +
          `Severity: ${crisis.severity}\n` +
          `Region: ${crisis.region}\n` +
          `Type: ${crisis.type}\n` +
          `Escalation Risk: ${crisis.escalationRisk}%\n\n` +
          `Description: ${crisis.description}\n\n` +
          `Sources: ${crisis.sources.join(', ')}\n` +
          `Timestamp: ${new Date(crisis.timestamp).toLocaleString()}`);
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Crisis Monitoring</h1>
        <p className="mt-2 text-gray-600">
          Real-time detection and analysis of developing geopolitical crises.
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Region Focus</label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Alert Threshold</label>
            <select
              value={alertThreshold}
              onChange={(e) => setAlertThreshold(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {thresholds.map(threshold => (
                <option key={threshold} value={threshold}>{threshold}</option>
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
          <p className="text-gray-600">Monitoring crisis developments...</p>
        </motion.div>
      ) : error ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-50 rounded-xl border border-red-200 p-8 text-center"
        >
          <p className="text-red-600">{error}</p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {/* Crisis Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {['Critical', 'High', 'Medium', 'Low'].map(level => {
              const count = crises.filter(c => c.severity === level).length;
              const Icon = getSeverityIcon(level);
              return (
                <div key={level} className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                  <Icon className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                  <div className="text-2xl font-bold text-gray-900">{count}</div>
                  <div className="text-sm text-gray-600">{level} Risk</div>
                </div>
              );
            })}
          </motion.div>

          {/* Crisis Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-xl font-semibold mb-6">Active Crisis Alerts ({crises.length})</h2>
            
            {crises.length === 0 ? (
              <div className="text-center py-8">
                <BellIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No crisis alerts at current threshold level</p>
              </div>
            ) : (
              <div className="space-y-4">
                {crises.map((crisis, index) => {
                  const Icon = getSeverityIcon(crisis.severity);
                  return (
                    <motion.div
                      key={crisis.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer hover:border-blue-300 hover:bg-blue-50/50"
                      onClick={() => handleCrisisClick(crisis)}
                    >
                      <div className="flex items-start space-x-4">
                        <Icon className="h-6 w-6 text-gray-600 mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-medium text-gray-900 truncate hover:text-blue-700 transition-colors">{crisis.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs border ${getSeverityColor(crisis.severity)}`}>
                              {crisis.severity}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-3 line-clamp-2">{crisis.description}</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center text-gray-500">
                              <MapPinIcon className="h-4 w-4 mr-1" />
                              {crisis.region}
                            </div>
                            <div className="flex items-center text-gray-500">
                              <ClockIcon className="h-4 w-4 mr-1" />
                              {new Date(crisis.timestamp).toLocaleDateString()}
                            </div>
                            <div className="text-gray-500">
                              Type: {crisis.type}
                            </div>
                            <div className="text-gray-500">
                              Risk: {crisis.escalationRisk}%
                            </div>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <div className="text-xs text-gray-500">
                              Sources: {crisis.sources.join(', ')}
                            </div>
                            <div className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                              Click for details →
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CrisisMonitoring;
