import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10"
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
          <motion.div 
            className="flex lg:flex-1"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link to="/" className="-m-1.5 p-1.5">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                GameTheory Platform
              </span>
            </Link>
          </motion.div>
          
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400"
            >
              <span className="sr-only">Open main menu</span>
            </button>
          </div>
          
          <div className="hidden lg:flex lg:gap-x-12">
            <Link 
              to="/login" 
              className="text-sm font-semibold leading-6 text-white hover:text-blue-400 transition-colors duration-200"
            >
              Sign In
            </Link>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/register"
                className="rounded-md bg-gradient-to-r from-blue-600 to-purple-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-blue-500 hover:to-purple-500 transition-all duration-200"
              >
                Get Started
              </Link>
            </motion.div>
          </div>
        </nav>
      </motion.header>

      {/* Main content */}
      <main className="relative">
        {children}
      </main>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-80 h-80 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl" />
        <div className="absolute top-80 -left-32 w-80 h-80 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-3xl" />
        <div className="absolute bottom-40 right-1/3 w-80 h-80 rounded-full bg-gradient-to-r from-blue-600/10 to-cyan-600/10 blur-3xl" />
      </div>
    </div>
  );
};

export default PublicLayout;
