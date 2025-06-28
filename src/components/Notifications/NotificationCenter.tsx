import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BellIcon, 
  XMarkIcon, 
  CheckIcon, 
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ShieldExclamationIcon,
  ChartBarIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';
import { supabase } from '../../services/supabase';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category: 'system' | 'risk' | 'crisis' | 'prediction' | 'simulation';
  read: boolean;
  created_at: string;
}

const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // If no notifications in database, use mock data
      if (!data || data.length === 0) {
        setNotifications(getMockNotifications());
      } else {
        setNotifications(data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Use mock data as fallback
      setNotifications(getMockNotifications());
    } finally {
      setLoading(false);
    }
  };

  const getMockNotifications = (): Notification[] => {
    return [
      {
        id: '1',
        title: 'Risk Level Change',
        message: 'Risk level for Europe has increased from Moderate to High',
        type: 'warning',
        category: 'risk',
        read: false,
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 minutes ago
      },
      {
        id: '2',
        title: 'New Crisis Alert',
        message: 'Diplomatic tensions escalating in Eastern Europe',
        type: 'error',
        category: 'crisis',
        read: false,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 hours ago
      },
      {
        id: '3',
        title: 'Simulation Complete',
        message: 'Your Trade War scenario simulation has completed',
        type: 'success',
        category: 'simulation',
        read: true,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() // 5 hours ago
      },
      {
        id: '4',
        title: 'New Prediction Available',
        message: 'Updated economic predictions for USA are now available',
        type: 'info',
        category: 'prediction',
        read: true,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1 day ago
      },
      {
        id: '5',
        title: 'System Update',
        message: 'Platform has been updated to version 2.1.0',
        type: 'info',
        category: 'system',
        read: true,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() // 2 days ago
      }
    ];
  };

  const markAsRead = async (id: string) => {
    try {
      // Update local state immediately for better UX
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
      
      // Update in database
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id)
        .eq('user_id', user.id);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // Update local state immediately
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      
      // Update in database
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      // Update local state immediately
      setNotifications(prev => 
        prev.filter(notification => notification.id !== id)
      );
      
      // Delete from database
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('notifications')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getTypeIcon = (type: string, category: string) => {
    // First check category
    switch (category) {
      case 'risk':
        return ShieldExclamationIcon;
      case 'crisis':
        return ExclamationTriangleIcon;
      case 'prediction':
        return ChartBarIcon;
      case 'simulation':
        return CpuChipIcon;
      default:
        // Fall back to type
        switch (type) {
          case 'success':
            return CheckIcon;
          case 'warning':
            return ExclamationTriangleIcon;
          case 'error':
            return XMarkIcon;
          case 'info':
          default:
            return InformationCircleIcon;
        }
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-600';
      case 'warning':
        return 'bg-yellow-100 text-yellow-600';
      case 'error':
        return 'bg-red-100 text-red-600';
      case 'info':
      default:
        return 'bg-blue-100 text-blue-600';
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

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : filter === 'unread'
      ? notifications.filter(n => !n.read)
      : notifications.filter(n => n.category === filter);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <BellIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
            {unreadCount}
          </span>
        )}
      </button>
      
      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="font-medium">Notifications</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  Mark all as read
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <XMarkIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>
            
            {/* Filters */}
            <div className="p-2 border-b border-gray-200 dark:border-gray-700 flex items-center gap-1 overflow-x-auto">
              <button
                onClick={() => setFilter('all')}
                className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                  filter === 'all' 
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                  filter === 'unread' 
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Unread
              </button>
              <button
                onClick={() => setFilter('risk')}
                className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                  filter === 'risk' 
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Risk
              </button>
              <button
                onClick={() => setFilter('crisis')}
                className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                  filter === 'crisis' 
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Crisis
              </button>
              <button
                onClick={() => setFilter('prediction')}
                className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                  filter === 'prediction' 
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Predictions
              </button>
            </div>
            
            {/* Notification List */}
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">Loading notifications...</p>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <BellIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No notifications found</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredNotifications.map((notification) => {
                    const Icon = getTypeIcon(notification.type, notification.category);
                    
                    return (
                      <motion.li
                        key={notification.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-750 ${
                          !notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className={`flex-shrink-0 rounded-full p-2 ${getTypeColor(notification.type)}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {notification.title}
                              </p>
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {getRelativeTime(notification.created_at)}
                                </span>
                                <button
                                  onClick={() => deleteNotification(notification.id)}
                                  className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                                >
                                  <XMarkIcon className="h-3 w-3 text-gray-400" />
                                </button>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                              {notification.message}
                            </p>
                            <div className="mt-2 flex justify-between items-center">
                              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 capitalize">
                                {notification.category}
                              </span>
                              {!notification.read && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                                >
                                  Mark as read
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    );
                  })}
                </ul>
              )}
            </div>
            
            {/* Footer */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-center">
              <button
                onClick={() => {/* Navigate to notifications page */}}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                View all notifications
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;