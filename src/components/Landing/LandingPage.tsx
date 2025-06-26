import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon, 
  ShieldExclamationIcon, 
  CpuChipIcon, 
  BookOpenIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Interactive Game Theory',
    description: 'Learn strategic decision-making through AI-powered tutorials and real-world scenarios.',
    icon: BookOpenIcon,
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    name: 'Real-Time Risk Assessment',
    description: 'Live geopolitical risk scoring with multi-factor analysis and trend visualization.',
    icon: ShieldExclamationIcon,
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    name: 'Scenario Simulation',
    description: 'Multi-party geopolitical modeling with Nash equilibrium calculations.',
    icon: CpuChipIcon,
    gradient: 'from-green-500 to-teal-500'
  },
  {
    name: 'Crisis Monitoring',
    description: 'Automated alerts for developing situations with escalation analysis.',
    icon: ExclamationTriangleIcon,
    gradient: 'from-orange-500 to-red-500'
  },
  {
    name: 'Predictive Analytics',
    description: 'Investment-focused forecasting with economic impact modeling.',
    icon: ChartBarIcon,
    gradient: 'from-indigo-500 to-purple-500'
  },
  {
    name: 'Collaborative Planning',
    description: 'Team-based strategy analysis with real-time collaboration tools.',
    icon: DocumentTextIcon,
    gradient: 'from-pink-500 to-rose-500'
  }
];

const stats = [
  { name: 'Global Regions Monitored', value: '195+' },
  { name: 'Prediction Accuracy', value: '75%' },
  { name: 'Course Completion Rate', value: '90%' },
  { name: 'Real-time Updates', value: '24/7' }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

const LandingPage: React.FC = () => {
  return (
    <div className="relative isolate overflow-hidden">
      {/* Hero Section */}
      <div className="relative px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-4xl py-16 sm:py-24 lg:py-32">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.h1 
              className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Master{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Game Theory
              </span>
              {' '}& Predict{' '}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
                Geopolitics
              </span>
            </motion.h1>
            
            <motion.p 
              className="mt-6 text-lg leading-8 text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              The world's most advanced platform combining game theory education with real-time geopolitical prediction capabilities. 
              Understand and forecast international relations through mathematical modeling and AI-driven insights.
            </motion.p>
            
            <motion.div 
              className="mt-10 flex items-center justify-center gap-x-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/register"
                  className="group relative overflow-hidden rounded-md bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-lg font-semibold text-white shadow-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-300"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Get Started
                    <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/login"
                  className="text-lg font-semibold leading-6 text-white hover:text-blue-400 transition-colors duration-200"
                >
                  Sign In <span aria-hidden="true">→</span>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <motion.div 
        className="mx-auto max-w-7xl px-6 lg:px-8 py-16"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.name}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <motion.div 
                className="text-3xl font-bold text-white lg:text-4xl"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {stat.value}
              </motion.div>
              <div className="mt-2 text-sm text-gray-400">{stat.name}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div 
        className="mx-auto max-w-7xl px-6 lg:px-8 py-24"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div className="mx-auto max-w-2xl text-center" variants={itemVariants}>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Powerful Features for Strategic Thinking
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Comprehensive tools for mastering game theory and understanding geopolitical dynamics.
          </p>
        </motion.div>
        
        <motion.div 
          className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none"
          variants={containerVariants}
        >
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <motion.div
                key={feature.name}
                className="group relative"
                variants={itemVariants}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <div className="relative rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-8 hover:bg-white/10 transition-all duration-300">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                    <div className={`rounded-lg bg-gradient-to-r ${feature.gradient} p-2`}>
                      <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-300">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                  
                  {/* Hover effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            ))}
          </dl>
        </motion.div>
      </motion.div>

      {/* CTA Section */}
      <motion.div 
        className="mx-auto max-w-7xl px-6 lg:px-8 py-24"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur-sm border border-white/10 px-6 py-24 text-center shadow-2xl sm:px-16">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to Master Strategic Thinking?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
            Join thousands of students, analysts, and policymakers using our platform to understand complex geopolitical dynamics.
          </p>
          
          <motion.div 
            className="mt-10 flex items-center justify-center gap-x-6"
            whileHover={{ scale: 1.05 }}
          >
            <Link
              to="/register"
              className="group rounded-md bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-lg font-semibold text-white shadow-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                Start Your Journey
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </span>
            </Link>
          </motion.div>
          
          {/* Background decoration */}
          <div className="absolute -top-24 right-0 -z-10 transform-gpu blur-3xl" aria-hidden="true">
            <div className="aspect-[1404/767] w-[87.75rem] bg-gradient-to-r from-blue-600/25 to-purple-600/25 opacity-25" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
