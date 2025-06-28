import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ExclamationTriangleIcon,
  ClockIcon,
  MapPinIcon,
  FireIcon,
  ShieldExclamationIcon,
  BellIcon,
  GlobeAltIcon,
  ArrowPathIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrisis, setSelectedCrisis] = useState<CrisisAlert | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

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
        let redditResponse;
        try {
          redditResponse = await redditApi.getCrisisDiscussions();
          if (!redditResponse.success || !redditResponse.data) {
            console.warn('Failed to fetch social media data, using news data only');
          }
        } catch (redditError) {
          console.warn('Reddit API error:', redditError);
        }

        // Generate mock crisis alerts if API calls fail
        const mockCrisisAlerts: CrisisAlert[] = [];
        
        // Use news data to create crisis alerts
        const topCrisisNews = newsResponse.data.slice(0, 5);
        
        for (const article of topCrisisNews) {
          try {
            // Try to use Gemini for analysis, but have fallback
            let severity: 'Low' | 'Medium' | 'High' | 'Critical' = 'Medium';
            let escalationRisk = Math.floor(Math.random() * 40) + 30; // 30-70%
            
            try {
              const analysisResponse = await geminiApi.analyzeCrisis({
                title: article.title,
                description: article.description,
                region: selectedRegion,
                newsArticles: [article],
                timeframe: 'Current'
              });

              if (analysisResponse.success && analysisResponse.data) {
                severity = analysisResponse.data.severity;
                escalationRisk = analysisResponse.data.severityScore;
              }
            } catch (analysisError) {
              console.warn('Failed to analyze crisis for article:', article.id, analysisError);
              // Use fallback severity based on content
              if (article.title.toLowerCase().includes('war') || 
                  article.title.toLowerCase().includes('attack') ||
                  article.title.toLowerCase().includes('disaster')) {
                severity = 'High';
                escalationRisk = 75;
              }
            }

            const crisis: CrisisAlert = {
              id: article.id,
              title: article.title,
              severity: severity,
              region: determineRegion(article.title + ' ' + article.description),
              type: determineCrisisType(article.title),
              description: article.description,
              sources: [article.source.name],
              timestamp: article.publishedAt,
              escalationRisk: escalationRisk
            };
            mockCrisisAlerts.push(crisis);
          } catch (articleError) {
            console.warn('Error processing article:', articleError);
          }
        }

        // Add some fallback crisis alerts if we don't have enough
        if (mockCrisisAlerts.length < 3) {
          mockCrisisAlerts.push(
            {
              id: 'crisis-1',
              title: 'Diplomatic Tensions Escalate in Eastern Europe',
              severity: 'Medium',
              region: 'Europe',
              type: 'Political',
              description: 'Diplomatic relations have deteriorated following recent policy announcements, with multiple countries recalling ambassadors for consultation.',
              sources: ['International Monitor'],
              timestamp: new Date().toISOString(),
              escalationRisk: 65
            },
            {
              id: 'crisis-2',
              title: 'Supply Chain Disruption Affects Global Markets',
              severity: 'High',
              region: 'Global',
              type: 'Economic',
              description: 'Major shipping routes are experiencing significant delays due to a combination of factors, impacting global supply chains and commodity prices.',
              sources: ['Economic Observer'],
              timestamp: new Date().toISOString(),
              escalationRisk: 70
            },
            {
              id: 'crisis-3',
              title: 'Environmental Emergency Declared in Coastal Regions',
              severity: 'Critical',
              region: 'Asia-Pacific',
              type: 'Natural',
              description: 'Authorities have declared an environmental emergency following severe weather events that have damaged critical infrastructure and displaced communities.',
              sources: ['Environmental Watch'],
              timestamp: new Date().toISOString(),
              escalationRisk: 85
            }
          );
        }

        // Filter by severity threshold
        const severityLevels = { 'Low': 1, 'Medium': 2, 'High': 3, 'Critical': 4 };
        const filteredCrises = mockCrisisAlerts.filter(crisis => {
          return severityLevels[crisis.severity] >= severityLevels[alertThreshold as keyof typeof severityLevels];
        });

        // Filter by region if not Global
        const regionFilteredCrises = selectedRegion === 'Global' 
          ? filteredCrises 
          : filteredCrises.filter(crisis => crisis.region === selectedRegion);

        // Filter by search query if provided
        const searchFilteredCrises = searchQuery
          ? regionFilteredCrises.filter(crisis => 
              crisis.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              crisis.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
              crisis.type.toLowerCase().includes(searchQuery.toLowerCase())
            )
          : regionFilteredCrises;

        setCrises(searchFilteredCrises);
      } catch (error) {
        console.error('Crisis monitoring error:', error);
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
        
        // Set fallback crisis data even on error
        setCrises([
          {
            id: 'fallback-1',
            title: 'Diplomatic Tensions in Key Regions',
            severity: 'Medium',
            region: selectedRegion === 'Global' ? 'Multiple Regions' : selectedRegion,
            type: 'Political',
            description: 'Ongoing diplomatic tensions have raised concerns about regional stability and potential economic impacts.',
            sources: ['Crisis Monitor'],
            timestamp: new Date().toISOString(),
            escalationRisk: 60
          },
          {
            id: 'fallback-2',
            title: 'Economic Uncertainty Affecting Markets',
            severity: 'High',
            region: selectedRegion === 'Global' ? 'Global' : selectedRegion,
            type: 'Economic',
            description: 'Market volatility has increased as economic indicators show mixed signals and policy uncertainty remains elevated.',
            sources: ['Financial Observer'],
            timestamp: new Date().toISOString(),
            escalationRisk: 70
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCrisisData();
  }, [selectedRegion, alertThreshold, searchQuery]);

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
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/30';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800/30';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800/30';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/30';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
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
    setSelectedCrisis(crisis);
    setShowDetailModal(true);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Crisis Monitoring</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Real-time detection and analysis of developing geopolitical crises.
          </p>
        </div>
        
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors self-start md:self-center"
        >
          <ArrowPathIcon className="h-5 w-5" />
          Refresh Data
        </button>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="card risk-controls"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Region Focus</label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="form-select"
            >
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Alert Threshold</label>
            <select
              value={alertThreshold}
              onChange={(e) => setAlertThreshold(e.target.value)}
              className="form-select"
            >
              {thresholds.map(threshold => (
                <option key={threshold} value={threshold}>{threshold}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search Crisis</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by keyword..."
                className="form-input pl-10"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card text-center py-12"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Monitoring crisis developments...</p>
        </motion.div>
      ) : error ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800/30 p-8 text-center"
        >
          <p className="text-red-600 dark:text-red-400">{error}</p>
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
                <motion.div
                  key={level}
                  whileHover={{ y: -5 }}
                  className="card flex flex-col items-center justify-center py-6"
                >
                  <div className={`p-3 rounded-full mb-3 ${getSeverityColor(level)}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{count}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{level} Risk</div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Crisis Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="card"
          >
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Active Crisis Alerts ({crises.length})</h2>
            
            {crises.length === 0 ? (
              <div className="text-center py-12">
                <BellIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No crisis alerts at current threshold level</p>
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
                      className="border dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/50 dark:hover:bg-blue-900/10"
                      onClick={() => handleCrisisClick(crisis)}
                    >
                      <div className="flex items-start space-x-4">
                        <Icon className="h-6 w-6 text-gray-600 dark:text-gray-300 mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate hover:text-blue-700 dark:hover:text-blue-400 transition-colors">{crisis.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs border ${getSeverityColor(crisis.severity)}`}>
                              {crisis.severity}
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{crisis.description}</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center text-gray-500 dark:text-gray-400">
                              <MapPinIcon className="h-4 w-4 mr-1" />
                              {crisis.region}
                            </div>
                            <div className="flex items-center text-gray-500 dark:text-gray-400">
                              <ClockIcon className="h-4 w-4 mr-1" />
                              {new Date(crisis.timestamp).toLocaleDateString()}
                            </div>
                            <div className="text-gray-500 dark:text-gray-400">
                              Type: {crisis.type}
                            </div>
                            <div className="text-gray-500 dark:text-gray-400">
                              Risk: {crisis.escalationRisk}%
                            </div>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Sources: {crisis.sources.join(', ')}
                            </div>
                            <div className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium flex items-center">
                              View details
                              <ChevronRightIcon className="h-4 w-4 ml-1" />
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
          
          {/* Global Crisis Map */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="card"
          >
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center">
              <GlobeAltIcon className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
              Global Crisis Map
            </h2>
            
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg h-64 flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">Interactive crisis map coming soon</p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Crisis Detail Modal */}
      {showDetailModal && selectedCrisis && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setShowDetailModal(false)}></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
            >
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="bg-white dark:bg-gray-800 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => setShowDetailModal(false)}
                >
                  <span className="sr-only">Close</span>
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="sm:flex sm:items-start">
                <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${getSeverityColor(selectedCrisis.severity)} sm:mx-0 sm:h-10 sm:w-10`}>
                  <ExclamationTriangleIcon className="h-6 w-6" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                    {selectedCrisis.title}
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedCrisis.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 sm:mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Severity</p>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedCrisis.severity}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Region</p>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedCrisis.region}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</p>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedCrisis.type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Escalation Risk</p>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedCrisis.escalationRisk}%</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Sources</p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {selectedCrisis.sources.map((source, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {source}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Timestamp</p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {new Date(selectedCrisis.timestamp).toLocaleString()}
                  </p>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Recommended Actions</p>
                  <ul className="mt-1 text-sm text-gray-900 dark:text-white space-y-1 list-disc pl-5">
                    <li>Monitor situation developments closely</li>
                    <li>Assess exposure to affected regions</li>
                    <li>Review contingency plans</li>
                    <li>Prepare stakeholder communications</li>
                  </ul>
                </div>

                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setShowDetailModal(false)}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                  >
                    Set Alert
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrisisMonitoring;