import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { supabase } from './services/supabase';
import { UserProfile } from './types';

// Layout Components
import Layout from './components/Layout/Layout';
import PublicLayout from './components/Layout/PublicLayout';

// Page Components
import Dashboard from './components/Dashboard/Dashboard';
import GameTheoryTutorial from './components/GameTheory/GameTheoryTutorial';
import RiskAssessment from './components/RiskAssessment/RiskAssessment';
import ScenarioSimulation from './components/Simulation/ScenarioSimulation';
import CrisisMonitoring from './components/Crisis/CrisisMonitoring';
import PredictiveAnalytics from './components/Analytics/PredictiveAnalytics';
import Collaboration from './components/Collaboration/Collaboration';
import ProfilePage from './components/Profile/UserProfile';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

// Mental Model Components
import MentalModelAdvisor from './components/MentalModels/MentalModelAdvisor';
import ModelLibrary from './components/MentalModels/ModelLibrary';

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
    },
  },
});

interface AuthState {
  user: { id: string; email?: string } | null;
  profile: UserProfile | null;
  loading: boolean;
}

function App() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setAuthState(prev => ({ ...prev, user: session.user }));
        loadUserProfile(session.user.id);
      } else {
        setAuthState({ user: null, profile: null, loading: false });
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setAuthState(prev => ({ ...prev, user: session.user }));
        await loadUserProfile(session.user.id);
      } else {
        setAuthState({ user: null, profile: null, loading: false });
      }
    });

    // Safety timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      setAuthState(prev => ({ ...prev, loading: false }));
    }, 5000); // 5 seconds

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      // If profile doesn't exist, create it
      if (error && error.code === 'PGRST116') {
        const { data: newProfile, error: createError } = await supabase
          .from('user_profiles')
          .insert({
            id: userId,
            role: 'researcher', // Default to researcher as you mentioned
            preferences: {},
            notification_settings: {
              email: true,
              push: false,
              sms: false
            }
          })
          .select()
          .single();

        if (!createError) {
          setAuthState(prev => ({
            ...prev,
            profile: newProfile || null,
            loading: false,
          }));
        } else {
          setAuthState(prev => ({ ...prev, profile: null, loading: false }));
        }
      } else {
        setAuthState(prev => ({
          ...prev,
          profile: data || null,
          loading: false,
        }));
      }
    } catch (error) {
      setAuthState(prev => ({ ...prev, profile: null, loading: false }));
    }
  };

  if (authState.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              authState.user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Welcome to Game Theory Platform</h1>
                    <p className="text-xl mb-8">Authentication Status: {authState.user ? 'Logged In' : 'Not Logged In'}</p>
                    <div className="space-x-4">
                      <Link to="/login" className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold">Login</Link>
                      <Link to="/register" className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold">Register</Link>
                    </div>
                  </div>
                </div>
              )
            }
          />
          <Route
            path="/login"
            element={
              authState.user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <PublicLayout>
                  <Login />
                </PublicLayout>
              )
            }
          />
          <Route
            path="/register"
            element={
              authState.user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <PublicLayout>
                  <Register />
                </PublicLayout>
              )
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              authState.user ? (
                <Layout user={authState.user} profile={authState.profile}>
                  <Dashboard />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/tutorial"
            element={
              authState.user ? (
                <Layout user={authState.user} profile={authState.profile}>
                  <GameTheoryTutorial />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/risk-assessment"
            element={
              authState.user ? (
                <Layout user={authState.user} profile={authState.profile}>
                  <RiskAssessment />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/simulation"
            element={
              authState.user ? (
                <Layout user={authState.user} profile={authState.profile}>
                  <ScenarioSimulation />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/crisis-monitoring"
            element={
              authState.user ? (
                <Layout user={authState.user} profile={authState.profile}>
                  <CrisisMonitoring />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/analytics"
            element={
              authState.user ? (
                <Layout user={authState.user} profile={authState.profile}>
                  <PredictiveAnalytics />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/collaboration"
            element={
              authState.user ? (
                <Layout user={authState.user} profile={authState.profile}>
                  <Collaboration />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/mental-models"
            element={
              authState.user ? (
                <Layout user={authState.user} profile={authState.profile}>
                  <MentalModelAdvisor />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/model-library"
            element={
              authState.user ? (
                <Layout user={authState.user} profile={authState.profile}>
                  <ModelLibrary />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/profile"
            element={
              authState.user ? (
                <Layout user={authState.user} profile={authState.profile}>
                  <ProfilePage />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              style: {
                background: '#10b981',
              },
            },
            error: {
              duration: 5000,
              style: {
                background: '#ef4444',
              },
            },
          }}
        />
      </div>
    </QueryClientProvider>
  );
}

export default App;