import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LightBulbIcon, 
  ArrowRightIcon, 
  CheckCircleIcon,
  BoltIcon,
  BeakerIcon,
  DocumentTextIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { mentalModelApi } from '../../services/mentalModelApi';

const MentalModelAdvisor: React.FC = () => {
  const [problemInput, setProblemInput] = useState('');
  const [domain, setDomain] = useState('geopolitical');
  const [urgency, setUrgency] = useState('medium');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const domains = [
    { id: 'geopolitical', name: 'Geopolitical' },
    { id: 'financial', name: 'Financial' },
    { id: 'strategic', name: 'Strategic' },
    { id: 'organizational', name: 'Organizational' },
    { id: 'personal', name: 'Personal' }
  ];

  const urgencyLevels = [
    { id: 'low', name: 'Low - Weeks/Months' },
    { id: 'medium', name: 'Medium - Days' },
    { id: 'high', name: 'High - Hours' },
    { id: 'critical', name: 'Critical - Immediate' }
  ];

  const analyzeSteps = [
    'Decomposing problem structure',
    'Identifying key variables',
    'Matching optimal frameworks',
    'Generating solution approaches',
    'Evaluating trade-offs',
    'Finalizing recommendations'
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isAnalyzing) {
      interval = setInterval(() => {
        setAnalysisStep(prev => {
          if (prev < analyzeSteps.length - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            // Simulate API response completion
            setTimeout(() => {
              completeAnalysis();
            }, 1000);
            return prev;
          }
        });
      }, 1500);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAnalyzing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!problemInput.trim()) {
      setError('Please enter a problem description');
      return;
    }

    setError(null);
    setIsAnalyzing(true);
    setAnalysisStep(0);
    setAnalysisResults(null);
  };

  const completeAnalysis = async () => {
    try {
      const results = await mentalModelApi.analyzeProblem({
        problemText: problemInput,
        domain,
        urgency,
        context: {}
      });

      if (results.success && results.data) {
        setAnalysisResults(results.data);
      } else {
        throw new Error(results.error || 'Failed to analyze problem');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setProblemInput('');
    setDomain('geopolitical');
    setUrgency('medium');
    setAnalysisResults(null);
    setError(null);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mental Model Advisor</h1>
        <p className="text-gray-600">
          Autonomous decision-making system that selects optimal mental models to solve complex problems.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Problem Input */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <DocumentTextIcon className="h-6 w-6 mr-2 text-blue-600" />
            Problem Input
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="problem" className="block text-sm font-medium text-gray-700 mb-1">
                Describe your problem or decision
              </label>
              <textarea
                id="problem"
                rows={5}
                value={problemInput}
                onChange={(e) => setProblemInput(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="E.g., How should Country A respond to Country B's new trade restrictions while minimizing economic impact?"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-1">
                  Problem Domain
                </label>
                <select
                  id="domain"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {domains.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-1">
                  Decision Urgency
                </label>
                <select
                  id="urgency"
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {urgencyLevels.map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isAnalyzing || !problemInput.trim()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-5 w-5" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <LightBulbIcon className="-ml-1 mr-2 h-5 w-5" />
                    Analyze Problem
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Analysis Status */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <BeakerIcon className="h-6 w-6 mr-2 text-purple-600" />
            AI Analysis
          </h2>

          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              <p className="font-medium">Analysis Error</p>
              <p className="text-sm mt-1">{error}</p>
              <button 
                onClick={resetAnalysis}
                className="mt-3 text-sm font-medium text-red-600 hover:text-red-500"
              >
                Try Again
              </button>
            </div>
          ) : isAnalyzing ? (
            <div className="space-y-4">
              <p className="font-medium text-gray-900">AI Analysis in Progress</p>
              <p className="text-sm text-gray-600">
                Our AI is analyzing your problem and selecting the most suitable mental models...
              </p>
              
              <div className="space-y-3 mt-4">
                {analyzeSteps.map((step, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center ${index <= analysisStep ? 'text-gray-900' : 'text-gray-400'}`}
                  >
                    <div className={`flex-shrink-0 h-5 w-5 mr-2 ${
                      index < analysisStep 
                        ? 'text-green-500' 
                        : index === analysisStep 
                          ? 'text-blue-500 animate-pulse' 
                          : 'text-gray-300'
                    }`}>
                      {index < analysisStep ? (
                        <CheckCircleIcon className="h-5 w-5" />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-current mt-1.5 ml-1.5" />
                      )}
                    </div>
                    <span className="text-sm">• {step}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : analysisResults ? (
            <div className="space-y-4">
              <p className="font-medium text-gray-900">Analysis Complete</p>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Problem Type:</p>
                <p className="text-sm bg-blue-50 p-2 rounded">{analysisResults.problemType}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Complexity Level:</p>
                <div className="bg-gray-100 h-2 rounded-full">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${analysisResults.complexityScore * 10}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 text-right">{analysisResults.complexityScore}/10</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Key Factors:</p>
                <div className="flex flex-wrap gap-2">
                  {analysisResults.keyFactors.map((factor: string, index: number) => (
                    <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {factor}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={resetAnalysis}
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Start New Analysis
              </button>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <LightBulbIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p>Enter your problem and click "Analyze Problem" to begin</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Model Selection */}
      {analysisResults && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <BoltIcon className="h-6 w-6 mr-2 text-yellow-500" />
            Model Selection
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analysisResults.recommendedModels.map((model: any, index: number) => (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">{model.name}</h3>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {model.category}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-3">{model.description}</p>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Match Score:</span>
                  <span className="font-medium">{model.matchScore}%</span>
                </div>
                
                <div className="mt-3 flex items-center text-sm text-blue-600 hover:text-blue-800">
                  <span className="font-medium">View Details</span>
                  <ArrowRightIcon className="ml-1 h-4 w-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Solutions */}
      {analysisResults && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <CheckCircleIcon className="h-6 w-6 mr-2 text-green-500" />
            Solutions
          </h2>

          <div className="space-y-6">
            {analysisResults.solutions.map((solution: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="border rounded-lg p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">{solution.title}</h3>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">Confidence:</span>
                    <div className="bg-gray-200 h-2 w-20 rounded-full">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${solution.confidence}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">{solution.description}</p>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Key Advantages:</h4>
                    <ul className="mt-1 list-disc list-inside text-sm text-gray-600">
                      {solution.advantages.map((adv: string, i: number) => (
                        <li key={i}>{adv}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Potential Challenges:</h4>
                    <ul className="mt-1 list-disc list-inside text-sm text-gray-600">
                      {solution.challenges.map((chal: string, i: number) => (
                        <li key={i}>{chal}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Based on: <span className="font-medium">{solution.basedOn}</span>
                  </div>
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
                    Export Solution
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MentalModelAdvisor;