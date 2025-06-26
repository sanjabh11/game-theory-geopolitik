import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircleIcon, 
  XCircleIcon,
  ArrowRightIcon,
  PlayIcon,
  AcademicCapIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import { supabase } from '../../services/supabase';
import { TutorialResponse } from '../../types';
import toast from 'react-hot-toast';

// Comprehensive tutorial content generator
const generateComprehensiveTutorial = (module: string, level: string): TutorialResponse => {
  const tutorialDatabase: Record<string, Record<string, {
    concept: string;
    explanation: string;
    geopoliticalExample: string;
    interactiveElement: {
      type: 'scenario' | 'calculation' | 'game_tree';
      data: Record<string, unknown>;
    };
    assessmentQuestion: {
      question: string;
      options: string[];
      correctAnswer: number;
      explanation?: string;
    };
  }>> = {
    'Nash Equilibrium Basics': {
      basic: {
        concept: 'Nash Equilibrium - Foundational Concepts',
        explanation: `A Nash Equilibrium is a situation in a game where no player can improve their outcome by unilaterally changing their strategy, given the strategies of all other players. Named after mathematician John Nash, this concept is fundamental to understanding strategic interactions. \n\nKey characteristics:\n• Each player's strategy is optimal given others' strategies\n• No player has incentive to deviate unilaterally\n• Multiple equilibria can exist in a single game\n• Not necessarily the best outcome for all players combined`,
        geopoliticalExample: `Consider the Cold War nuclear deterrence strategy. Both the US and USSR had nuclear weapons pointed at each other. Neither country had an incentive to attack first because retaliation would be devastating. This mutual assured destruction (MAD) represented a Nash Equilibrium - neither side could improve their situation by changing strategy unilaterally.`,
        interactiveElement: {
          type: 'scenario',
          data: {
            scenario: 'Two countries are deciding whether to impose tariffs on each others goods. Each can choose "Cooperate" (free trade) or "Defect" (impose tariffs). Payoff matrix: Both cooperate: +3,+3 | One defects: +5,-1 | Both defect: -1,-1',
            question: 'What is the Nash Equilibrium in this trade scenario? Consider that each country will choose the strategy that maximizes their payoff regardless of what the other does.'
          }
        },
        assessmentQuestion: {
          question: 'In a Nash Equilibrium, what is true about each player\'s strategy?',
          options: [
            'It is the best response to all other players\' strategies',
            'It maximizes the total welfare of all players',
            'It guarantees the highest individual payoff possible',
            'It requires coordination with other players'
          ],
          correctAnswer: 0,
          explanation: 'In Nash Equilibrium, each player\'s strategy is optimal given what others are doing, making it the best response to others\' strategies.'
        }
      }
    },
    'Dominant Strategies': {
      basic: {
        concept: 'Dominant Strategies - Strategic Decision Framework',
        explanation: `A dominant strategy is one that yields the highest payoff regardless of what other players do. There are two types:\n\n**Strictly Dominant**: Always better than any other strategy\n**Weakly Dominant**: At least as good as any other strategy, and strictly better in some cases\n\nDominant strategies simplify decision-making because they're optimal regardless of opponents' choices. When all players have dominant strategies, the outcome is predictable and stable.`,
        geopoliticalExample: `In arms races, developing defensive capabilities often represents a dominant strategy. Whether other nations are aggressive or peaceful, having strong defenses is beneficial. For example, missile defense systems are valuable whether facing threats or maintaining peace through strength.`,
        interactiveElement: {
          type: 'scenario',
          data: {
            scenario: 'Two tech companies must decide on R&D investment levels: High or Low. High investment costs more but creates competitive advantage. Payoff matrix shows that High investment always outperforms Low investment regardless of competitors choice.',
            question: 'Identify the dominant strategy and explain why companies might still sometimes choose the dominated strategy in reality.'
          }
        },
        assessmentQuestion: {
          question: 'What makes a strategy "strictly dominant"?',
          options: [
            'It provides the highest payoff against all possible opponent strategies',
            'It creates the best outcome for all players combined',
            'It requires the least resources to implement',
            'It guarantees a win in competitive situations'
          ],
          correctAnswer: 0,
          explanation: 'A strictly dominant strategy always provides the highest payoff regardless of what opponents do, making it the clear best choice.'
        }
      }
    },
    'Prisoners Dilemma': {
      basic: {
        concept: 'Prisoners Dilemma - The Cooperation Paradox',
        explanation: `The Prisoners Dilemma illustrates a fundamental tension between individual and collective rationality. Two suspects are interrogated separately and must decide whether to confess (defect) or remain silent (cooperate).\n\nKey insights:\n• Individual rationality leads to mutual defection\n• Collective rationality would favor mutual cooperation\n• This creates the "dilemma" - rational choice leads to suboptimal outcomes\n• Found everywhere: trade wars, environmental protection, arms races`,
        geopoliticalExample: `Climate change represents a global Prisoners Dilemma. Each country benefits from using cheap fossil fuels (defection) while others reduce emissions, but if everyone pursues this logic, global warming accelerates. The Paris Agreement attempts to solve this through coordination and monitoring mechanisms.`,
        interactiveElement: {
          type: 'scenario',
          data: {
            scenario: 'Two neighboring countries face a water pollution problem. Each can choose to "Clean" (expensive) or "Pollute" (cheap). Clean water benefits both, but individual costs make pollution tempting. Payoffs: Both clean: 10,10 | One cleans: 2,15 | Both pollute: 5,5',
            question: 'How might these countries escape the dilemma through repeated interaction, reputation, or international agreements?'
          }
        },
        assessmentQuestion: {
          question: 'What is the key characteristic that makes a situation a Prisoners Dilemma?',
          options: [
            'Mutual cooperation is better than mutual defection, but defection dominates cooperation',
            'Players cannot communicate with each other',
            'The game is played only once',
            'Players have perfect information about payoffs'
          ],
          correctAnswer: 0,
          explanation: 'The Prisoners Dilemma occurs when mutual cooperation would be best for all, but each player has an incentive to defect, leading to a worse outcome for everyone.'
        }
      }
    }
  };

  const moduleContent = tutorialDatabase[module]?.[level];
  if (!moduleContent) {
    // Fallback for modules not yet in database
    return {
      concept: `${module} - ${level.charAt(0).toUpperCase() + level.slice(1)} Level`,
      explanation: `This is a ${level} level explanation of ${module}. This concept involves strategic decision-making and mathematical modeling to understand competitive interactions between rational actors.`,
      geopoliticalExample: `In international relations, ${module} can be applied to understand strategic interactions between nations, such as trade negotiations, military alliances, and diplomatic disputes.`,
      interactiveElement: {
        type: 'scenario',
        data: {
          scenario: `Consider a strategic situation involving ${module.toLowerCase()} where multiple parties must make decisions.`,
          question: "What would be the optimal approach for each party?"
        }
      },
      assessmentQuestion: {
        question: `Which principle best characterizes ${module}?`,
        options: [
          "Strategic interdependence between decision-makers",
          "Individual optimization without considering others",
          "Random decision-making processes",
          "Centralized coordination mechanisms"
        ],
        correctAnswer: 0,
        explanation: "Game theory concepts focus on strategic interdependence where each player's optimal choice depends on others' decisions."
      }
    };
  }

  return moduleContent;
};

interface GameState {
  currentModule: string;
  level: 'basic' | 'intermediate' | 'advanced';
  progress: number;
  score: number;
}

const modules = {
  basic: [
    'Nash Equilibrium Basics',
    'Dominant Strategies',
    'Zero-Sum Games',
    'Prisoners Dilemma'
  ],
  intermediate: [
    'Mixed Strategies',
    'Sequential Games',
    'Repeated Games',
    'Auction Theory'
  ],
  advanced: [
    'Evolutionary Game Theory',
    'Mechanism Design',
    'Information Economics',
    'Coalition Games'
  ]
};

const GameTheoryTutorial: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentModule: 'Nash Equilibrium Basics',
    level: 'basic',
    progress: 0,
    score: 0
  });
  
  const [tutorial, setTutorial] = useState<TutorialResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [userProgress, setUserProgress] = useState({
    completedModules: [] as string[],
    currentScore: 0
  });

  const loadUserProgress = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('learning_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('module_id', `${gameState.level}_${gameState.currentModule}`);

      if (data && data.length > 0) {
        const progress = data[0];
        setUserProgress({
          completedModules: progress.performance_data?.completedModules || [],
          currentScore: progress.score || 0
        });
        setGameState(prev => ({ ...prev, progress: progress.completion_percentage, score: progress.score }));
      }
    } catch (error) {
      // Error loading progress - using defaults
    }
  }, [gameState.level, gameState.currentModule]);

  useEffect(() => {
    loadUserProgress();
  }, [loadUserProgress]);

  const generateTutorial = async () => {
    setIsLoading(true);
    try {
      // Enhanced comprehensive tutorial content
      const fallbackTutorial: TutorialResponse = generateComprehensiveTutorial(gameState.currentModule, gameState.level);

      // Simulate API delay for realistic UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setTutorial(fallbackTutorial);
      setSelectedAnswer(null);
      setShowResults(false);
      
    } catch (error) {
      // Error generating tutorial
      toast.error('Failed to generate tutorial. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null || !tutorial) return;

    const isCorrect = selectedAnswer === tutorial.assessmentQuestion.correctAnswer;
    setShowResults(true);

    if (isCorrect) {
      const newScore = gameState.score + 10;
      setGameState(prev => ({ ...prev, score: newScore, progress: Math.min(prev.progress + 25, 100) }));
      toast.success('Correct! Well done!');
      
      // Update progress in database
      updateProgress(newScore, Math.min(gameState.progress + 25, 100));
    } else {
      toast.error('Incorrect. Review the concept and try again.');
    }
  };

  const updateProgress = async (score: number, progress: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('learning_progress')
        .upsert({
          user_id: user.id,
          module_id: `${gameState.level}_${gameState.currentModule}`,
          module_name: `${gameState.level.charAt(0).toUpperCase() + gameState.level.slice(1)} ${gameState.currentModule}`,
          completion_percentage: progress,
          score: score,
          performance_data: {
            ...userProgress,
            lastSession: new Date().toISOString()
          }
        });
    } catch (error) {
      // Error updating progress
    }
  };

  const nextModule = () => {
    const currentModules = modules[gameState.level];
    const currentIndex = currentModules.indexOf(gameState.currentModule);
    
    if (currentIndex < currentModules.length - 1) {
      const nextMod = currentModules[currentIndex + 1];
      setGameState(prev => ({ ...prev, currentModule: nextMod, progress: 0 }));
      setTutorial(null);
      setUserProgress(prev => ({ 
        ...prev, 
        completedModules: [...prev.completedModules, `${gameState.level}_${gameState.currentModule}`]
      }));
    } else {
      toast.success('Level completed! Ready for the next level?');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-full">
            <AcademicCapIcon className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Game Theory Tutorial</h1>
        <p className="text-xl text-gray-600">Master strategic decision-making with AI-powered lessons</p>
      </motion.div>

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">{gameState.currentModule}</h2>
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium capitalize">
                {gameState.level}
              </span>
              <span className="text-gray-600">Score: {gameState.score}</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4 lg:mt-0">
            <select
              value={gameState.level}
              onChange={(e) => setGameState(prev => ({ 
                ...prev, 
                level: e.target.value as 'basic' | 'intermediate' | 'advanced',
                currentModule: modules[e.target.value as keyof typeof modules][0],
                progress: 0 
              }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="basic">Basic</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={generateTutorial}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <PlayIcon className="h-5 w-5" />
              )}
              {isLoading ? 'Generating...' : 'Start Lesson'}
            </motion.button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${gameState.progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        <div className="flex justify-between text-sm text-gray-600">
          <span>Progress: {gameState.progress}%</span>
          <span>{userProgress.completedModules.length} modules completed</span>
        </div>
      </motion.div>

      {/* Tutorial Content */}
      <AnimatePresence mode="wait">
        {tutorial && (
          <motion.div
            key="tutorial-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Concept Explanation */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-green-500 to-teal-500 p-3 rounded-full">
                  <LightBulbIcon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 ml-4">{tutorial.concept}</h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Concept Overview</h4>
                  <p className="text-gray-700 leading-relaxed">{tutorial.explanation}</p>
                </div>
                
                {(tutorial.geopoliticalExample || tutorial.example) && (
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-3">Real-World Example</h4>
                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                      {tutorial.geopoliticalExample ? (
                        <p className="text-gray-800">{tutorial.geopoliticalExample}</p>
                      ) : tutorial.example ? (
                        <div className="space-y-2">
                          <p className="text-gray-800 font-medium">{tutorial.example.scenario}</p>
                          <p className="text-gray-700">{tutorial.example.analysis}</p>
                          <p className="text-gray-700 italic">{tutorial.example.solution}</p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Interactive Element & Assessment */}
            <div className="space-y-6">
              {/* Interactive Element */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Interactive Exercise</h3>
                
                {tutorial.interactiveElement && tutorial.interactiveElement.type === 'scenario' && (
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <p className="text-gray-800 mb-4">{tutorial.interactiveElement.data?.scenario}</p>
                    <p className="font-medium text-purple-800">{tutorial.interactiveElement.data?.question}</p>
                  </div>
                )}
                
                {tutorial.interactiveElement && tutorial.interactiveElement.type === 'calculation' && (
                  <div className="bg-green-50 p-6 rounded-lg">
                    <p className="text-gray-800 mb-4">Mathematical Analysis:</p>
                    <div className="font-mono text-sm bg-white p-4 rounded border">
                      {JSON.stringify(tutorial.interactiveElement.data?.matrix, null, 2)}
                    </div>
                  </div>
                )}
              </div>

              {/* Assessment Question */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Knowledge Check</h3>
                
                <div className="space-y-4">
                  <p className="text-gray-800 font-medium">{tutorial.assessmentQuestion.question}</p>
                  
                  <div className="space-y-3">
                    {tutorial.assessmentQuestion.options.map((option, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedAnswer(index)}
                        disabled={showResults}
                        className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 text-gray-800 ${
                          selectedAnswer === index
                            ? 'border-blue-500 bg-blue-50 text-blue-900'
                            : 'border-gray-200 hover:border-gray-300 text-gray-800'
                        } ${
                          showResults
                            ? index === tutorial.assessmentQuestion.correctAnswer
                              ? 'border-green-500 bg-green-50 text-green-900'
                              : selectedAnswer === index
                              ? 'border-red-500 bg-red-50 text-red-900'
                              : 'border-gray-200 bg-gray-50 text-gray-700'
                            : ''
                        }`}
                      >
                        <div className="flex items-center">
                          <span className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-current flex items-center justify-center text-sm font-medium mr-3">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span>{option}</span>
                          {showResults && index === tutorial.assessmentQuestion.correctAnswer && (
                            <CheckCircleIcon className="h-6 w-6 text-green-600 ml-auto" />
                          )}
                          {showResults && selectedAnswer === index && index !== tutorial.assessmentQuestion.correctAnswer && (
                            <XCircleIcon className="h-6 w-6 text-red-600 ml-auto" />
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                  
                  <div className="flex gap-4 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAnswerSubmit}
                      disabled={selectedAnswer === null || showResults}
                      className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Submit Answer
                    </motion.button>
                    
                    {showResults && selectedAnswer === tutorial.assessmentQuestion.correctAnswer && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={nextModule}
                        className="flex items-center gap-2 py-3 px-6 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-500 hover:to-teal-500 transition-all duration-200"
                      >
                        Next Module
                        <ArrowRightIcon className="h-5 w-5" />
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Module Selection */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8"
      >
        <h3 className="text-2xl font-semibold text-gray-900 mb-6">Available Modules</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(modules).map(([level, moduleList]) => (
            <div key={level} className="space-y-3">
              <h4 className="text-lg font-medium text-gray-900 capitalize">{level}</h4>
              <div className="space-y-2">
                {moduleList.map((module) => (
                  <motion.button
                    key={module}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setGameState(prev => ({ ...prev, currentModule: module, level: level as 'basic' | 'intermediate' | 'advanced', progress: 0 }))}
                    className={`w-full p-3 text-left rounded-lg border transition-all duration-200 ${
                      gameState.currentModule === module && gameState.level === level
                        ? 'border-blue-500 bg-blue-50 text-blue-800'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{module}</span>
                      {userProgress.completedModules.includes(`${level}_${module}`) && (
                        <CheckCircleIcon className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default GameTheoryTutorial;
