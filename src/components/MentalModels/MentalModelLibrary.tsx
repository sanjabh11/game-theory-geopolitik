import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../services/supabase';

interface MentalModel {
  id: string;
  name: string;
  category: 'cognitive' | 'strategic' | 'analytical' | 'creative' | 'systems';
  complexity_score: number;
  description: string;
  application_scenarios: string[];
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

        const { data, error } = await supabase
          .from('mental_models')
          .select('*')
          .order('name');

        if (error) {
          throw new Error(error.message);
        }

        // If no data from database, use fallback data
        if (!data || data.length === 0) {
          const fallbackModels = getFallbackModels();
          setModels(fallbackModels);
          setFilteredModels(fallbackModels);
        } else {
          setModels(data);
          setFilteredModels(data);
        }
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
        description: 'A method of thinking that involves breaking down complex problems into basic elements and then reassembling them from the ground up.',
        application_scenarios: ['problem decomposition', 'innovation', 'strategic planning'],
        limitations: ['Time-consuming', 'Requires deep domain knowledge', 'May miss emergent properties']
      },
      {
        id: 'nash_equilibrium',
        name: 'Nash Equilibrium',
        category: 'strategic',
        complexity_score: 8,
        description: 'A concept in game theory where the optimal outcome occurs when there is no incentive for players to deviate from their initial strategy.',
        application_scenarios: ['conflict resolution', 'negotiation', 'competitive strategy'],
        limitations: ['Assumes rational actors', 'Multiple equilibria may exist', 'Difficult to calculate in complex scenarios']
      },
      {
        id: 'systems_thinking',
        name: 'Systems Thinking',
        category: 'systems',
        complexity_score: 9,
        description: 'An approach to understanding how different components within a system influence one another within a complete entity.',
        application_scenarios: ['complex problem solving', 'organizational design', 'policy development'],
        limitations: ['Can become overwhelmingly complex', 'Difficult to quantify relationships', 'May lack predictive precision']
      },
      {
        id: 'opportunity_cost',
        name: 'Opportunity Cost',
        category: 'analytical',
        complexity_score: 5,
        description: 'The loss of potential gain from other alternatives when one alternative is chosen.',
        application_scenarios: ['resource allocation', 'decision making', 'investment analysis'],
        limitations: ['Difficult to quantify intangible costs', 'Future value uncertainty', 'Psychological biases in assessment']
      },
      {
        id: 'second_order_thinking',
        name: 'Second-Order Thinking',
        category: 'cognitive',
        complexity_score: 6,
        description: 'Considering not just the immediate results of actions but the subsequent effects of those results.',
        application_scenarios: ['strategic planning', 'risk assessment', 'policy analysis'],
        limitations: ['Cognitive complexity', 'Diminishing accuracy with time horizon', 'Analysis paralysis risk']
      }
    ];
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      cognitive: 'bg-blue-100 text-blue-800',
      strategic: 'bg-purple-100 text-purple-800',
      analytical: 'bg-green-100 text-green-800',
      creative: 'bg-yellow-100 text-yellow-800',
      systems: 'bg-red-100 text-red-800'
    };
    return colors[category.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const getComplexityColor = (score: number) => {
    if (score <= 3) return 'bg-green-100 text-green-800';
    if (score <= 7) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getComplexityLabel = (score: number) => {
    if (score <= 3) return 'Beginner';
    if (score <= 7) return 'Intermediate';
    return 'Advanced';
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Mental Model Library</h1>
        <p className="mt-2 text-gray-600">
          Explore our curated collection of 40+ mental models for complex problem-solving.
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="sr-only">Search models</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                id="search"
                name="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
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
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
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
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center"
        >
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading mental models...</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModels.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No mental models found matching your criteria.</p>
            </div>
          ) : (
            filteredModels.map((model, index) => (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedModel(model)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{model.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(model.category)}`}>
                    {model.category}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-3">{model.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">Complexity:</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getComplexityColor(model.complexity_score)}`}>
                      {getComplexityLabel(model.complexity_score)} ({model.complexity_score}/10)
                    </span>
                  </div>
                  
                  <span className="text-blue-600 text-sm">View details →</span>
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
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setSelectedModel(null)}></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6"
            >
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => setSelectedModel(null)}
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl leading-6 font-bold text-gray-900" id="modal-title">
                      {selectedModel.name}
                    </h3>
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
                      <h4 className="text-lg font-medium text-gray-900">Description</h4>
                      <p className="mt-2 text-gray-600">{selectedModel.description}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">Application Scenarios</h4>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedModel.application_scenarios.map((scenario, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {scenario}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">Limitations</h4>
                      <ul className="mt-2 list-disc pl-5 text-gray-600 space-y-1">
                        {selectedModel.limitations.map((limitation, index) => (
                          <li key={index}>{limitation}</li>
                        ))}
                      </ul>
                    </div>
                    
                    {selectedModel.case_study && (
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">Case Study</h4>
                        <div className="mt-2 p-4 bg-gray-50 rounded-lg text-gray-700">
                          {selectedModel.case_study}
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
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
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