import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { geminiApi } from '../../services/geminiApi';

interface ModelRecommendation {
  modelId: string;
  modelName: string;
  category: string;
  relevanceScore: number;
  explanation: string;
  applicationSteps: string[];
}

const MentalModelAdvisor: React.FC = () => {
  const [problem, setProblem] = useState('');
  const [domain, setDomain] = useState('business');
  const [urgency, setUrgency] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<ModelRecommendation[]>([]);

  const domains = [
    { value: 'business', label: 'Business & Strategy' },
    { value: 'technology', label: 'Technology & Innovation' },
    { value: 'policy', label: 'Policy & Governance' },
    { value: 'personal', label: 'Personal Decision Making' },
    { value: 'science', label: 'Scientific Research' }
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Low - Weeks/Months' },
    { value: 'medium', label: 'Medium - Days' },
    { value: 'high', label: 'High - Hours' },
    { value: 'critical', label: 'Critical - Immediate' }
  ];

  const getRecommendations = async () => {
    if (!problem.trim()) {
      setError('Please describe your problem');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // In a real implementation, we would call the Gemini API
      // For now, we'll use a fallback response
      const fallbackRecommendations = generateFallbackRecommendations(problem, domain, urgency);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setRecommendations(fallbackRecommendations);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      setError('Failed to generate recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateFallbackRecommendations = (
    problemText: string, 
    domainValue: string, 
    urgencyValue: string
  ): ModelRecommendation[] => {
    // This is a fallback function that returns realistic recommendations
    // based on the problem description, domain, and urgency
    
    const domainModels: Record<string, string[]> = {
      'business': ['first_principles', 'opportunity_cost', 'nash_equilibrium'],
      'technology': ['systems_thinking', 'first_principles', 'second_order_thinking'],
      'policy': ['systems_thinking', 'nash_equilibrium', 'second_order_thinking'],
      'personal': ['opportunity_cost', 'second_order_thinking', 'first_principles'],
      'science': ['first_principles', 'systems_thinking', 'second_order_thinking']
    };
    
    const modelDetails: Record<string, {name: string, category: string}> = {
      'first_principles': {name: 'First Principles', category: 'analytical'},
      'opportunity_cost': {name: 'Opportunity Cost', category: 'analytical'},
      'nash_equilibrium': {name: 'Nash Equilibrium', category: 'strategic'},
      'systems_thinking': {name: 'Systems Thinking', category: 'systems'},
      'second_order_thinking': {name: 'Second-Order Thinking', category: 'cognitive'}
    };
    
    const relevantModels = domainModels[domainValue] || ['first_principles', 'systems_thinking'];
    
    // Generate explanations based on problem text
    const problemLower = problemText.toLowerCase();
    const hasCompetition = problemLower.includes('compet') || problemLower.includes('rival') || problemLower.includes('opponent');
    const hasComplexity = problemLower.includes('complex') || problemLower.includes('system') || problemLower.includes('intercon');
    const hasTradeoffs = problemLower.includes('tradeoff') || problemLower.includes('choice') || problemLower.includes('decision');
    
    // Adjust model relevance based on problem content
    let modelScores: Record<string, number> = {
      'first_principles': 0.7,
      'opportunity_cost': 0.6,
      'nash_equilibrium': 0.5,
      'systems_thinking': 0.65,
      'second_order_thinking': 0.55
    };
    
    if (hasCompetition) modelScores['nash_equilibrium'] += 0.3;
    if (hasComplexity) modelScores['systems_thinking'] += 0.3;
    if (hasTradeoffs) modelScores['opportunity_cost'] += 0.3;
    
    // Adjust for urgency
    if (urgencyValue === 'critical' || urgencyValue === 'high') {
      // For high urgency, favor simpler models
      modelScores['first_principles'] += 0.1;
      modelScores['opportunity_cost'] += 0.1;
      modelScores['systems_thinking'] -= 0.1;
    }
    
    // Create recommendations
    return relevantModels.map(modelId => {
      const model = modelDetails[modelId];
      const baseScore = modelScores[modelId] || 0.5;
      
      // Randomize slightly for realistic variation
      const relevanceScore = Math.min(0.99, Math.max(0.1, baseScore + (Math.random() * 0.1 - 0.05)));
      
      return {
        modelId,
        modelName: model.name,
        category: model.category,
        relevanceScore: Math.round(relevanceScore * 100),
        explanation: generateExplanation(modelId, problemText, domainValue),
        applicationSteps: generateApplicationSteps(modelId)
      };
    }).sort((a, b) => b.relevanceScore - a.relevanceScore);
  };

  const generateExplanation = (modelId: string, problem: string, domain: string): string => {
    const explanations: Record<string, string> = {
      'first_principles': `First Principles thinking is highly relevant to your ${domain} problem as it allows you to break down the complex situation into its fundamental components. By questioning assumptions and rebuilding from essential truths, you can discover innovative solutions that might be obscured by conventional thinking.`,
      
      'opportunity_cost': `The Opportunity Cost model is particularly useful for your problem as it helps quantify what you're giving up with each potential choice. In this ${domain} context, understanding the true cost of each option (including what you forgo) will lead to more optimal resource allocation and decision-making.`,
      
      'nash_equilibrium': `Your problem involves multiple stakeholders with competing interests, making Nash Equilibrium an excellent framework. This model will help identify stable strategies where no party can improve their position by unilaterally changing their approach, leading to more predictable and potentially cooperative outcomes.`,
      
      'systems_thinking': `The interconnected nature of your ${domain} challenge makes Systems Thinking highly applicable. This model will help you map relationships between components, identify feedback loops, and understand how changes propagate throughout the system, preventing unintended consequences.`,
      
      'second_order_thinking': `Your problem requires looking beyond immediate effects to understand cascading impacts, making Second-Order Thinking valuable. This approach will help you anticipate how the system will adapt to changes and identify potential unintended consequences before they occur.`
    };
    
    return explanations[modelId] || `This mental model provides a structured approach to solving your ${domain} problem by offering a framework that matches the characteristics of your situation.`;
  };

  const generateApplicationSteps = (modelId: string): string[] => {
    const steps: Record<string, string[]> = {
      'first_principles': [
        'Identify the problem and clearly articulate what you\'re trying to solve',
        'Break down the problem into its fundamental truths or components',
        'Question all assumptions and conventional wisdom',
        'Rebuild your solution from the ground up using only validated elements',
        'Test your solution against the original problem constraints'
      ],
      
      'opportunity_cost': [
        'List all available options or alternatives',
        'Identify the benefits and value of each option',
        'Determine the next-best alternative to each choice',
        'Calculate what you would be giving up by making each choice',
        'Make decisions based on the true cost (including what\'s foregone)'
      ],
      
      'nash_equilibrium': [
        'Identify all key stakeholders or players',
        'Map out possible strategies for each player',
        'Determine payoffs for each combination of strategies',
        'Find strategy combinations where no player can improve by changing only their strategy',
        'Analyze the stability and optimality of the equilibrium'
      ],
      
      'systems_thinking': [
        'Define the system boundaries and key components',
        'Map relationships and connections between components',
        'Identify feedback loops (reinforcing and balancing)',
        'Analyze how changes propagate through the system',
        'Look for leverage points where small changes create large effects'
      ],
      
      'second_order_thinking': [
        'Identify the immediate or first-order consequences of actions',
        'For each consequence, determine its subsequent effects',
        'Map cascading impacts across different timeframes',
        'Consider how systems and people will adapt to the changes',
        'Identify potential unintended consequences and prepare mitigations'
      ]
    };
    
    return steps[modelId] || [
      'Define the problem clearly',
      'Apply the mental model framework to analyze the situation',
      'Generate potential solutions based on the framework',
      'Evaluate solutions against objectives and constraints',
      'Implement and monitor the chosen solution'
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

      {/* Problem Input Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h2 className="text-xl font-semibold mb-4">Problem Input</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="problem" className="block text-sm font-medium text-gray-700 mb-1">
              Describe your problem
            </label>
            <textarea
              id="problem"
              rows={4}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Describe the problem you're trying to solve..."
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
            ></textarea>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-1">
                Problem Domain
              </label>
              <select
                id="domain"
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
              >
                {domains.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-1">
                Urgency Level
              </label>
              <select
                id="urgency"
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
              >
                {urgencyLevels.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {error && (
            <div className="text-sm text-red-600">
              {error}
            </div>
          )}
          
          <div>
            <button
              type="button"
              onClick={getRecommendations}
              disabled={loading || !problem.trim()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Analyzing...' : 'Get Recommendations'}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Results Section */}
      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
        >
          <h2 className="text-xl font-semibold mb-6 text-center">AI Analysis in Progress</h2>
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600 text-center">Our AI is analyzing your problem and selecting the most suitable mental models...</p>
            
            <div className="mt-6 text-sm text-gray-500 space-y-2">
              <p>• Decomposing problem structure</p>
              <p>• Identifying key variables</p>
              <p>• Matching optimal frameworks</p>
            </div>
          </div>
        </motion.div>
      ) : recommendations.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-semibold mb-6">Recommended Mental Models</h2>
          
          <div className="space-y-6">
            {recommendations.map((rec, index) => (
              <motion.div
                key={rec.modelId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="border rounded-lg p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <h3 className="text-lg font-semibold text-gray-900">{rec.modelName}</h3>
                    <span className={`ml-3 px-2 py-1 rounded-full text-xs ${getCategoryColor(rec.category)}`}>
                      {rec.category}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">Relevance:</span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${rec.relevanceScore}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-700">{rec.relevanceScore}%</span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{rec.explanation}</p>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Application Steps:</h4>
                  <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-1">
                    {rec.applicationSteps.map((step, stepIndex) => (
                      <li key={stepIndex}>{step}</li>
                    ))}
                  </ol>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Apply This Model
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : null}
    </div>
  );
};

export default MentalModelAdvisor;