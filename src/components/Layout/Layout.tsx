import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HomeIcon, 
  BookOpenIcon, 
  ShieldExclamationIcon,
  CpuChipIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  DocumentTextIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
  BellIcon,
  MagnifyingGlassIcon,
  Cog6ToothIcon,
  LightBulbIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';
import { supabase } from '../../services/supabase';
import { UserProfile } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import toast from 'react-hot-toast';

interface LayoutProps {
  children: React.ReactNode;
  user: { id: string; email?: string } | null;
  profile: UserProfile | null;
}

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: HomeIcon,
    description: 'Overview and quick actions'
  },
  { 
    name: 'Tutorial', 
    href: '/tutorial', 
    icon: BookOpenIcon,
    description: 'Learn game theory fundamentals'
  },
  { 
    name: 'Risk Assessment', 
    href: '/risk-assessment', 
    icon: ShieldExclamationIcon,
    description: 'Analyze geopolitical risks'
  },
  { 
    name: 'Simulation', 
    href: '/simulation', 
    icon: CpuChipIcon,
    description: 'Model strategic scenarios'
  },
  { 
    name: 'Crisis Monitor', 
    href: '/crisis-monitoring', 
    icon: ExclamationTriangleIcon,
    description: 'Track developing situations'
  },
  { 
    name: 'Analytics', 
    href: '/analytics', 
    icon: ChartBarIcon,
    description: 'Predictive insights'
  },
  { 
    name: 'Collaboration', 
    href: '/collaboration', 
    icon: DocumentTextIcon,
    description: 'Team workspace'
  },
  { 
    name: 'Mental Model Advisor', 
    href: '/mental-model-advisor', 
    icon: LightBulbIcon,
    description: 'AI-powered decision support'
  },
  { 
    name: 'Model Library', 
    href: '/model-library', 
    icon: BookmarkIcon,
    description: 'Browse mental models'
  },
];

// Theme toggle component
const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themeOptions = [
    { value: 'light', icon: SunIcon, label: 'Light' },
    { value: 'dark', icon: MoonIcon, label: 'Dark' },
    { value: 'system', icon: ComputerDesktopIcon, label: 'System' },
  ];

  return (
    <div className="flex items-center space-x-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
      {themeOptions.map((option) => {
        const Icon = option.icon;
        const isActive = theme === option.value;
        
        return (
          <motion.button
            key={option.value}
            onClick={() => setTheme(option.value as any)}
            className={`
              relative p-2 rounded-md transition-all duration-200
              ${isActive 
                ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={option.label}
          >
            <Icon className="h-4 w-4" />
          </motion.button>
        );
      })}
    </div>
  );
};

const Layout: React.FC<LayoutProps> = ({ children, user, profile }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const { resolvedTheme } = useTheme();

  const handleSignOut = async () => {
    try {
      // Force clear local session first
      localStorage.clear();
      sessionStorage.clear();
      
      // Then sign out from Supabase
      await supabase.auth.signOut();
      
      // Force reload to clear all state
      window.location.href = '/';
      
      toast.success('Signed out successfully');
    } catch (error) {
      // Force logout even if there's an error
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/';
    }
  };

  const isCurrentPath = (path: string) => {
    return location.pathname === path;
  };

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: '-100%', opacity: 0 }
  };

  const overlayVariants = {
    open: { opacity: 1 },
    closed: { opacity: 0 }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-800 shadow-2xl"
            >
              {/* Mobile Sidebar Content */}
              <div className="flex h-full flex-col">
                {/* Header */}
                <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700">
                  <motion.h1 
                    className="text-xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    GameTheory Pro
                  </motion.h1>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  </motion.button>
                </div>
                
                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                  {navigation.map((item, index) => {
                    const current = isCurrentPath(item.href);
                    const Icon = item.icon;
                    
                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          to={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`
                            group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200
                            ${current
                              ? 'bg-gradient-to-r from-primary-500 to-purple-600 text-white shadow-lg shadow-primary-500/25'
                              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                            }
                          `}
                        >
                          <Icon className={`h-5 w-5 flex-shrink-0 transition-colors ${
                            current ? 'text-white' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                          }`} />
                          <div className="flex-1">
                            <div className="font-medium">{item.name}</div>
                            <div className={`text-xs ${current ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                              {item.description}
                            </div>
                          </div>
                          {current && (
                            <motion.div
                              layoutId="mobile-active-indicator"
                              className="absolute right-2 h-2 w-2 rounded-full bg-white"
                            />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>
                
                {/* User section */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary-500 to-purple-600 flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {user?.email || 'User'}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {profile?.role || 'Researcher'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <ThemeToggle />
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Cog6ToothIcon className="h-4 w-4" />
                      Settings
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-80 lg:flex-col">
        <motion.div 
          initial={{ x: -320 }}
          animate={{ x: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-xl"
        >
          {/* Header */}
          <div className="flex h-20 items-center justify-between px-8 border-b border-gray-200 dark:border-gray-700">
            <motion.h1 
              className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              GameTheory Pro
            </motion.h1>
            <div className="hidden lg:block">
              <ThemeToggle />
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-6">
            <ul className="space-y-2">
              {navigation.map((item, index) => {
                const current = isCurrentPath(item.href);
                const Icon = item.icon;
                
                return (
                  <motion.li
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + (index * 0.05) }}
                  >
                    <Link
                      to={item.href}
                      className={`
                        group relative flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200
                        ${current
                          ? 'bg-gradient-to-r from-primary-500 to-purple-600 text-white shadow-lg shadow-primary-500/25'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                        }
                      `}
                    >
                      <Icon className={`h-6 w-6 flex-shrink-0 transition-colors ${
                        current ? 'text-white' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                      }`} />
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className={`text-xs ${current ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                          {item.description}
                        </div>
                      </div>
                      {current && (
                        <motion.div
                          layoutId="desktop-active-indicator"
                          className="absolute right-3 h-2 w-2 rounded-full bg-white"
                        />
                      )}
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </nav>
          
          {/* User section */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-primary-500 to-purple-600 flex items-center justify-center shadow-lg">
                <UserIcon className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user?.email || 'User'}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {profile?.role || 'Researcher'}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Link
                to="/profile"
                className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Cog6ToothIcon className="h-4 w-4" />
                Settings
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main content */}
      <div className="lg:pl-80">
        {/* Top header for mobile */}
        <motion.div 
          initial={{ y: -64 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="sticky top-0 z-40 lg:hidden backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700"
        >
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Bars3Icon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              </motion.button>
              <h1 className="text-lg font-semibold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                GameTheory Pro
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <BellIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </motion.button>
              
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary-500 to-purple-600 flex items-center justify-center">
                <UserIcon className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Desktop top bar */}
        <motion.div 
          initial={{ y: -64 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 300, delay: 0.1 }}
          className="hidden lg:block sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700"
        >
          <div className="flex h-16 items-center justify-between px-8">
            <div className="flex-1">
              {/* Breadcrumb or page title can go here */}
            </div>
            
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
              >
                <BellIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Page content */}
        <motion.main 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8"
        >
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default Layout;