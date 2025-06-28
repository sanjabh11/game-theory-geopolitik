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
  BookmarkIcon
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
    name: 'Mental Model Advisor',
    description: 'AI-powered decision framework selection',
    icon: LightBulbIcon,
    href: '/mental-model-advisor',
    gradient: 'from-amber-500 via-orange-500 to-yellow-500',
    bgPattern: 'bg-amber-50 dark:bg-amber-950/30',
    iconBg: 'bg-amber-100 dark:bg-amber-900/50',
    badge: 'New'
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
    name: 'Model Library',
    description: 'Explore 40+ mental models',
    icon: BookmarkIcon,
    href: '/model-library',
    gradient: 'from-indigo-500 via-blue-500 to-sky-500',
    bgPattern: 'bg-indigo-50 dark:bg-indigo-950/30',
    iconBg: 'bg-indigo-100 dark:bg-indigo-900/50',
    badge: 'New'
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
          Welcome to the Game Theory Geopolitical Platform. Start exploring strategic analysis tools.
        </p>
      </motion.div>

      {/* Featured Section - Mental Model Advisor */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl shadow-sm border border-amber-200 p-6"
      >
        <div className="flex flex-col md:flex-row items-center">
          <div className="mb-6 md:mb-0 md:mr-6 flex-shrink-0">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
              <LightBulbIcon className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Mental Model Advisor</h2>
            <p className="text-gray-700 mb-4">
              Our new AI-powered system analyzes your problem and recommends the optimal mental models for solving it. 
              Get tailored solutions using frameworks like First Principles, Nash Equilibrium, Systems Thinking, and more.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/mental-model-advisor"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                Try Mental Model Advisor
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
              <Link
                to="/model-library"
                className="inline-flex items-center px-4 py-2 border border-amber-300 text-sm font-medium rounded-md text-amber-700 bg-white hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                Explore Model Library
              </Link>
            </div>
          </div>
        </div>
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
              <p className="text-sm font-medium text-gray-900">Start with the tutorial</p>
              <p className="text-sm text-gray-500">Learn game theory fundamentals</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-medium text-sm">3</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Explore risk assessments</p>
              <p className="text-sm text-gray-500">Analyze current geopolitical situations</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;