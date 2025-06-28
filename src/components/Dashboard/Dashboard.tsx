import React, { useEffect, useState } from 'react';
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
  UserIcon
} from '@heroicons/react/24/outline';
import { supabase } from '../../services/supabase';
import { UserProfile } from '../../types';

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
    name: 'Mental Models',
    description: 'Explore strategic thinking frameworks',
    icon: LightBulbIcon,
    href: '/mental-models',
    gradient: 'from-amber-500 via-yellow-500 to-orange-600',
    bgPattern: 'bg-amber-50 dark:bg-amber-950/30',
    iconBg: 'bg-amber-100 dark:bg-amber-900/50',
    badge: 'Library'
  },
  {
    name: 'Model Advisor',
    description: 'Get AI model recommendations',
    icon: SparklesIcon,
    href: '/mental-model-advisor',
    gradient: 'from-pink-500 via-rose-500 to-red-600',
    bgPattern: 'bg-pink-50 dark:bg-pink-950/30',
    iconBg: 'bg-pink-100 dark:bg-pink-900/50',
    badge: 'AI-Powered'
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
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Fetch user profile
          const { data: profileData } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          setProfile(profileData);
          
          // Fetch recent activity (mock data for now)
          setRecentActivity([
            {
              id: '1',
              type: 'simulation',
              title: 'Trade War Scenario',
              timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
              status: 'completed'
            },
            {
              id: '2',
              type: 'risk',
              title: 'Europe Risk Assessment',
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
              status: 'updated'
            },
            {
              id: '3',
              type: 'tutorial',
              title: 'Nash Equilibrium Module',
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
              status: 'completed'
            },
            {
              id: '4',
              type: 'crisis',
              title: 'Diplomatic Crisis Alert',
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
              status: 'new'
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'simulation': return CpuChipIcon;
      case 'risk': return ShieldExclamationIcon;
      case 'tutorial': return BookOpenIcon;
      case 'crisis': return ExclamationTriangleIcon;
      case 'prediction': return ChartBarIcon;
      default: return DocumentTextIcon;
    }
  };
  
  const getActivityColor = (type: string) => {
    switch (type) {
      case 'simulation': return 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'risk': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400';
      case 'tutorial': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';
      case 'crisis': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      case 'prediction': return 'text-violet-600 bg-violet-100 dark:bg-violet-900/30 dark:text-violet-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400';
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="badge badge-green">Completed</span>;
      case 'updated':
        return <span className="badge badge-blue">Updated</span>;
      case 'new':
        return <span className="badge badge-yellow">New</span>;
      default:
        return <span className="badge badge-gray">In Progress</span>;
    }
  };
  
  const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffSec < 60) {
      return 'just now';
    } else if (diffMin < 60) {
      return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    } else if (diffHour < 24) {
      return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    } else if (diffDay < 7) {
      return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="space-y-8 dashboard-overview">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-6 md:p-8 text-white"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold">Welcome{profile ? `, ${profile.role === 'student' ? 'Student' : profile.role}` : ''}</h1>
            <p className="mt-2 text-blue-100">
              Your strategic analysis and geopolitical insights platform
            </p>
          </div>
          
          {profile && (
            <div className="flex items-center bg-white/10 rounded-xl p-3 backdrop-blur-sm">
              <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center mr-3">
                <UserIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="font-medium">{profile.email}</div>
                <div className="text-sm text-blue-100 capitalize">{profile.role}</div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + (index * 0.1) }}
            className="card card-hover"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${
                stat.name === 'Crisis Alerts' 
                  ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
                  : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
              }`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.name}</p>
                <div className="flex items-center">
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                  <span className={`ml-2 text-sm font-medium ${
                    stat.changeType === 'positive' 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + (index * 0.1) }}
              className="relative group"
            >
              <Link 
                to={action.href}
                className="block h-full"
              >
                <div className={`card card-hover h-full ${action.bgPattern}`}>
                  {/* Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="badge badge-blue">
                      {action.badge}
                    </span>
                  </div>
                  
                  {/* Icon */}
                  <div className={`inline-flex rounded-lg ${action.iconBg} p-3 mb-4`}>
                    <action.icon className="h-6 w-6 text-gray-700 dark:text-gray-200" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{action.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{action.description}</p>
                  
                  {/* Hover effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-50/0 to-purple-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                  
                  {/* Arrow indicator on hover */}
                  <div className="absolute bottom-4 right-4 opacity-0 transform translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    <ArrowRightIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity & Getting Started */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="lg:col-span-2"
        >
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
              <Link 
                to="/profile"
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                View All
              </Link>
            </div>
            
            {loading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="skeleton h-10 w-10 rounded-full"></div>
                    <div className="flex-1">
                      <div className="skeleton h-4 w-3/4 mb-2"></div>
                      <div className="skeleton h-3 w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recentActivity.length === 0 ? (
              <div className="text-center py-8">
                <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity, index) => {
                  const ActivityIcon = getActivityIcon(activity.type);
                  
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 + (index * 0.1) }}
                      className="flex items-start space-x-4"
                    >
                      <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                        <ActivityIcon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {activity.title}
                          </p>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {getRelativeTime(activity.timestamp)}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center">
                          <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                            {activity.type}
                          </span>
                          <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
                          {getStatusBadge(activity.status)}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>

        {/* Getting Started */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="lg:col-span-1"
        >
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Getting Started</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 font-medium text-sm">1</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Complete your profile</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Add your organization and preferences</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 dark:text-purple-400 font-medium text-sm">2</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Start with the tutorial</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Learn game theory fundamentals</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400 font-medium text-sm">3</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Explore mental models</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Discover frameworks for strategic thinking</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                  <span className="text-amber-600 dark:text-amber-400 font-medium text-sm">4</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Try the model advisor</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Get AI recommendations for your problems</p>
                </div>
              </div>
              
              <div className="pt-4">
                <Link
                  to="/tutorial"
                  className="btn btn-primary w-full flex items-center justify-center gap-2"
                >
                  <BookOpenIcon className="h-5 w-5" />
                  Start Learning
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;