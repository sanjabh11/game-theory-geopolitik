import React from 'react';
import { motion } from 'framer-motion';

const CollaborativeDocuments: React.FC = () => {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Collaborative Documents</h1>
        <p className="mt-2 text-gray-600">
          Team-based strategy analysis and planning tools.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Coming Soon</h2>
        <p className="text-gray-600">
          Real-time collaborative editing and strategy planning.
        </p>
      </motion.div>
    </div>
  );
};

export default CollaborativeDocuments;
