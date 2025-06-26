import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  UsersIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { geminiApi } from '../../services/geminiApi';

interface ActionItem {
  task: string;
  assignee: string;
  priority: 'High' | 'Medium' | 'Low';
  deadline: string;
}

interface CollaborationData {
  insights: string[];
  recommendations: string[];
  actionItems: ActionItem[];
  riskFactors: string[];
}

const Collaboration: React.FC = () => {
  const [collaborationData, setCollaborationData] = useState<CollaborationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState('AI Development');
  const [participants, setParticipants] = useState('Alice, Bob, Charlie');

  const fetchCollaborationInsights = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await geminiApi.generateCollaborationInsights({
        topic,
        participants: participants.split(', '),
        context: 'Developing a new AI model for predictive analytics and risk assessment.',
        objectives: ['Improve model accuracy', 'Integrate with existing systems']
      });

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to generate collaboration insights');
      }

      setCollaborationData(response.data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Collaboration Insights</h1>
        <p className="mt-2 text-gray-600">
          Facilitating effective collaboration through strategic insights and actionable plans.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Collaboration Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Participants</label>
            <input
              type="text"
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. Alice, Bob, Charlie"
            />
          </div>
        </div>

        <button
          onClick={fetchCollaborationInsights}
          className="mt-6 w-full md:w-auto inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Generate Insights
        </button>
      </motion.div>

      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center"
        >
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating collaboration insights...</p>
        </motion.div>
      ) : error ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-50 rounded-xl border border-red-200 p-8 text-center"
        >
          <p className="text-red-600">{error}</p>
        </motion.div>
      ) : collaborationData ? (
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <UsersIcon className="h-6 w-6 mr-2 text-blue-600" />
              Strategic Insights
            </h2>
            <ul className="list-disc ml-5 space-y-1">
              {collaborationData.insights.map((insight, index) => (
                <li key={index} className="text-gray-700">
                  {insight}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <ChatBubbleLeftRightIcon className="h-6 w-6 mr-2 text-green-600" />
              Recommendations
            </h2>
            <ul className="list-disc ml-5 space-y-1">
              {collaborationData.recommendations.map((recommendation, index) => (
                <li key={index} className="text-gray-700">
                  {recommendation}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <ClipboardDocumentListIcon className="h-6 w-6 mr-2 text-yellow-600" />
              Action Items
            </h2>
            <ul className="list-disc ml-5 space-y-1">
              {collaborationData.actionItems.map((item, index) => (
                <li key={index} className="text-gray-700">
                  <strong>{item.task}</strong> - {item.assignee} ({item.priority} priority, deadline: {item.deadline})
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <ExclamationTriangleIcon className="h-6 w-6 mr-2 text-red-600" />
              Risk Factors
            </h2>
            <ul className="list-disc ml-5 space-y-1">
              {collaborationData.riskFactors.map((factor, index) => (
                <li key={index} className="text-gray-700">
                  {factor}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      ) : null}
    </div>
  );
};

export default Collaboration;

