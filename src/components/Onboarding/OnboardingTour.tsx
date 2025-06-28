import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  XMarkIcon, 
  ArrowRightIcon, 
  ArrowLeftIcon,
  LightBulbIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { supabase } from '../../services/supabase';

interface TourStep {
  id: string;
  title: string;
  description: string;
  path: string;
  element: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const OnboardingTour: React.FC = () => {
  const [showTour, setShowTour] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [elementPosition, setElementPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const location = useLocation();
  const navigate = useNavigate();

  const tourSteps: TourStep[] = [
    {
      id: 'dashboard',
      title: 'Welcome to the Dashboard',
      description: 'This is your central hub for all platform features. From here, you can access all tools and see your recent activity.',
      path: '/dashboard',
      element: '.dashboard-overview',
      position: 'bottom'
    },
    {
      id: 'tutorial',
      title: 'Game Theory Tutorial',
      description: 'Learn the fundamentals of game theory through interactive lessons and real-world examples.',
      path: '/tutorial',
      element: '.tutorial-modules',
      position: 'right'
    },
    {
      id: 'risk-assessment',
      title: 'Risk Assessment',
      description: 'Analyze geopolitical risks with AI-powered insights and multi-factor analysis.',
      path: '/risk-assessment',
      element: '.risk-controls',
      position: 'bottom'
    },
    {
      id: 'simulation',
      title: 'Scenario Simulation',
      description: 'Model complex geopolitical scenarios and explore potential outcomes.',
      path: '/simulation',
      element: '.scenario-list',
      position: 'right'
    },
    {
      id: 'mental-models',
      title: 'Mental Models Library',
      description: 'Explore a comprehensive library of mental models for strategic thinking.',
      path: '/mental-models',
      element: '.mental-models-grid',
      position: 'bottom'
    }
  ];

  useEffect(() => {
    // Check if user has completed onboarding
    const checkOnboardingStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
          .from('user_profiles')
          .select('preferences')
          .eq('id', user.id)
          .single();

        if (data && data.preferences && data.preferences.onboardingCompleted) {
          setShowTour(false);
        } else {
          // For new users, show the tour
          setShowTour(true);
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        // Default to showing the tour if there's an error
        setShowTour(true);
      }
    };

    checkOnboardingStatus();
  }, []);

  useEffect(() => {
    // If tour is active, navigate to the current step's path
    if (showTour && tourSteps[currentStep]?.path !== location.pathname) {
      navigate(tourSteps[currentStep].path);
    }
  }, [showTour, currentStep, navigate, location.pathname, tourSteps]);

  useEffect(() => {
    // Find and position the tooltip relative to the target element
    if (showTour) {
      const findElement = () => {
        const element = document.querySelector(tourSteps[currentStep].element);
        if (element) {
          const rect = element.getBoundingClientRect();
          setElementPosition({
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height
          });
        } else {
          // If element not found, position in center of screen
          setElementPosition({
            top: window.innerHeight / 2 - 100,
            left: window.innerWidth / 2 - 150,
            width: 300,
            height: 200
          });
        }
      };

      // Wait for the page to render
      setTimeout(findElement, 500);
      
      // Also update position on resize
      window.addEventListener('resize', findElement);
      return () => {
        window.removeEventListener('resize', findElement);
      };
    }
  }, [showTour, currentStep, location.pathname, tourSteps]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeTour = async () => {
    setShowTour(false);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Update user preferences to mark onboarding as completed
      await supabase
        .from('user_profiles')
        .update({
          preferences: {
            onboardingCompleted: true
          }
        })
        .eq('id', user.id);
    } catch (error) {
      console.error('Error updating onboarding status:', error);
    }
  };

  const getTooltipPosition = () => {
    const position = tourSteps[currentStep]?.position || 'bottom';
    const margin = 20; // Margin from the element
    
    switch (position) {
      case 'top':
        return {
          top: elementPosition.top - 200 - margin,
          left: elementPosition.left + (elementPosition.width / 2) - 150
        };
      case 'bottom':
        return {
          top: elementPosition.top + elementPosition.height + margin,
          left: elementPosition.left + (elementPosition.width / 2) - 150
        };
      case 'left':
        return {
          top: elementPosition.top + (elementPosition.height / 2) - 100,
          left: elementPosition.left - 300 - margin
        };
      case 'right':
        return {
          top: elementPosition.top + (elementPosition.height / 2) - 100,
          left: elementPosition.left + elementPosition.width + margin
        };
      default:
        return {
          top: elementPosition.top + elementPosition.height + margin,
          left: elementPosition.left + (elementPosition.width / 2) - 150
        };
    }
  };

  if (!showTour) return null;

  const tooltipPosition = getTooltipPosition();

  return (
    <AnimatePresence>
      {showTour && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 pointer-events-none"
          />
          
          {/* Highlight current element */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed z-50 pointer-events-none"
            style={{
              top: elementPosition.top,
              left: elementPosition.left,
              width: elementPosition.width,
              height: elementPosition.height,
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
              borderRadius: '4px'
            }}
          />
          
          {/* Tooltip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed z-50 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4"
            style={{
              top: tooltipPosition.top,
              left: tooltipPosition.left
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <LightBulbIcon className="h-5 w-5 text-yellow-500 mr-2" />
                <h3 className="font-medium text-gray-900">{tourSteps[currentStep].title}</h3>
              </div>
              <button
                onClick={completeTour}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <XMarkIcon className="h-4 w-4 text-gray-500" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              {tourSteps[currentStep].description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {tourSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full ${
                      index === currentStep ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              
              <div className="flex items-center gap-2">
                {currentStep > 0 && (
                  <button
                    onClick={handlePrevious}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    <ArrowLeftIcon className="h-3 w-3" />
                    Previous
                  </button>
                )}
                
                <button
                  onClick={handleNext}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {currentStep < tourSteps.length - 1 ? (
                    <>
                      Next
                      <ArrowRightIcon className="h-3 w-3" />
                    </>
                  ) : (
                    <>
                      Finish
                      <CheckCircleIcon className="h-3 w-3" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default OnboardingTour;