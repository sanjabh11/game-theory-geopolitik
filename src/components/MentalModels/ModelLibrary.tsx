import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon, 
  AdjustmentsHorizontalIcon,
  BookOpenIcon,
  ChartBarIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { mentalModelApi } from '../../services/mentalModelApi';

interface MentalModel {
  id: string;
  name: string;
  category: string;
  complexity_score: number;
  description: string;
  application_scenarios: string[];
  performance_metrics: {
    accuracy: number;
    usage_count: number;
    success_rate: number;
    relevance_score: number;
  };
  limitations: string[];
  case_study?: string;
}

const ModelLibrary: React.FC = () => {
  const [models, setModels] = useState<MentalModel[]>([]);
  const [filteredModels, setFilteredModels] = useState<MentalModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [complexityFilter, setComplexityFilter] = useState('all');
  const [selectedModel, setSelectedModel] = useState<MentalModel | null>(null);
  const [isDetailView, setIsDetailView] = useState(false);

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'cognitive', name: 'Cognitive' },
    { id: 'strategic', name: 'Strategic' },
    { id: 'analytical', name: 'Analytical' },
    { id: 'creative', name: 'Creative' },
    { id: 'systems', name: 'Systems' }
  ];

  const complexityLevels = [
    { id: 'all', name: 'All Levels' },
    { id: 'beginner', name: 'Beginner (1-3)' },
    { id: 'intermediate', name: 'Intermediate (4-7)' },
    { id: 'advanced', name: 'Advanced (8-10)' }
  ];

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        const response = await mentalModelApi.getModels();
        
        if (response.success && response.data) {
          setModels(response.data);
          setFilteredModels(response.data);
        } else {
          throw new Error(response.error || 'Failed to fetch mental models');
        }
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
    
    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(model => 
        model.name.toLowerCase().includes(term) || 
        model.description.toLowerCase().includes(term) ||
        model.application_scenarios.some(scenario => scenario.toLowerCase().includes(term))
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
          result = result.filter(model => model.complexity_score >= 1 && model.complexity_score <= 3);
          break;
        case 'intermediate':
          result = result.filter(model => model.complexity_score >= 4 && model.complexity_score <= 7);
          break;
        case 'advanced':
          result = result.filter(model => model.complexity_score >= 8 && model.complexity_score <= 10);
          break;
      }
    }
    
    setFilteredModels(result);
  }, [models, searchTerm, categoryFilter, complexityFilter]);

  const handleModelClick = (model: MentalModel) => {
    setSelectedModel(model);
    setIsDetailView(true);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'cognitive': return 'bg-purple-100 text-purple-800';
      case 'strategic': return 'bg-blue-100 text-blue-800';
      case 'analytical': return 'bg-green-100 text-green-800';
      case 'creative': return 'bg-yellow-100 text-yellow-800';
      case 'systems': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplexityColor = (score: number) => {
    if (score <= 3) return 'bg-green-100 text-green-800';
    if (score <= 7) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mental Model Library</h1>
        <p className="text-gray-600">
          Explore our curated collection of 40+ mental models for complex problem-solving.
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search models..."
            />
          </div>
          
          <div className="flex-1 flex gap-4">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            
            <select
              value={complexityFilter}
              onChange={(e) => setComplexityFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {complexityLevels.map((level) => (
                <option key={level.id} value={level.id}>{level.name}</option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Model Grid or Detail View */}
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
      ) : isDetailView && selectedModel ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{selectedModel.name}</h2>
            <button
              onClick={() => setIsDetailView(false)}
              className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              <ArrowsPointingInIcon className="h-5 w-5 mr-1" />
              Back to Library
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-3 py-1 rounded-full text-sm ${getCategoryColor(selectedModel.category)}`}>
                    {selectedModel.category}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm ${getComplexityColor(selectedModel.complexity_score)}`}>
                    Complexity: {selectedModel.complexity_score}/10
                  </span>
                </div>
                
                <p className="text-gray-700">{selectedModel.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Application Scenarios</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedModel.application_scenarios.map((scenario, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                      {scenario}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Limitations</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {selectedModel.limitations.map((limitation, index) => (
                    <li key={index}>{limitation}</li>
                  ))}
                </ul>
              </div>

              {selectedModel.case_study && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Case Study</h3>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-700">{selectedModel.case_study}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-5 border border-blue-100">
                <h3 className="text-lg font-medium text-blue-900 mb-4">Performance Metrics</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-blue-800">Accuracy</span>
                      <span className="font-medium text-blue-900">{selectedModel.performance_metrics.accuracy}%</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${selectedModel.performance_metrics.accuracy}%` }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-blue-800">Success Rate</span>
                      <span className="font-medium text-blue-900">{selectedModel.performance_metrics.success_rate}%</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${selectedModel.performance_metrics.success_rate}%` }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-blue-800">Relevance Score</span>
                      <span className="font-medium text-blue-900">{selectedModel.performance_metrics.relevance_score}%</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${selectedModel.performance_metrics.relevance_score}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-blue-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-800">Usage Count</span>
                      <span className="font-medium text-blue-900">{selectedModel.performance_metrics.usage_count.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Best Used For</h3>
                <ul className="space-y-2">
                  {selectedModel.application_scenarios.map((scenario, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{scenario}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Not Recommended For</h3>
                <ul className="space-y-2">
                  {selectedModel.limitations.map((limitation, index) => (
                    <li key={index} className="flex items-start">
                      <XCircleIcon className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{limitation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <div>
          {filteredModels.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center"
            >
              <BookOpenIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No mental models found matching your filters.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('all');
                  setComplexityFilter('all');
                }}
                className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Clear Filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredModels.map((model, index) => (
                <motion.div
                  key={model.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 * index }}
                  className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleModelClick(model)}
                >
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">{model.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(model.category)}`}>
                        {model.category}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">{model.description}</p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Complexity:</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getComplexityColor(model.complexity_score)}`}>
                        {model.complexity_score}/10
                      </span>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center">
                        <ChartBarIcon className="h-4 w-4 text-blue-500 mr-1" />
                        <span className="text-xs text-gray-500">{model.performance_metrics.success_rate}% success</span>
                      </div>
                      <div className="flex items-center text-blue-600 hover:text-blue-800">
                        <span className="text-xs font-medium">Details</span>
                        <ArrowsPointingOutIcon className="ml-1 h-3 w-3" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default ModelLibrary;