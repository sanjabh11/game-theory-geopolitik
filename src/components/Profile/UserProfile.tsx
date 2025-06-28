import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../services/supabase';
import { UserProfile as UserProfileType } from '../../types';
import { 
  UserIcon, 
  BellIcon, 
  CogIcon, 
  ShieldCheckIcon, 
  DocumentTextIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    role: '',
    organization: '',
    preferences: {
      theme: 'system',
      dashboardLayout: 'default',
      emailNotifications: true,
      pushNotifications: false
    }
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error('User not authenticated');
        }

        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          throw new Error(error.message);
        }

        setProfile(data);
        setFormData({
          role: data.role || 'researcher',
          organization: data.organization || '',
          preferences: data.preferences || {
            theme: 'system',
            dashboardLayout: 'default',
            emailNotifications: true,
            pushNotifications: false
          }
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError(error instanceof Error ? error.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('user_profiles')
        .update({
          role: formData.role,
          organization: formData.organization,
          preferences: formData.preferences,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        throw new Error(error.message);
      }

      // Refresh profile data
      const { data, error: fetchError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      setProfile(data);
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    if (profile) {
      setFormData({
        role: profile.role || 'researcher',
        organization: profile.organization || '',
        preferences: profile.preferences || {
          theme: 'system',
          dashboardLayout: 'default',
          emailNotifications: true,
          pushNotifications: false
        }
      });
    }
    setEditing(false);
  };

  const getCompletionPercentage = (): number => {
    if (!profile) return 0;
    
    let total = 2; // Role and email are required
    let completed = 2; // Role and email are always present
    
    if (profile.organization) completed += 1;
    total += 1;
    
    // Add other profile fields as needed
    
    return Math.round((completed / total) * 100);
  };

  if (loading && !profile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
        <p className="mt-2 text-gray-600">
          Manage your account settings and preferences.
        </p>
      </motion.div>

      {/* Profile Completion */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Profile Completion</h2>
          <span className="text-sm text-gray-500">{getCompletionPercentage()}% Complete</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${getCompletionPercentage()}%` }}
          ></div>
        </div>
        
        {getCompletionPercentage() < 100 && (
          <p className="mt-2 text-sm text-gray-600">
            Complete your profile to get the most out of the platform.
          </p>
        )}
      </motion.div>

      {/* Profile Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Profile Information</h2>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
            >
              <PencilIcon className="h-4 w-4" />
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={cancelEdit}
                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
              >
                <XMarkIcon className="h-4 w-4" />
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors"
              >
                <CheckIcon className="h-4 w-4" />
                Save
              </button>
            </div>
          )}
        </div>

        {!editing ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <UserIcon className="h-10 w-10 text-white" />
              </div>
              
              <div>
                <h3 className="text-lg font-medium">{profile?.email}</h3>
                <p className="text-gray-500 capitalize">{profile?.role || 'Researcher'}</p>
                {profile?.organization && (
                  <p className="text-gray-500">{profile.organization}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Role</h4>
                <p className="capitalize">{profile?.role || 'Researcher'}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Organization</h4>
                <p>{profile?.organization || 'Not specified'}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Theme Preference</h4>
                <p className="capitalize">{profile?.preferences?.theme || 'System'}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Dashboard Layout</h4>
                <p className="capitalize">{profile?.preferences?.dashboardLayout || 'Default'}</p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="student">Student</option>
                  <option value="professor">Professor</option>
                  <option value="analyst">Analyst</option>
                  <option value="policymaker">Policymaker</option>
                  <option value="researcher">Researcher</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">
                  Organization
                </label>
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  value={formData.organization}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your organization"
                />
              </div>
              
              <div>
                <label htmlFor="preferences.theme" className="block text-sm font-medium text-gray-700 mb-1">
                  Theme Preference
                </label>
                <select
                  id="preferences.theme"
                  name="preferences.theme"
                  value={formData.preferences.theme}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="preferences.dashboardLayout" className="block text-sm font-medium text-gray-700 mb-1">
                  Dashboard Layout
                </label>
                <select
                  id="preferences.dashboardLayout"
                  name="preferences.dashboardLayout"
                  value={formData.preferences.dashboardLayout}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="default">Default</option>
                  <option value="compact">Compact</option>
                  <option value="expanded">Expanded</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">Notification Preferences</h4>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="preferences.emailNotifications"
                  name="preferences.emailNotifications"
                  checked={formData.preferences.emailNotifications}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="preferences.emailNotifications" className="ml-2 block text-sm text-gray-700">
                  Email Notifications
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="preferences.pushNotifications"
                  name="preferences.pushNotifications"
                  checked={formData.preferences.pushNotifications}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="preferences.pushNotifications" className="ml-2 block text-sm text-gray-700">
                  Push Notifications
                </label>
              </div>
            </div>
          </form>
        )}
      </motion.div>

      {/* Account Security */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <ShieldCheckIcon className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold">Account Security</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <div>
              <h3 className="font-medium">Password</h3>
              <p className="text-sm text-gray-500">Last changed: Never</p>
            </div>
            <button className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
              Change Password
            </button>
          </div>
          
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <div>
              <h3 className="font-medium">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-500">Not enabled</p>
            </div>
            <button className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
              Enable 2FA
            </button>
          </div>
          
          <div className="flex justify-between items-center py-3">
            <div>
              <h3 className="font-medium">Active Sessions</h3>
              <p className="text-sm text-gray-500">1 active session</p>
            </div>
            <button className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
              Manage Sessions
            </button>
          </div>
        </div>
      </motion.div>

      {/* Notification Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <BellIcon className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold">Notification Settings</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <div>
              <h3 className="font-medium">Risk Assessment Alerts</h3>
              <p className="text-sm text-gray-500">Receive alerts when risk levels change</p>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="risk-alerts"
                checked={profile?.notification_settings?.email || false}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                readOnly
              />
            </div>
          </div>
          
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <div>
              <h3 className="font-medium">Crisis Notifications</h3>
              <p className="text-sm text-gray-500">Receive alerts for new crisis events</p>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="crisis-alerts"
                checked={profile?.notification_settings?.email || false}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                readOnly
              />
            </div>
          </div>
          
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <div>
              <h3 className="font-medium">Collaboration Updates</h3>
              <p className="text-sm text-gray-500">Receive updates on collaborative workspaces</p>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="collab-alerts"
                checked={profile?.notification_settings?.email || false}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                readOnly
              />
            </div>
          </div>
          
          <div className="flex justify-between items-center py-3">
            <div>
              <h3 className="font-medium">System Announcements</h3>
              <p className="text-sm text-gray-500">Receive platform updates and announcements</p>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="system-alerts"
                checked={profile?.notification_settings?.email || false}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                readOnly
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Data Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <DocumentTextIcon className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold">Data Management</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <div>
              <h3 className="font-medium">Export Your Data</h3>
              <p className="text-sm text-gray-500">Download all your data in JSON format</p>
            </div>
            <button className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
              Export Data
            </button>
          </div>
          
          <div className="flex justify-between items-center py-3">
            <div>
              <h3 className="font-medium text-red-600">Delete Account</h3>
              <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
            </div>
            <button className="px-3 py-1.5 text-sm bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserProfile;