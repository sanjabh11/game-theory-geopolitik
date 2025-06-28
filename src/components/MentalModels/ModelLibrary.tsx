import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon, 
  BookOpenIcon,
  ChevronDownIcon,
  AcademicCapIcon,
  LightBulbIcon,
  ArrowPathIcon,
  ChartBarIcon,
  PuzzlePieceIcon
} from '@heroicons/react/24/outline';
import { mentalModelApi } from '../../services/mentalModelApi';

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

const ModelLibrary: React.FC = () => {
  const [models, setModels] = useState<MentalModel[]>([]);
  const [filteredModels, setFilteredModels] = useState<MentalModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<MentalModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [complexityFilter, setComplexityFilter] = useState<string>('all');
  
  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await mentalModelApi.getAllModels();
        
        if (!response.success || !response.data) {
          throw new Error(response.error || 'Failed to fetch mental models');
        }
        
        setModels(response.data);
        setFilteredModels(response.data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchModels();
  }, []);
  
  useEffect(() => {
    // Apply filters
    let result = [...models];
    
    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(model => 
        model.name.toLowerCase().includes(query) || 
        model.description.toLowerCase().includes(query) ||
        model.application_scenarios.some(scenario => scenario.toLowerCase().includes(query))
      );
    }
    
    // Category filter
    if (categoryFilter !== 'all') {
      result = result.filter(model => model.category === categoryFilter);
    }
    
    // Complexity filter
    if (complexityFilter !== 'all') {
      switch (complexityFilter) {
        case 'beginner':
          result = result.filter(model => model.complexity_score <= 4);
          break;
        case 'intermediate':
          result = result.filter(model => model.complexity_score > 4 && model.complexity_score <= 7);
          break;
        case 'advanced':
          result = result.filter(model => model.complexity_score > 7);
          break;
      }
    }
    
    setFilteredModels(result);
  }, [models, searchQuery, categoryFilter, complexityFilter]);
  
  const handleModelSelect = (model: MentalModel) => {
    setSelectedModel(model);
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
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'cognitive':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'strategic':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'analytical':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'creative':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'systems':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const getComplexityColor = (score: number) => {
    if (score >= 8) return 'bg-red-100 text-red-800 border-red-200';
    if (score >= 5) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };
  
  const getComplexityLabel = (score: number) => {
    if (score >= 8) return 'Advanced';
    if (score >= 5) return 'Intermediate';
    return 'Beginner';
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
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search models..."
            />
          </div>
          
          <div className="w-full md:w-48">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="cognitive">Cognitive</option>
              <option value="strategic">Strategic</option>
              <option value="analytical">Analytical</option>
              <option value="creative">Creative</option>
              <option value="systems">Systems</option>
            </select>
          </div>
          
          <div className="w-full md:w-48">
            <select
              value={complexityFilter}
              onChange={(e) => setComplexityFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner (1-4)</option>
              <option value="intermediate">Intermediate (5-7)</option>
              <option value="advanced">Advanced (8-10)</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Loading State */}
      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Model List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-h-[800px] overflow-y-auto"
          >
            <h2 className="text-xl font-semibold mb-4">Models ({filteredModels.length})</h2>
            
            {filteredModels.length === 0 ? (
              <div className="text-center py-8">
                <BookOpenIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No models match your filters</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredModels.map((model) => (
                  <motion.div
                    key={model.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedModel?.id === model.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'hover:border-gray-300'
                    }`}
                    onClick={() => handleModelSelect(model)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{model.name}</h3>
                      <div className="flex space-x-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${getCategoryColor(model.category)}`}>
                          {model.category}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${getComplexityColor(model.complexity_score)}`}>
                          {getComplexityLabel(model.complexity_score)}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{model.description}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Model Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            {selectedModel ? (
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className={`p-2 rounded-lg ${getCategoryColor(selectedModel.category)}`}>
                    {getCategoryIcon(selectedModel.category)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">{selectedModel.name}</h2>
                    <div className="flex space-x-2 mt-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${getCategoryColor(selectedModel.category)}`}>
                        {selectedModel.category}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${getComplexityColor(selectedModel.complexity_score)}`}>
                        Complexity: {selectedModel.complexity_score}/10
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-700">{selectedModel.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Application Scenarios</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedModel.application_scenarios.map((scenario, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {scenario}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Limitations</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {selectedModel.limitations.map((limitation, index) => (
                          <li key={index} className="text-gray-700">{limitation}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Performance Metrics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="border rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-blue-600">{selectedModel.performance_metrics.accuracy}%</div>
                        <div className="text-sm text-gray-600">Accuracy</div>
                      </div>
                      <div className="border rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-green-600">{selectedModel.performance_metrics.success_rate}%</div>
                        <div className="text-sm text-gray-600">Success Rate</div>
                      </div>
                      <div className="border rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-purple-600">{selectedModel.performance_metrics.relevance_score}%</div>
                        <div className="text-sm text-gray-600">Relevance</div>
                      </div>
                      <div className="border rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-orange-600">{selectedModel.performance_metrics.usage_count.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">Usage Count</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">How It Works</h3>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-gray-700 font-mono text-sm whitespace-pre-wrap">
                        {selectedModel.prompt_template}
                      </p>
                    </div>
                  </div>
                  
                  {selectedModel.case_study && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Case Study</h3>
                      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <p className="text-gray-700">{selectedModel.case_study}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-96">
                <BookOpenIcon className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">Select a mental model to view details</h3>
                <p className="text-gray-500 text-center max-w-md">
                  Browse the library on the left to explore different mental models and their applications.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ModelLibrary;