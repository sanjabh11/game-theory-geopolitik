import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LightBulbIcon, 
  XMarkIcon, 
  ArrowRightIcon,
  ShieldExclamationIcon,
  CpuChipIcon,
  ChartBarIcon,
  DocumentTextIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { supabase } from '../../services/supabase';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  path: string;
  isNew?: boolean;
}

const FeatureDiscovery: React.FC = () => {
  const [showFeature, setShowFeature] = useState(false);
  const [currentFeature, setCurrentFeature] = useState<Feature | null>(null);
  const [dismissedFeatures, setDismissedFeatures] = useState<string[]>([]);

  const features: Feature[] = [
    {
      id: 'risk-assessment',
      title: 'Risk Assessment',
      description: 'Analyze geopolitical risks with AI-powered insights. Get real-time risk scores and multi-factor analysis for regions worldwide.',
      icon: ShieldExclamationIcon,
      path: '/risk-assessment'
    },
    {
      id: 'scenario-simulation',
      title: 'Scenario Simulation',
      description: 'Model complex geopolitical scenarios and explore potential outcomes using game theory principles.',
      icon: CpuChipIcon,
      path: '/simulation'
    },
    {
      id: 'predictive-analytics',
      title: 'Predictive Analytics',
      description: 'Forecast geopolitical trends and market impacts with AI-enhanced predictive models.',
      icon: ChartBarIcon,
      path: '/analytics'
    },
    {
      id: 'collaboration',
      title: 'Collaboration Workspace',
      description: 'Work together with team members on strategic analyses and share insights.',
      icon: DocumentTextIcon,
      path: '/collaboration'
    },
    {
      id: 'mental-model-advisor',
      title: 'Mental Model Advisor',
      description: 'Get AI recommendations for the best mental models to solve complex problems.',
      icon: SparklesIcon,
      path: '/mental-model-advisor',
      isNew: true
    }
  ];

  useEffect(() => {
    // Load dismissed features from localStorage
    const loadDismissedFeatures = () => {
      const saved = localStorage.getItem('dismissedFeatures');
      if (saved) {
        try {
          setDismissedFeatures(JSON.parse(saved));
        } catch (error) {
          console.error('Error parsing dismissed features:', error);
          setDismissedFeatures([]);
        }
      }
    };

    loadDismissedFeatures();

    // Check if user has seen all features
    const checkFeatureDiscovery = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
          .from('user_profiles')
          .select('preferences')
          .eq('id', user.id)
          .single();

        // If user has preferences and has completed feature discovery, don't show
        if (data?.preferences?.featureDiscoveryCompleted) {
          return;
        }

        // Find a feature that hasn't been dismissed
        const availableFeatures = features.filter(f => !dismissedFeatures.includes(f.id));
        if (availableFeatures.length > 0) {
          // Prioritize new features
          const newFeatures = availableFeatures.filter(f => f.isNew);
          setCurrentFeature(newFeatures.length > 0 ? newFeatures[0] : availableFeatures[0]);
          setShowFeature(true);
        }
      } catch (error) {
        console.error('Error checking feature discovery status:', error);
      }
    };

    // Show feature discovery after a delay
    const timer = setTimeout(() => {
      checkFeatureDiscovery();
    }, 3000);

    return () => clearTimeout(timer);
  }, [dismissedFeatures]);

  const handleDismiss = () => {
    if (currentFeature) {
      const updated = [...dismissedFeatures, currentFeature.id];
      setDismissedFeatures(updated);
      localStorage.setItem('dismissedFeatures', JSON.stringify(updated));
      setShowFeature(false);
      
      // If all features have been dismissed, mark feature discovery as completed
      if (updated.length === features.length) {
        markFeatureDiscoveryCompleted();
      } else {
        // Show next feature after a delay
        setTimeout(() => {
          const nextFeatures = features.filter(f => !updated.includes(f.id));
          if (nextFeatures.length > 0) {
            setCurrentFeature(nextFeatures[0]);
            setShowFeature(true);
          }
        }, 5000);
      }
    }
  };

  const markFeatureDiscoveryCompleted = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('user_profiles')
        .update({
          preferences: {
            featureDiscoveryCompleted: true
          }
        })
        .eq('id', user.id);
    } catch (error) {
      console.error('Error updating feature discovery status:', error);
    }
  };

  return (
    <AnimatePresence>
      {showFeature && currentFeature && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 right-6 z-50 w-80 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden"
        >
          <div className="relative">
            {/* Header with gradient background */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <LightBulbIcon className="h-5 w-5 mr-2" />
                  <h3 className="font-medium">Feature Spotlight</h3>
                </div>
                <button
                  onClick={handleDismiss}
                  className="p-1 rounded-full hover:bg-white/20"
                >
                  <XMarkIcon className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>
            
            {/* Feature content */}
            <div className="p-4">
              <div className="flex items-center mb-3">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <currentFeature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{currentFeature.title}</h4>
                  {currentFeature.isNew && (
                    <span className="inline-block px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
                      New
                    </span>
                  )}
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                {currentFeature.description}
              </p>
              
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    window.location.href = currentFeature.path;
                    handleDismiss();
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Explore Feature
                  <ArrowRightIcon className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FeatureDiscovery;