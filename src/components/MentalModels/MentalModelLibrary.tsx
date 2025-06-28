import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { mentalModelApi } from '../../services/mentalModelApi';
import { 
  MagnifyingGlassIcon, 
  BookOpenIcon,
  AcademicCapIcon,
  LightBulbIcon,
  ArrowPathIcon,
  ChartBarIcon,
  PuzzlePieceIcon,
  ArrowTopRightOnSquareIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface MentalModel {
  id: string;
  name: string;
  category: 'cognitive' | 'strategic' | 'analytical' | 'creative' | 'systems';
  complexity_score: number;
  application_scenarios: string[];
  prompt_template: string;
  performance_metrics: {
    accuracy: number;
    usage_count: number;
    success_rate: number;
    relevance_score: number;
  };
  description: string;
  limitations: string[];
  case_study?: string;
}

const MentalModelLibrary: React.FC = () => {
  const [models, setModels] = useState<MentalModel[]>([]);
  const [filteredModels, setFilteredModels] = useState<MentalModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<MentalModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All Categories');
  const [complexityFilter, setComplexityFilter] = useState<string>('All Levels');

  useEffect(() => {
    const fetchMentalModels = async () => {
      try {
        setLoading(true);
        setError(null);

        // In a real implementation, we would fetch from Supabase
        // For now, use fallback data
        const response = await mentalModelApi.getAllModels();
        
        if (!response.success || !response.data) {
          throw new Error('Failed to fetch mental models');
        }
        
        setModels(response.data);
        setFilteredModels(response.data);
      } catch (error) {
        console.error('Error fetching mental models:', error);
        setError('Failed to load mental models. Using fallback data.');
        
        // Use fallback data on error
        const fallbackModels = getFallbackModels();
        setModels(fallbackModels);
        setFilteredModels(fallbackModels);
      } finally {
        setLoading(false);
      }
    };

    fetchMentalModels();
  }, []);

  useEffect(() => {
    // Apply filters and search
    let result = [...models];

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        model => 
          model.name.toLowerCase().includes(query) || 
          model.description.toLowerCase().includes(query) ||
          model.application_scenarios.some(scenario => scenario.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (categoryFilter !== 'All Categories') {
      result = result.filter(model => model.category.toLowerCase() === categoryFilter.toLowerCase());
    }

    // Apply complexity filter
    if (complexityFilter !== 'All Levels') {
      const complexityMap: Record<string, number[]> = {
        'Beginner': [1, 2, 3],
        'Intermediate': [4, 5, 6, 7],
        'Advanced': [8, 9, 10]
      };
      
      const complexityRange = complexityMap[complexityFilter];
      if (complexityRange) {
        result = result.filter(model => complexityRange.includes(model.complexity_score));
      }
    }

    setFilteredModels(result);
  }, [models, searchQuery, categoryFilter, complexityFilter]);

  const getFallbackModels = (): MentalModel[] => {
    return [
      {
        id: 'first_principles',
        name: 'First Principles',
        category: 'analytical',
        complexity_score: 7,
        application_scenarios: ['problem decomposition', 'innovation', 'strategic planning'],
        prompt_template: 'Analyze {problem} by breaking it down to its fundamental truths and reasoning up from there.',
        performance_metrics: {
          accuracy: 85,
          usage_count: 1243,
          success_rate: 78,
          relevance_score: 82
        },
        description: 'A method of thinking that involves breaking down complex problems into basic elements and then reassembling them from the ground up.',
        limitations: ['Time-consuming', 'Requires deep domain knowledge', 'May miss emergent properties']
      },
      {
        id: 'nash_equilibrium',
        name: 'Nash Equilibrium',
        category: 'strategic',
        complexity_score: 8,
        application_scenarios: ['conflict resolution', 'negotiation', 'competitive strategy'],
        prompt_template: 'Identify the key actors in {problem}, their possible strategies, and payoffs.',
        performance_metrics: {
          accuracy: 79,
          usage_count: 876,
          success_rate: 72,
          relevance_score: 85
        },
        description: 'A concept in game theory where the optimal outcome occurs when there is no incentive for players to deviate from their initial strategy.',
        limitations: ['Assumes rational actors', 'Multiple equilibria may exist', 'Difficult to calculate in complex scenarios']
      },
      {
        id: 'systems_thinking',
        name: 'Systems Thinking',
        category: 'systems',
        complexity_score: 9,
        application_scenarios: ['complex problem solving', 'organizational design', 'policy development'],
        prompt_template: 'Analyze {problem} as an interconnected system. Map the key components, relationships, and feedback loops.',
        performance_metrics: {
          accuracy: 82,
          usage_count: 1056,
          success_rate: 75,
          relevance_score: 88
        },
        description: 'An approach to understanding how different components within a system influence one another within a complete entity.',
        limitations: ['Can become overwhelmingly complex', 'Difficult to quantify relationships', 'May lack predictive precision']
      },
      {
        id: 'opportunity_cost',
        name: 'Opportunity Cost',
        category: 'analytical',
        complexity_score: 5,
        application_scenarios: ['resource allocation', 'decision making', 'investment analysis'],
        prompt_template: 'For {problem}, identify all available options and what must be given up to obtain a particular choice.',
        performance_metrics: {
          accuracy: 88,
          usage_count: 1532,
          success_rate: 82,
          relevance_score: 79
        },
        description: 'The loss of potential gain from other alternatives when one alternative is chosen.',
        limitations: ['Difficult to quantify intangible costs', 'Future value uncertainty', 'Psychological biases in assessment']
      },
      {
        id: 'second_order_thinking',
        name: 'Second-Order Thinking',
        category: 'cognitive',
        complexity_score: 6,
        application_scenarios: ['strategic planning', 'risk assessment', 'policy analysis'],
        prompt_template: 'For {problem}, go beyond immediate consequences and consider the effects of those effects.',
        performance_metrics: {
          accuracy: 81,
          usage_count: 1124,
          success_rate: 76,
          relevance_score: 84
        },
        description: 'Considering not just the immediate results of actions but the subsequent effects of those results.',
        limitations: ['Cognitive complexity', 'Diminishing accuracy with time horizon', 'Analysis paralysis risk']
      }
    ];
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      cognitive: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      strategic: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      analytical: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      creative: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      systems: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    };
    return colors[category.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  };

  const getComplexityColor = (score: number) => {
    if (score <= 3) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    if (score <= 7) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
  };

  const getComplexityLabel = (score: number) => {
    if (score <= 3) return 'Beginner';
    if (score <= 7) return 'Intermediate';
    return 'Advanced';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cognitive':
        return <LightBulbIcon className="h-5 w-5" />;
      case 'strategic':
        return <ChartBarIcon className="h-5 w-5" />;
      case 'analytical':
        return <AcademicCapIcon className="h-5 w-5" />;
      case 'creative':
        return <PuzzlePieceIcon className="h-5 w-5" />;
      case 'systems':
        return <ArrowPathIcon className="h-5 w-5" />;
      default:
        return <BookOpenIcon className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mental Model Library</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Explore our curated collection of mental models for complex problem-solving.
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="card"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="sr-only">Search models</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="search"
                name="search"
                className="form-input pl-10"
                placeholder="Search models..."
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="category" className="sr-only">Category</label>
            <select
              id="category"
              name="category"
              className="form-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option>All Categories</option>
              <option>Cognitive</option>
              <option>Strategic</option>
              <option>Analytical</option>
              <option>Creative</option>
              <option>Systems</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="complexity" className="sr-only">Complexity</label>
            <select
              id="complexity"
              name="complexity"
              className="form-select"
              value={complexityFilter}
              onChange={(e) => setComplexityFilter(e.target.value)}
            >
              <option>All Levels</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Model List */}
      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card text-center py-12"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading mental models...</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mental-models-grid">
          {filteredModels.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <BookOpenIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No mental models found matching your criteria.</p>
            </div>
          ) : (
            filteredModels.map((model, index) => (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="card card-hover"
                onClick={() => setSelectedModel(model)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg ${getCategoryColor(model.category)}`}>
                      {getCategoryIcon(model.category)}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white ml-3">{model.name}</h3>
                  </div>
                  <div className="flex space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(model.category)}`}>
                      {model.category}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getComplexityColor(model.complexity_score)}`}>
                      {getComplexityLabel(model.complexity_score)}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">{model.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {model.application_scenarios.slice(0, 3).map((scenario, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                      {scenario}
                    </span>
                  ))}
                  {model.application_scenarios.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                      +{model.application_scenarios.length - 3} more
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Accuracy:</span>
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div 
                        className="bg-blue-600 h-1.5 rounded-full" 
                        style={{ width: `${model.performance_metrics.accuracy}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                      {model.performance_metrics.accuracy}%
                    </span>
                  </div>
                  
                  <span className="text-blue-600 dark:text-blue-400 text-sm flex items-center">
                    View details
                    <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Model Detail Modal */}
      {selectedModel && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setSelectedModel(null)}></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6"
            >
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="bg-white dark:bg-gray-800 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => setSelectedModel(null)}
                >
                  <span className="sr-only">Close</span>
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg ${getCategoryColor(selectedModel.category)}`}>
                        {getCategoryIcon(selectedModel.category)}
                      </div>
                      <h3 className="text-2xl leading-6 font-bold text-gray-900 dark:text-white ml-3" id="modal-title">
                        {selectedModel.name}
                      </h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(selectedModel.category)}`}>
                        {selectedModel.category}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getComplexityColor(selectedModel.complexity_score)}`}>
                        {getComplexityLabel(selectedModel.complexity_score)} ({selectedModel.complexity_score}/10)
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-6">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">Description</h4>
                      <p className="mt-2 text-gray-600 dark:text-gray-300">{selectedModel.description}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">Application Scenarios</h4>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedModel.application_scenarios.map((scenario, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm">
                            {scenario}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">Limitations</h4>
                      <ul className="mt-2 list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-1">
                        {selectedModel.limitations.map((limitation, index) => (
                          <li key={index}>{limitation}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">Performance Metrics</h4>
                      <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="border dark:border-gray-700 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{selectedModel.performance_metrics.accuracy}%</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy</div>
                        </div>
                        <div className="border dark:border-gray-700 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{selectedModel.performance_metrics.success_rate}%</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
                        </div>
                        <div className="border dark:border-gray-700 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{selectedModel.performance_metrics.relevance_score}%</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Relevance</div>
                        </div>
                        <div className="border dark:border-gray-700 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{selectedModel.performance_metrics.usage_count.toLocaleString()}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Usage Count</div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">How It Works</h4>
                      <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border dark:border-gray-700 text-gray-700 dark:text-gray-300">
                        <p className="font-mono text-sm whitespace-pre-wrap">
                          {selectedModel.prompt_template}
                        </p>
                      </div>
                    </div>
                    
                    {selectedModel.case_study && (
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">Case Study</h4>
                        <div className="mt-2 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800/30 text-gray-700 dark:text-gray-300">
                          <p>{selectedModel.case_study}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setSelectedModel(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Apply to Problem
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentalModelLibrary;