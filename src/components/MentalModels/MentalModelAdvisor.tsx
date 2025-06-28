import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LightBulbIcon,
  CpuChipIcon,
  DocumentTextIcon,
  ChartBarIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { mentalModelApi } from '../../services/mentalModelApi';
import {
  MentalModel,
  ProblemSubmission,
  Solution,
  ModelSelection,
  SubmitProblemRequest,
  GenerateSolutionRequest
} from '../../types/mentalModels';
import toast from 'react-hot-toast';

const MentalModelAdvisor: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'input' | 'analysis' | 'solutions' | 'results'>('input');
  const [problemText, setProblemText] = useState('');
  const [domain, setDomain] = useState('');
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [stakeholders, setStakeholders] = useState<string[]>([]);
  const [userLevel, setUserLevel] = useState<'novice' | 'intermediate' | 'expert'>('intermediate');
  
  const [loading, setLoading] = useState(false);
  const [currentProblem, setCurrentProblem] = useState<ProblemSubmission | null>(null);
  const [suggestedModels, setSuggestedModels] = useState<ModelSelection[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [availableModels, setAvailableModels] = useState<MentalModel[]>([]);

  const domains = [
    'Business Strategy', 'Technology', 'Healthcare', 'Education', 'Finance',
    'Marketing', 'Operations', 'Human Resources', 'Product Development', 'General'
  ];

  useEffect(() => {
    loadAvailableModels();
  }, []);

  const loadAvailableModels = async () => {
    try {
      const response = await mentalModelApi.getMentalModels();
      if (response.success && response.data) {
        setAvailableModels(response.data);
      } else {
        // Use mock data if API fails
        setAvailableModels(getMockModels());
      }
    } catch (error) {
      console.error('Failed to load models:', error);
      // Load mock data for demonstration
      setAvailableModels(getMockModels());
    }
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
    }
  ];

  const handleSubmitProblem = async () => {
    if (!problemText.trim()) {
      toast.error('Please describe your problem');
      return;
    }

    setLoading(true);
    setCurrentStep('analysis');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create mock problem submission
      const mockProblem: ProblemSubmission = {
        id: `problem_${Date.now()}`,
        problem_text: problemText,
        domain: domain || 'General',
        urgency,
        stakeholders,
        context: { user_level: userLevel },
        structured_data: {
          core_issue: 'Extracted core issue from problem text',
          complexity_level: userLevel === 'novice' ? 3 : userLevel === 'intermediate' ? 5 : 8,
          problem_type: domain || 'General',
          constraints: ['Time', 'Resources', 'Technical feasibility']
        },
        created_at: new Date().toISOString()
      };
      
      // Create mock model selections
      const mockSelections: ModelSelection[] = [
        {
          model_id: 'first_principles',
          score: 8.5,
          rationale: 'Breaks down complex problems into fundamental components',
          contextual_fitness: 9,
          historical_success: 8,
          novelty_factor: 8
        },
        {
          model_id: 'systems_thinking',
          score: 8.0,
          rationale: 'Considers interconnections and feedback loops',
          contextual_fitness: 8,
          historical_success: 8,
          novelty_factor: 8
        },
        {
          model_id: 'second_order_thinking',
          score: 7.5,
          rationale: 'Evaluates cascading effects and unintended consequences',
          contextual_fitness: 7,
          historical_success: 8,
          novelty_factor: 8
        }
      ];
      
      setCurrentProblem(mockProblem);
      setSuggestedModels(mockSelections);
      setSelectedModels(mockSelections.slice(0, 3).map(m => m.model_id));
      setCurrentStep('solutions');
      toast.success('Problem analyzed successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to analyze problem');
      setCurrentStep('input');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSolutions = async () => {
    if (!currentProblem || selectedModels.length === 0) {
      toast.error('Please select at least one mental model');
      return;
    }

    setLoading(true);
    setCurrentStep('results');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Create mock solutions
      const mockSolutions: Solution[] = selectedModels.map(modelId => {
        const model = availableModels.find(m => m.id === modelId) || {
          id: modelId,
          name: modelId.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          category: 'analytical',
          complexity_score: 5,
          application_scenarios: [],
          prompt_template: '',
          performance_metrics: { accuracy: 0, relevance_score: 0, usage_count: 0, success_rate: 0 },
          description: '',
          limitations: [],
          created_at: '',
          updated_at: ''
        };
        
        return {
          id: `sol_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          problem_id: currentProblem.id,
          model_id: model.id,
          solution_variants: [
            {
              title: `${model.name} Solution Approach`,
              description: `This solution applies ${model.name} to address the core problem by systematically analyzing the key components and relationships.`,
              model_logic: `The ${model.name} framework was applied by breaking down the problem into manageable components and identifying the underlying patterns and relationships.`,
              feasibility_score: 7 + Math.floor(Math.random() * 3),
              innovation_score: 6 + Math.floor(Math.random() * 4),
              implementation_steps: [
                'Analyze problem using model framework',
                'Identify key variables and constraints',
                'Generate solution alternatives',
                'Evaluate and select optimal approach',
                'Develop implementation roadmap'
              ],
              risks: [
                'Implementation complexity may be higher than anticipated',
                'Resource requirements could exceed available capacity',
                'Stakeholder resistance to proposed changes'
              ],
              benefits: [
                'Comprehensive approach addresses root causes',
                'Systematic methodology increases success probability',
                'Solution leverages proven framework with track record'
              ]
            }
          ],
          bias_analysis: {
            risk_score: 25 + Math.floor(Math.random() * 20),
            detected_biases: [
              {
                type: 'confirmation',
                severity: 'low',
                evidence: 'Solution may favor familiar approaches that align with existing beliefs',
                mitigation: 'Consider alternative perspectives and challenge assumptions'
              },
              {
                type: 'anchoring',
                severity: 'medium',
                evidence: 'Initial problem framing may unduly influence solution direction',
                mitigation: 'Reframe problem from multiple perspectives before finalizing approach'
              }
            ],
            confidence_level: 75 + Math.floor(Math.random() * 15)
          },
          stakeholder_views: {
            'Leadership': 'Supportive with concerns about implementation timeline',
            'Technical Team': 'Enthusiastic about approach but concerned about resource requirements',
            'End Users': 'Cautiously optimistic, need clear communication about benefits'
          },
          complexity_level: userLevel,
          export_formats: {
            executive_summary: 'Executive summary not yet generated',
            technical_deep_dive: 'Technical details not yet generated',
            metrics_csv: 'Metrics export not yet generated'
          },
          created_at: new Date().toISOString()
        };
      });
      
      setSolutions(mockSolutions);
      toast.success('Solutions generated successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate solutions');
      setCurrentStep('solutions');
    } finally {
      setLoading(false);
    }
  };

  const handleRateSolution = async (solutionId: string, rating: number) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('Thank you for your feedback!');
    } catch (error) {
      toast.error('Failed to submit rating');
    }
  };

  const addStakeholder = (stakeholder: string) => {
    if (stakeholder.trim() && !stakeholders.includes(stakeholder.trim())) {
      setStakeholders([...stakeholders, stakeholder.trim()]);
    }
  };

  const removeStakeholder = (index: number) => {
    setStakeholders(stakeholders.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setCurrentStep('input');
    setProblemText('');
    setDomain('');
    setUrgency('medium');
    setStakeholders([]);
    setCurrentProblem(null);
    setSuggestedModels([]);
    setSelectedModels([]);
    setSolutions([]);
  };

  const getUrgencyColor = (urgencyLevel: string) => {
    switch (urgencyLevel) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getComplexityColor = (level: string) => {
    switch (level) {
      case 'expert': return 'bg-purple-100 text-purple-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'novice': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center mb-4">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full">
            <LightBulbIcon className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Mental Model Advisor</h1>
        <p className="mt-2 text-gray-600">
          Autonomous decision-making system that selects optimal mental models to solve complex problems.
        </p>
      </motion.div>

      {/* Progress Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between">
          {[
            { key: 'input', label: 'Problem Input', icon: DocumentTextIcon },
            { key: 'analysis', label: 'AI Analysis', icon: CpuChipIcon },
            { key: 'solutions', label: 'Model Selection', icon: ChartBarIcon },
            { key: 'results', label: 'Solutions', icon: CheckCircleIcon }
          ].map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.key;
            const isCompleted = ['input', 'analysis', 'solutions', 'results'].indexOf(currentStep) > index;
            
            return (
              <div key={step.key} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  isActive ? 'border-blue-500 bg-blue-50 text-blue-600' :
                  isCompleted ? 'border-green-500 bg-green-50 text-green-600' :
                  'border-gray-300 bg-gray-50 text-gray-400'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  isActive ? 'text-blue-600' :
                  isCompleted ? 'text-green-600' :
                  'text-gray-400'
                }`}>
                  {step.label}
                </span>
                {index < 3 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* Step 1: Problem Input */}
        {currentStep === 'input' && (
          <motion.div
            key="input"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
          >
            <h2 className="text-2xl font-semibold mb-6">Describe Your Problem</h2>
            
            <div className="space-y-6">
              {/* Problem Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Problem Description *
                </label>
                <textarea
                  value={problemText}
                  onChange={(e) => setProblemText(e.target.value)}
                  placeholder="Describe the complex problem you need to solve. Be as detailed as possible..."
                  className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Domain and Urgency */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Domain</label>
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select domain...</option>
                    {domains.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Urgency Level</label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="low">Low - Can wait weeks/months</option>
                    <option value="medium">Medium - Needs attention soon</option>
                    <option value="high">High - Urgent, needs quick solution</option>
                    <option value="critical">Critical - Immediate action required</option>
                  </select>
                </div>
              </div>

              {/* User Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Experience Level</label>
                <div className="grid grid-cols-3 gap-4">
                  {['novice', 'intermediate', 'expert'].map(level => (
                    <button
                      key={level}
                      onClick={() => setUserLevel(level as any)}
                      className={`p-3 border rounded-lg text-center transition-colors ${
                        userLevel === level
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="font-medium capitalize">{level}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {level === 'novice' && 'New to problem-solving frameworks'}
                        {level === 'intermediate' && 'Some experience with analysis'}
                        {level === 'expert' && 'Advanced analytical skills'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Stakeholders */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Key Stakeholders (Optional)
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {stakeholders.map((stakeholder, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {stakeholder}
                      <button
                        onClick={() => removeStakeholder(index)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Add stakeholder (press Enter)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addStakeholder(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmitProblem}
                  disabled={!problemText.trim() || loading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {loading ? 'Analyzing...' : 'Analyze Problem'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: AI Analysis (Loading) */}
        {currentStep === 'analysis' && (
          <motion.div
            key="analysis"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center"
          >
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
            <h2 className="text-2xl font-semibold mb-4">AI Analysis in Progress</h2>
            <p className="text-gray-600 mb-4">
              Our AI is analyzing your problem and selecting the most suitable mental models...
            </p>
            <div className="flex justify-center space-x-4 text-sm text-gray-500">
              <span>• Decomposing problem structure</span>
              <span>• Identifying key variables</span>
              <span>• Matching optimal frameworks</span>
            </div>
          </motion.div>
        )}

        {/* Step 3: Model Selection */}
        {currentStep === 'solutions' && (
          <motion.div
            key="solutions"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Problem Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Problem Analysis</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Domain:</span>
                  <div className="font-medium">{currentProblem?.domain}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Urgency:</span>
                  <div className={`inline-block px-2 py-1 rounded-full text-xs border ${getUrgencyColor(currentProblem?.urgency || 'medium')}`}>
                    {currentProblem?.urgency?.toUpperCase()}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Complexity:</span>
                  <div className={`inline-block px-2 py-1 rounded-full text-xs ${getComplexityColor(userLevel)}`}>
                    {userLevel.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>

            {/* Suggested Models */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Recommended Mental Models</h2>
              <p className="text-gray-600 mb-6">
                Our AI has selected the most suitable mental models for your problem. You can modify the selection below.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {suggestedModels.map((model, index) => (
                  <motion.div
                    key={model.model_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedModels.includes(model.model_id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      if (selectedModels.includes(model.model_id)) {
                        setSelectedModels(selectedModels.filter(id => id !== model.model_id));
                      } else {
                        setSelectedModels([...selectedModels, model.model_id]);
                      }
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium capitalize">
                        {model.model_id.replace('_', ' ')}
                      </h3>
                      <div className="text-sm font-medium text-blue-600">
                        {model.score.toFixed(1)}/10
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{model.rationale}</p>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500">Fit:</span>
                        <div className="font-medium">{model.contextual_fitness}/10</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Success:</span>
                        <div className="font-medium">{model.historical_success}/10</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Novel:</span>
                        <div className="font-medium">{model.novelty_factor}/10</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  ← Back to Problem Input
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGenerateSolutions}
                  disabled={selectedModels.length === 0 || loading}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {loading ? 'Generating...' : `Generate Solutions (${selectedModels.length})`}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 4: Results */}
        {currentStep === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {loading ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-6"></div>
                <h2 className="text-2xl font-semibold mb-4">Generating Solutions</h2>
                <p className="text-gray-600">
                  Applying selected mental models to generate comprehensive solutions...
                </p>
              </div>
            ) : (
              <>
                {/* Solutions */}
                {solutions.map((solution, index) => (
                  <motion.div
                    key={solution.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold capitalize">
                        {solution.model_id.replace('_', ' ')} Solution
                      </h2>
                      <div className="flex items-center space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleRateSolution(solution.id, star)}
                            className="text-gray-300 hover:text-yellow-400 transition-colors"
                          >
                            <StarIcon className="h-5 w-5" />
                          </button>
                        ))}
                      </div>
                    </div>

                    {solution.solution_variants.map((variant, variantIndex) => (
                      <div key={variantIndex} className="mb-6">
                        <h3 className="text-lg font-medium mb-3">{variant.title}</h3>
                        <p className="text-gray-700 mb-4">{variant.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium mb-2">Implementation Steps</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                              {variant.implementation_steps.map((step, stepIndex) => (
                                <li key={stepIndex}>{step}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2">Key Metrics</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Feasibility:</span>
                                <div className="font-medium">{variant.feasibility_score}/10</div>
                              </div>
                              <div>
                                <span className="text-gray-600">Innovation:</span>
                                <div className="font-medium">{variant.innovation_score}/10</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                          <div>
                            <h4 className="font-medium mb-2 text-green-700">Benefits</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-green-600">
                              {variant.benefits.map((benefit, benefitIndex) => (
                                <li key={benefitIndex}>{benefit}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2 text-red-700">Risks</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-red-600">
                              {variant.risks.map((risk, riskIndex) => (
                                <li key={riskIndex}>{risk}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Bias Analysis */}
                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                      <h4 className="font-medium mb-2 flex items-center">
                        <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2" />
                        Bias Analysis (Risk Score: {solution.bias_analysis.risk_score}/100)
                      </h4>
                      {solution.bias_analysis.detected_biases.map((bias, biasIndex) => (
                        <div key={biasIndex} className="text-sm mb-2">
                          <span className="font-medium capitalize">{bias.type} Bias</span>
                          <span className={`ml-2 px-2 py-1 rounded text-xs ${
                            bias.severity === 'high' ? 'bg-red-100 text-red-800' :
                            bias.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {bias.severity}
                          </span>
                          <p className="text-gray-600 mt-1">{bias.evidence}</p>
                          <p className="text-blue-600 mt-1">Mitigation: {bias.mitigation}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}

                {/* Action Buttons */}
                <div className="flex justify-between">
                  <button
                    onClick={() => setCurrentStep('solutions')}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    ← Modify Model Selection
                  </button>
                  <div className="space-x-4">
                    <button
                      onClick={resetForm}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      New Problem
                    </button>
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Export Solutions
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MentalModelAdvisor;