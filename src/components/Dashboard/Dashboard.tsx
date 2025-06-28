import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ShieldExclamationIcon, 
  CpuChipIcon, 
  BookOpenIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ArrowRightIcon,
  SparklesIcon,
  FireIcon,
  CheckCircleIcon,
  ClockIcon,
  LightBulbIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

const quickActions = [
  {
    name: 'Game Theory Tutorial',
    description: 'Master strategic thinking fundamentals',
    icon: BookOpenIcon,
    href: '/tutorial',
    gradient: 'from-blue-500 via-purple-500 to-indigo-600',
    bgPattern: 'bg-blue-50 dark:bg-blue-950/30',
    iconBg: 'bg-blue-100 dark:bg-blue-900/50',
    badge: 'Interactive'
  },
  {
    name: 'Risk Assessment',
    description: 'AI-powered geopolitical analysis',
    icon: ShieldExclamationIcon,
    href: '/risk-assessment',
    gradient: 'from-purple-500 via-pink-500 to-red-500',
    bgPattern: 'bg-purple-50 dark:bg-purple-950/30',
    iconBg: 'bg-purple-100 dark:bg-purple-900/50',
    badge: 'Real-time'
  },
  {
    name: 'Scenario Simulation',
    description: 'Model complex strategic outcomes',
    icon: CpuChipIcon,
    href: '/simulation',
    gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
    bgPattern: 'bg-emerald-50 dark:bg-emerald-950/30',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/50',
    badge: 'Advanced'
  },
  {
    name: 'Crisis Monitoring',
    description: 'Track emerging global situations',
    icon: ExclamationTriangleIcon,
    href: '/crisis-monitoring',
    gradient: 'from-orange-500 via-red-500 to-pink-600',
    bgPattern: 'bg-orange-50 dark:bg-orange-950/30',
    iconBg: 'bg-orange-100 dark:bg-orange-900/50',
    badge: 'Live'
  },
  {
    name: 'Predictive Analytics',
    description: 'Forecast trends and patterns',
    icon: ChartBarIcon,
    href: '/analytics',
    gradient: 'from-violet-500 via-purple-500 to-blue-600',
    bgPattern: 'bg-violet-50 dark:bg-violet-950/30',
    iconBg: 'bg-violet-100 dark:bg-violet-900/50',
    badge: 'AI-Powered'
  },
  {
    name: 'Collaboration Hub',
    description: 'Work together on strategic analysis',
    icon: DocumentTextIcon,
    href: '/collaboration',
    gradient: 'from-teal-500 via-cyan-500 to-blue-600',
    bgPattern: 'bg-teal-50 dark:bg-teal-950/30',
    iconBg: 'bg-teal-100 dark:bg-teal-900/50',
    badge: 'Team'
  },
  {
    name: 'Mental Model Advisor',
    description: 'AI-powered decision-making system',
    icon: LightBulbIcon,
    href: '/mental-models',
    gradient: 'from-pink-500 via-purple-500 to-indigo-600',
    bgPattern: 'bg-pink-50 dark:bg-pink-950/30',
    iconBg: 'bg-pink-100 dark:bg-pink-900/50',
    badge: 'NEW'
  },
  {
    name: 'Model Library',
    description: 'Browse 40+ mental models',
    icon: AcademicCapIcon,
    href: '/model-library',
    gradient: 'from-indigo-500 via-blue-500 to-cyan-600',
    bgPattern: 'bg-indigo-50 dark:bg-indigo-950/30',
    iconBg: 'bg-indigo-100 dark:bg-indigo-900/50',
    badge: 'Explore'
  }
];

const stats = [
  {
    name: 'Active Simulations',
    value: '12',
    change: '+4.2%',
    changeType: 'positive',
    icon: CpuChipIcon
  },
  {
    name: 'Risk Assessments',
    value: '89',
    change: '+2.1%',
    changeType: 'positive',
    icon: ShieldExclamationIcon
  },
  {
    name: 'Crisis Alerts',
    value: '3',
    change: '-12%',
    changeType: 'negative',
    icon: ExclamationTriangleIcon
  },
  {
    name: 'Learning Progress',
    value: '76%',
    change: '+8%',
    changeType: 'positive',
    icon: BookOpenIcon
  }
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome to the Game Theory Geopolitical Platform. Start exploring strategic analysis tools and AI-powered decision making.
        </p>
      </motion.div>

      {/* Featured: Mental Model Advisor */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-2xl p-8 text-white relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="flex items-center mb-4">
            <div className="bg-white/20 p-3 rounded-full">
              <LightBulbIcon className="h-8 w-8 text-white" />
            </div>
            <span className="ml-4 bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
              NEW FEATURE
            </span>
          </div>
          <h2 className="text-3xl font-bold mb-4">Mental Model Advisor</h2>
          <p className="text-lg mb-6 text-white/90 max-w-2xl">
            Autonomous decision-making system that selects optimal mental models from our curated library of 40+ frameworks to solve your complex problems.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/mental-models"
              className="inline-flex items-center px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Try Mental Model Advisor
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/model-library"
              className="inline-flex items-center px-6 py-3 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition-colors"
            >
              Browse Model Library
              <AcademicCapIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <motion.a
              key={action.name}
              href={action.href}
              className="group block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <div className="relative rounded-xl bg-white p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300">
                <div className={`inline-flex rounded-lg bg-gradient-to-r ${action.gradient} p-3`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{action.name}</h3>
                <p className="mt-2 text-sm text-gray-600">{action.description}</p>
                
                {/* Badge */}
                <span className={`inline-block mt-3 px-2 py-1 text-xs font-medium rounded-full ${
                  action.badge === 'NEW' ? 'bg-pink-100 text-pink-800' :
                  action.badge === 'Real-time' ? 'bg-green-100 text-green-800' :
                  action.badge === 'Advanced' ? 'bg-purple-100 text-purple-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {action.badge}
                </span>
                
                {/* Hover effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              </div>
            </motion.a>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Getting Started</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-medium text-sm">1</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Complete your profile setup</p>
              <p className="text-sm text-gray-500">Add your organization and preferences</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-medium text-sm">2</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Try the Mental Model Advisor</p>
              <p className="text-sm text-gray-500">Submit a complex problem and get AI-powered solutions</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-medium text-sm">3</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Explore the Model Library</p>
              <p className="text-sm text-gray-500">Browse 40+ mental models for decision-making</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 font-medium text-sm">4</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Start with the tutorial</p>
              <p className="text-sm text-gray-500">Learn game theory fundamentals</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;