import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LightBulbIcon, 
  ArrowPathIcon, 
  CheckCircleIcon,
  ChevronRightIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  BoltIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { mentalModelApi } from '../../services/mentalModelApi';

interface ProblemInput {
  problem_text: string;
  domain: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  stakeholders?: string[];
}

interface ModelRecommendation {
  model_id: string;
  model_name: string;
  relevance_score: number;
  rationale: string;
}

interface ProblemAnalysis {
  complexity: number;
  key_factors: string[];
  domain_classification: string;
  uncertainty_level: number;
}

interface ModelSolution {
  model_id: string;
  model_name: string;
  solution_text: string;
  confidence_score: number;
  reasoning: string;
  alternatives: string[];
  limitations: string[];
  next_steps: string[];
}

const MentalModelAdvisor: React.FC = () => {
  const [step, setStep] = useState<'input' | 'analysis' | 'recommendations' | 'solution'>('input');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [problemInput, setProblemInput] = useState<ProblemInput>({
    problem_text: '',
    domain: '',
    urgency: 'medium',
    stakeholders: []
  });
  
  const [stakeholderInput, setStakeholderInput] = useState('');
  const [analysis, setAnalysis] = useState<ProblemAnalysis | null>(null);
  const [recommendations, setRecommendations] = useState<ModelRecommendation[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [solution, setSolution] = useState<ModelSolution | null>(null);

  const handleStakeholderAdd = () => {
    if (stakeholderInput.trim()) {
      setProblemInput(prev => ({
        ...prev,
        stakeholders: [...(prev.stakeholders || []), stakeholderInput.trim()]
      }));
      setStakeholderInput('');
    }
  };

  const handleStakeholderRemove = (index: number) => {
    setProblemInput(prev => ({
      ...prev,
      stakeholders: prev.stakeholders?.filter((_, i) => i !== index)
    }));
  };

  const handleProblemSubmit = async () => {
    if (!problemInput.problem_text) {
      setError('Please enter a problem description');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await mentalModelApi.analyzeProblem(problemInput);
      
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to analyze problem');
      }
      
      setAnalysis(response.data.problem_analysis);
      setRecommendations(response.data.recommended_models);
      setStep('analysis');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleModelSelect = (modelId: string) => {
    setSelectedModelId(modelId);
    setStep('recommendations');
  };

  const handleGenerateSolution = async () => {
    if (!selectedModelId) {
      setError('Please select a mental model');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await mentalModelApi.generateSolution(selectedModelId, problemInput);
      
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to generate solution');
      }
      
      setSolution(response.data);
      setStep('solution');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setProblemInput({
      problem_text: '',
      domain: '',
      urgency: 'medium',
      stakeholders: []
    });
    setStakeholderInput('');
    setAnalysis(null);
    setRecommendations([]);
    setSelectedModelId(null);
    setSolution(null);
    setStep('input');
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getComplexityColor = (score: number) => {
    if (score >= 8) return 'bg-red-100 text-red-800';
    if (score >= 6) return 'bg-orange-100 text-orange-800';
    if (score >= 4) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getRelevanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Mental Model Advisor</h1>
        <p className="mt-2 text-gray-600">
          Autonomous decision-making system that selects optimal mental models to solve complex problems.
        </p>
      </motion.div>

      {/* Step Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step === 'input' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'
            }`}>
              <span>1</span>
            </div>
            <span className={step === 'input' ? 'font-medium text-blue-600' : 'text-gray-600'}>Problem Input</span>
          </div>
          <ChevronRightIcon className="h-5 w-5 text-gray-400" />
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step === 'analysis' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'
            }`}>
              <span>2</span>
            </div>
            <span className={step === 'analysis' ? 'font-medium text-blue-600' : 'text-gray-600'}>AI Analysis</span>
          </div>
          <ChevronRightIcon className="h-5 w-5 text-gray-400" />
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step === 'recommendations' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'
            }`}>
              <span>3</span>
            </div>
            <span className={step === 'recommendations' ? 'font-medium text-blue-600' : 'text-gray-600'}>Model Selection</span>
          </div>
          <ChevronRightIcon className="h-5 w-5 text-gray-400" />
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step === 'solution' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'
            }`}>
              <span>4</span>
            </div>
            <span className={step === 'solution' ? 'font-medium text-blue-600' : 'text-gray-600'}>Solutions</span>
          </div>
        </div>
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-50 rounded-xl border border-red-200 p-4"
        >
          <p className="text-red-600">{error}</p>
        </motion.div>
      )}

      {/* Step 1: Problem Input */}
      {step === 'input' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-semibold mb-6">Problem Input</h2>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="problem" className="block text-sm font-medium text-gray-700 mb-2">
                Describe your problem or decision
              </label>
              <textarea
                id="problem"
                rows={4}
                value={problemInput.problem_text}
                onChange={(e) => setProblemInput(prev => ({ ...prev, problem_text: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe the problem you're trying to solve or decision you need to make..."
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-2">
                  Problem Domain
                </label>
                <select
                  id="domain"
                  value={problemInput.domain}
                  onChange={(e) => setProblemInput(prev => ({ ...prev, domain: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a domain</option>
                  <option value="geopolitics">Geopolitics</option>
                  <option value="business">Business & Economics</option>
                  <option value="technology">Technology</option>
                  <option value="social">Social & Cultural</option>
                  <option value="environmental">Environmental</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-2">
                  Urgency Level
                </label>
                <select
                  id="urgency"
                  value={problemInput.urgency}
                  onChange={(e) => setProblemInput(prev => ({ ...prev, urgency: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">Low - Months to decide</option>
                  <option value="medium">Medium - Weeks to decide</option>
                  <option value="high">High - Days to decide</option>
                  <option value="critical">Critical - Hours to decide</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Key Stakeholders (Optional)
              </label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={stakeholderInput}
                  onChange={(e) => setStakeholderInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleStakeholderAdd()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add stakeholder and press Enter"
                />
                <button
                  onClick={handleStakeholderAdd}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Add
                </button>
              </div>
              
              {problemInput.stakeholders && problemInput.stakeholders.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {problemInput.stakeholders.map((stakeholder, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {stakeholder}
                      <button
                        type="button"
                        onClick={() => handleStakeholderRemove(index)}
                        className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-blue-400 hover:text-blue-600 focus:outline-none"
                      >
                        <span className="sr-only">Remove</span>
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleProblemSubmit}
                disabled={loading || !problemInput.problem_text}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-5 w-5" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Analyze Problem
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Step 2: AI Analysis */}
      {step === 'analysis' && analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-semibold mb-6">AI Analysis</h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Problem Complexity</h3>
                <div className="flex items-center space-x-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${getComplexityColor(analysis.complexity)}`} 
                      style={{ width: `${analysis.complexity * 10}%` }}
                    ></div>
                  </div>
                  <span className={`text-sm font-medium ${getComplexityColor(analysis.complexity)}`}>
                    {analysis.complexity}/10
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {analysis.complexity >= 8 ? 'Highly complex problem requiring sophisticated analysis' :
                   analysis.complexity >= 6 ? 'Moderately complex problem with multiple variables' :
                   analysis.complexity >= 4 ? 'Somewhat complex problem with clear parameters' :
                   'Relatively straightforward problem with defined scope'}
                </p>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Domain Classification</h3>
                <div className="flex items-center space-x-2 mb-3">
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 border border-purple-200">
                    {analysis.domain_classification}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                    Uncertainty: {analysis.uncertainty_level}%
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  This problem has been classified within the {analysis.domain_classification} domain based on content analysis.
                  The uncertainty level reflects the ambiguity and variability in potential outcomes.
                </p>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">Key Factors Identified</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {analysis.key_factors.map((factor, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
                    <span className="text-gray-700">{factor}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">Recommended Mental Models</h3>
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <motion.div
                    key={rec.model_id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer"
                    onClick={() => handleModelSelect(rec.model_id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{rec.model_name}</h4>
                      <span className={`text-sm font-medium ${getRelevanceColor(rec.relevance_score)}`}>
                        {rec.relevance_score}% match
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{rec.rationale}</p>
                    <div className="flex justify-end">
                      <span className="text-sm text-blue-600 flex items-center">
                        Select this model <ChevronRightIcon className="h-4 w-4 ml-1" />
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleReset}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to Problem Input
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Step 3: Model Recommendations */}
      {step === 'recommendations' && selectedModelId && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-semibold mb-6">Model Selection</h2>
          
          <div className="space-y-6">
            <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
              <h3 className="font-medium text-gray-900 mb-3">Selected Mental Model</h3>
              <div className="flex items-center space-x-2 mb-3">
                <AcademicCapIcon className="h-6 w-6 text-blue-600" />
                <span className="text-lg font-medium text-blue-800">
                  {recommendations.find(r => r.model_id === selectedModelId)?.model_name}
                </span>
              </div>
              <p className="text-sm text-gray-700">
                {recommendations.find(r => r.model_id === selectedModelId)?.rationale}
              </p>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">Generate Solution</h3>
              <p className="text-sm text-gray-600 mb-4">
                Click the button below to generate a solution using the selected mental model. The AI will apply the model's framework to your specific problem.
              </p>
              
              <div className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGenerateSolution}
                  disabled={loading}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-5 w-5" />
                      Generating Solution...
                    </>
                  ) : (
                    <>
                      <BoltIcon className="mr-2 h-5 w-5" />
                      Generate Solution
                    </>
                  )}
                </motion.button>
              </div>
            </div>
            
            <div className="flex justify-between">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep('analysis')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to Analysis
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Step 4: Solution */}
      {step === 'solution' && solution && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-semibold mb-6">Solution</h2>
          
          <div className="space-y-6">
            <div className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">Solution using {solution.model_name}</h3>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                  {solution.confidence_score}% confidence
                </span>
              </div>
              <p className="text-gray-700 mb-4">{solution.solution_text}</p>
              <div className="text-sm text-gray-600">
                <p><strong>Reasoning:</strong> {solution.reasoning}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Alternative Approaches</h3>
                <ul className="space-y-2">
                  {solution.alternatives.map((alt, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 text-blue-600 text-xs font-medium">
                        {index + 1}
                      </span>
                      <span className="text-sm text-gray-700">{alt}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Limitations & Considerations</h3>
                <ul className="space-y-2">
                  {solution.limitations.map((limitation, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-orange-500">•</span>
                      <span className="text-sm text-gray-700">{limitation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">Recommended Next Steps</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {solution.next_steps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
                    <span className="text-sm text-gray-700">{step}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep('recommendations')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to Model Selection
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleReset}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Start New Analysis
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Loading State */}
      {loading && step === 'analysis' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center"
        >
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">AI Analysis in Progress</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Our AI is analyzing your problem and selecting the most suitable mental models...
            </p>
            
            <div className="mt-6 text-left max-w-md mx-auto">
              <div className="space-y-3 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                  <span>Decomposing problem structure</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                  <span>Identifying key variables</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                  <span>Matching optimal frameworks</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MentalModelAdvisor;