import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  BookOpenIcon,
  ChartBarIcon,
  LightBulbIcon,
  CogIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { mentalModelApi } from '../../services/mentalModelApi';
import { MentalModel, ModelExplanationRequest } from '../../types/mentalModels';

const ModelLibrary: React.FC = () => {
  const [models, setModels] = useState<MentalModel[]>([]);
  const [filteredModels, setFilteredModels] = useState<MentalModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedComplexity, setSelectedComplexity] = useState<string>('all');
  const [selectedModel, setSelectedModel] = useState<MentalModel | null>(null);
  const [modelExplanation, setModelExplanation] = useState<any>(null);

  const categories = [
    { value: 'all', label: 'All Categories', icon: BookOpenIcon },
    { value: 'cognitive', label: 'Cognitive', icon: LightBulbIcon },
    { value: 'strategic', label: 'Strategic', icon: ChartBarIcon },
    { value: 'analytical', label: 'Analytical', icon: CogIcon },
    { value: 'creative', label: 'Creative', icon: UserGroupIcon },
    { value: 'systems', label: 'Systems', icon: FunnelIcon }
  ];

  const complexityLevels = [
    { value: 'all', label: 'All Levels' },
    { value: 'low', label: 'Beginner (1-3)' },
    { value: 'medium', label: 'Intermediate (4-7)' },
    { value: 'high', label: 'Advanced (8-10)' }
  ];

  useEffect(() => {
    loadModels();
  }, []);

  useEffect(() => {
    filterModels();
  }, [models, searchTerm, selectedCategory, selectedComplexity]);

  const loadModels = async () => {
    try {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Use mock data for demonstration
      const mockModels = getMockModels();
      setModels(mockModels);
      setFilteredModels(mockModels);
    } catch (error) {
      console.error('Failed to load models:', error);
      // Load mock data as fallback
      setModels(getMockModels());
      setFilteredModels(getMockModels());
    } finally {
      setLoading(false);
    }
  };

  const filterModels = () => {
    let filtered = models;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(model =>
        model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.application_scenarios.some(scenario =>
          scenario.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(model => model.category === selectedCategory);
    }

    // Filter by complexity
    if (selectedComplexity !== 'all') {
      const complexityRanges = {
        low: [1, 3],
        medium: [4, 7],
        high: [8, 10]
      };
      const [min, max] = complexityRanges[selectedComplexity as keyof typeof complexityRanges];
      filtered = filtered.filter(model => 
        model.complexity_score >= min && model.complexity_score <= max
      );
    }

    setFilteredModels(filtered);
  };

  const handleModelSelect = async (model: MentalModel) => {
    setSelectedModel(model);
    
    try {
      // Simulate API call for model explanation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setModelExplanation({
        abstract: model.description,
        case_study: model.case_study || 'Case study not available',
        limitations: model.limitations || [],
        when_to_use: model.application_scenarios,
        related_models: getRelatedModels(model.category)
      });
    } catch (error) {
      console.error('Failed to get model explanation:', error);
    }
  };

  const getRelatedModels = (category: string): string[] => {
    // Return mock related models based on category
    const relatedModelsMap: Record<string, string[]> = {
      'cognitive': ['Mental Models', 'Cognitive Biases', 'Decision Trees'],
      'strategic': ['Game Theory', 'Porter\'s Five Forces', 'SWOT Analysis'],
      'analytical': ['First Principles', 'Occam\'s Razor', 'Regression Analysis'],
      'creative': ['Design Thinking', 'Lateral Thinking', 'SCAMPER'],
      'systems': ['Systems Thinking', 'Feedback Loops', 'Network Theory']
    };
    
    return relatedModelsMap[category] || ['No related models found'];
  };

  const getComplexityColor = (score: number) => {
    if (score <= 3) return 'bg-green-100 text-green-800';
    if (score <= 7) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getCategoryIcon = (category: string) => {
    const categoryMap = {
      cognitive: LightBulbIcon,
      strategic: ChartBarIcon,
      analytical: CogIcon,
      creative: UserGroupIcon,
      systems: FunnelIcon
    };
    return categoryMap[category as keyof typeof categoryMap] || BookOpenIcon;
  };

  const getMockModels = (): MentalModel[] => [
    {
      id: 'first_principles',
      name: 'First Principles Thinking',
      category: 'analytical',
      complexity_score: 7,
      application_scenarios: ['Problem solving', 'Innovation', 'Decision making'],
      prompt_template: 'Break down {problem} into fundamental components...',
      performance_metrics: {
        accuracy: 85,
        relevance_score: 90,
        usage_count: 150,
        success_rate: 78
      },
      description: 'A reasoning method that breaks down complex problems into basic elements and builds up from there.',
      limitations: ['Time-intensive', 'May overlook practical constraints'],
      case_study: 'Elon Musk used first principles to revolutionize rocket design by questioning fundamental assumptions about cost.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'systems_thinking',
      name: 'Systems Thinking',
      category: 'systems',
      complexity_score: 9,
      application_scenarios: ['Complex problems', 'Organizational change', 'Strategy'],
      prompt_template: 'Analyze {problem} as interconnected systems...',
      performance_metrics: {
        accuracy: 82,
        relevance_score: 88,
        usage_count: 120,
        success_rate: 75
      },
      description: 'A holistic approach that views problems as part of larger interconnected systems.',
      limitations: ['Can be overwhelming', 'Requires broad perspective'],
      case_study: 'Toyota Production System uses systems thinking to optimize manufacturing processes.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'nash_equilibrium',
      name: 'Nash Equilibrium',
      category: 'strategic',
      complexity_score: 8,
      application_scenarios: ['Conflict resolution', 'Negotiation', 'Competitive strategy'],
      prompt_template: 'Identify equilibrium states where no actor can unilaterally improve...',
      performance_metrics: {
        accuracy: 78,
        relevance_score: 85,
        usage_count: 90,
        success_rate: 72
      },
      description: 'A concept in game theory where the optimal outcome occurs when there is no incentive for players to deviate from their initial strategy.',
      limitations: ['Assumes rational actors', 'Multiple equilibria may exist'],
      case_study: 'Used to analyze international trade negotiations and tariff strategies.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'second_order_thinking',
      name: 'Second-Order Thinking',
      category: 'cognitive',
      complexity_score: 6,
      application_scenarios: ['Strategic planning', 'Risk assessment', 'Policy analysis'],
      prompt_template: 'Consider the effects of effects for {problem}...',
      performance_metrics: {
        accuracy: 80,
        relevance_score: 85,
        usage_count: 200,
        success_rate: 82
      },
      description: 'Considering not just the immediate results of actions but the subsequent effects of those results.',
      limitations: ['Cognitive complexity', 'Diminishing accuracy with time horizon'],
      case_study: 'Warren Buffett uses second-order thinking to evaluate long-term investment decisions.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'opportunity_cost',
      name: 'Opportunity Cost',
      category: 'analytical',
      complexity_score: 5,
      application_scenarios: ['Resource allocation', 'Decision making', 'Investment analysis'],
      prompt_template: 'Calculate what must be given up for each alternative...',
      performance_metrics: {
        accuracy: 88,
        relevance_score: 82,
        usage_count: 180,
        success_rate: 85
      },
      description: 'The loss of potential gain from other alternatives when one alternative is chosen.',
      limitations: ['Difficult to quantify intangible costs', 'Future value uncertainty'],
      case_study: 'Used in capital budgeting decisions to evaluate project investments.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
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

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search models..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>

          {/* Complexity Filter */}
          <select
            value={selectedComplexity}
            onChange={(e) => setSelectedComplexity(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {complexityLevels.map(level => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Model List */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading mental models...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredModels.map((model, index) => {
                const CategoryIcon = getCategoryIcon(model.category);
                return (
                  <motion.div
                    key={model.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer transition-all hover:shadow-md ${
                      selectedModel?.id === model.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => handleModelSelect(model)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <CategoryIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{model.name}</h3>
                          <p className="text-sm text-gray-500 capitalize">{model.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${getComplexityColor(model.complexity_score)}`}>
                          Level {model.complexity_score}
                        </span>
                        <div className="text-sm text-gray-500">
                          {model.performance_metrics.success_rate}% success
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4">{model.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {model.application_scenarios.slice(0, 3).map((scenario, scenarioIndex) => (
                        <span
                          key={scenarioIndex}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                        >
                          {scenario}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Used {model.performance_metrics.usage_count} times</span>
                      <span>Accuracy: {model.performance_metrics.accuracy}%</span>
                    </div>
                  </motion.div>
                );
              })}

              {filteredModels.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                  <BookOpenIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No models found matching your criteria.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Model Details */}
        <div className="lg:col-span-1">
          {selectedModel ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8"
            >
              <h2 className="text-xl font-semibold mb-4">{selectedModel.name}</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-sm text-gray-700">{selectedModel.description}</p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Case Study</h3>
                  <p className="text-sm text-gray-700">{selectedModel.case_study || 'No case study available'}</p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Best Used For</h3>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {selectedModel.application_scenarios.map((scenario, index) => (
                      <li key={index}>{scenario}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Limitations</h3>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {selectedModel.limitations && selectedModel.limitations.length > 0 ? (
                      selectedModel.limitations.map((limitation, index) => (
                        <li key={index}>{limitation}</li>
                      ))
                    ) : (
                      <li>No specific limitations documented</li>
                    )}
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Performance Metrics</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Accuracy:</span>
                      <div className="font-medium">{selectedModel.performance_metrics.accuracy}%</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Relevance:</span>
                      <div className="font-medium">{selectedModel.performance_metrics.relevance_score}%</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Usage:</span>
                      <div className="font-medium">{selectedModel.performance_metrics.usage_count}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Success:</span>
                      <div className="font-medium">{selectedModel.performance_metrics.success_rate}%</div>
                    </div>
                  </div>
                </div>

                <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Use This Model
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <BookOpenIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Select a mental model to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModelLibrary;