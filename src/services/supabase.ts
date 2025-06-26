import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { 
  UserProfile, 
  LearningProgress, 
  RiskAssessment, 
  ScenarioSimulation, 
  AlertConfiguration,
  CrisisEvent,
  HistoricalPattern,
  EconomicModel,
  SentimentData,
  ModelPerformance,
  DiplomaticCommunication,
  CollaborativeDocument
} from '../types';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Database service class with comprehensive methods
export class DatabaseService {
  private client: SupabaseClient;

  constructor() {
    this.client = supabase;
  }

  // User Profile Management
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await this.client
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      return null;
    }

    return data;
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<boolean> {
    const { error } = await this.client
      .from('user_profiles')
      .update(updates)
      .eq('id', userId);

    if (error) {
      return false;
    }

    return true;
  }

  async createUserProfile(profile: Omit<UserProfile, 'created_at' | 'updated_at'>): Promise<boolean> {
    const { error } = await this.client
      .from('user_profiles')
      .insert(profile);

    if (error) {
      return false;
    }

    return true;
  }

  // Learning Progress Management
  async getLearningProgress(userId: string): Promise<LearningProgress[]> {
    const { data, error } = await this.client
      .from('learning_progress')
      .select('*')
      .eq('user_id', userId)
      .order('last_accessed', { ascending: false });

    if (error) {
      return [];
    }

    return data || [];
  }

  async updateLearningProgress(progress: Partial<LearningProgress> & { user_id: string; module_id: string }): Promise<boolean> {
    const { error } = await this.client
      .from('learning_progress')
      .upsert(progress);

    if (error) {
      return false;
    }

    return true;
  }

  // Risk Assessment Management
  async getRiskAssessments(regions?: string[]): Promise<RiskAssessment[]> {
    let query = this.client
      .from('risk_assessments')
      .select('*')
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (regions && regions.length > 0) {
      query = query.in('region', regions);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching risk assessments:', error);
      return [];
    }

    return data || [];
  }

  async createRiskAssessment(assessment: Omit<RiskAssessment, 'id' | 'created_at'>): Promise<string | null> {
    const { data, error } = await this.client
      .from('risk_assessments')
      .insert(assessment)
      .select('id')
      .single();

    if (error) {
      console.error('Error creating risk assessment:', error);
      return null;
    }

    return data?.id || null;
  }

  // Scenario Simulation Management
  async getScenarioSimulations(userId: string): Promise<ScenarioSimulation[]> {
    const { data, error } = await this.client
      .from('scenario_simulations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching scenario simulations:', error);
      return [];
    }

    return data || [];
  }

  async createScenarioSimulation(simulation: Omit<ScenarioSimulation, 'id' | 'created_at'>): Promise<string | null> {
    const { data, error } = await this.client
      .from('scenario_simulations')
      .insert(simulation)
      .select('id')
      .single();

    if (error) {
      console.error('Error creating scenario simulation:', error);
      return null;
    }

    return data?.id || null;
  }

  async updateScenarioSimulation(id: string, updates: Partial<ScenarioSimulation>): Promise<boolean> {
    const { error } = await this.client
      .from('scenario_simulations')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating scenario simulation:', error);
      return false;
    }

    return true;
  }

  // Alert Configuration Management
  async getAlertConfigurations(userId: string): Promise<AlertConfiguration[]> {
    const { data, error } = await this.client
      .from('alert_configurations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching alert configurations:', error);
      return [];
    }

    return data || [];
  }

  async createAlertConfiguration(alert: Omit<AlertConfiguration, 'id' | 'created_at' | 'updated_at'>): Promise<string | null> {
    const { data, error } = await this.client
      .from('alert_configurations')
      .insert(alert)
      .select('id')
      .single();

    if (error) {
      console.error('Error creating alert configuration:', error);
      return null;
    }

    return data?.id || null;
  }

  async updateAlertConfiguration(id: string, updates: Partial<AlertConfiguration>): Promise<boolean> {
    const { error } = await this.client
      .from('alert_configurations')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating alert configuration:', error);
      return false;
    }

    return true;
  }

  async deleteAlertConfiguration(id: string): Promise<boolean> {
    const { error } = await this.client
      .from('alert_configurations')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting alert configuration:', error);
      return false;
    }

    return true;
  }

  // Crisis Events Management
  async getCrisisEvents(limit: number = 50, severity?: number): Promise<CrisisEvent[]> {
    let query = this.client
      .from('crisis_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (severity) {
      query = query.gte('severity', severity);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching crisis events:', error);
      return [];
    }

    return data || [];
  }

  async createCrisisEvent(event: Omit<CrisisEvent, 'id' | 'created_at'>): Promise<string | null> {
    const { data, error } = await this.client
      .from('crisis_events')
      .insert(event)
      .select('id')
      .single();

    if (error) {
      console.error('Error creating crisis event:', error);
      return null;
    }

    return data?.id || null;
  }

  // Historical Patterns Management
  async getHistoricalPatterns(patternType?: string): Promise<HistoricalPattern[]> {
    let query = this.client
      .from('historical_patterns')
      .select('*')
      .order('statistical_significance', { ascending: false });

    if (patternType) {
      query = query.eq('pattern_type', patternType);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching historical patterns:', error);
      return [];
    }

    return data || [];
  }

  // Economic Models Management
  async getEconomicModels(scenarioId?: string): Promise<EconomicModel[]> {
    let query = this.client
      .from('economic_models')
      .select('*')
      .order('created_at', { ascending: false });

    if (scenarioId) {
      query = query.eq('scenario_id', scenarioId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching economic models:', error);
      return [];
    }

    return data || [];
  }

  async createEconomicModel(model: Omit<EconomicModel, 'id' | 'created_at'>): Promise<string | null> {
    const { data, error } = await this.client
      .from('economic_models')
      .insert(model)
      .select('id')
      .single();

    if (error) {
      console.error('Error creating economic model:', error);
      return null;
    }

    return data?.id || null;
  }

  // Sentiment Data Management
  async getSentimentData(platform?: string, region?: string, limit: number = 100): Promise<SentimentData[]> {
    let query = this.client
      .from('sentiment_data')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (platform) {
      query = query.eq('platform', platform);
    }

    if (region) {
      query = query.eq('region', region);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching sentiment data:', error);
      return [];
    }

    return data || [];
  }

  async createSentimentData(sentiment: Omit<SentimentData, 'id' | 'created_at'>): Promise<string | null> {
    const { data, error } = await this.client
      .from('sentiment_data')
      .insert(sentiment)
      .select('id')
      .single();

    if (error) {
      console.error('Error creating sentiment data:', error);
      return null;
    }

    return data?.id || null;
  }

  // Model Performance Management
  async getModelPerformance(modelName?: string): Promise<ModelPerformance[]> {
    let query = this.client
      .from('model_performance')
      .select('*')
      .order('created_at', { ascending: false });

    if (modelName) {
      query = query.eq('model_name', modelName);
    }

    const { data, error } = await query;

    if (error) {
      return [];
    }

    return data || [];
  }

  // Diplomatic Communications Management
  async getDiplomaticCommunications(sourceCountry?: string, targetCountry?: string): Promise<DiplomaticCommunication[]> {
    let query = this.client
      .from('diplomatic_communications')
      .select('*')
      .order('communication_date', { ascending: false });

    if (sourceCountry) {
      query = query.eq('source_country', sourceCountry);
    }

    if (targetCountry) {
      query = query.eq('target_country', targetCountry);
    }

    const { data, error } = await query;

    if (error) {
      return [];
    }

    return data || [];
  }

  // Collaborative Documents Management
  async getCollaborativeDocuments(userId: string): Promise<CollaborativeDocument[]> {
    const { data, error } = await this.client
      .from('collaborative_documents')
      .select('*')
      .or(`owner_id.eq.${userId},collaborators.cs.{${userId}}`)
      .order('updated_at', { ascending: false });

    if (error) {
      return [];
    }

    return data || [];
  }

  async createCollaborativeDocument(document: Omit<CollaborativeDocument, 'id' | 'created_at' | 'updated_at'>): Promise<string | null> {
    const { data, error } = await this.client
      .from('collaborative_documents')
      .insert(document)
      .select('id')
      .single();

    if (error) {
      return null;
    }

    return data?.id || null;
  }

  async updateCollaborativeDocument(id: string, updates: Partial<CollaborativeDocument>): Promise<boolean> {
    const { error } = await this.client
      .from('collaborative_documents')
      .update(updates)
      .eq('id', id);

    if (error) {
      return false;
    }

    return true;
  }

  // Real-time Subscriptions
  subscribeToRiskUpdates(callback: (payload: any) => void) {
    return this.client
      .channel('risk_updates')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'risk_assessments' 
      }, callback)
      .subscribe();
  }

  subscribeToCrisisEvents(callback: (payload: any) => void) {
    return this.client
      .channel('crisis_events')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'crisis_events' 
      }, callback)
      .subscribe();
  }

  subscribeToSimulationUpdates(userId: string, callback: (payload: any) => void) {
    return this.client
      .channel('simulation_updates')
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'scenario_simulations',
        filter: `user_id=eq.${userId}`
      }, callback)
      .subscribe();
  }

  // Clean up expired data
  async cleanupExpiredData(): Promise<void> {
    const now = new Date().toISOString();
    
    // Clean up expired risk assessments
    await this.client
      .from('risk_assessments')
      .delete()
      .lt('expires_at', now);

    // Clean up expired crisis events
    await this.client
      .from('crisis_events')
      .delete()
      .lt('expires_at', now);

    // Clean up expired economic models
    await this.client
      .from('economic_models')
      .delete()
      .lt('expires_at', now);
  }

  // Search functionality
  async searchDocuments(query: string, userId: string): Promise<CollaborativeDocument[]> {
    const { data, error } = await this.client
      .from('collaborative_documents')
      .select('*')
      .or(`owner_id.eq.${userId},collaborators.cs.{${userId}}`)
      .textSearch('title', query);

    if (error) {
      return [];
    }

    return data || [];
  }

  async searchCrisisEvents(query: string): Promise<CrisisEvent[]> {
    const { data, error } = await this.client
      .from('crisis_events')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      return [];
    }

    return data || [];
  }
}

// Create singleton instance
export const db = new DatabaseService();

// Authentication helpers
export const auth = {
  signUp: (email: string, password: string) => 
    supabase.auth.signUp({ email, password }),
  
  signIn: (email: string, password: string) => 
    supabase.auth.signInWithPassword({ email, password }),
  
  signOut: () => supabase.auth.signOut(),
  
  getCurrentUser: () => supabase.auth.getUser(),
  
  onAuthStateChange: (callback: (event: string, session: any) => void) =>
    supabase.auth.onAuthStateChange(callback)
};

export default supabase;
