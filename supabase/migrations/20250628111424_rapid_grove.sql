/*
# Add Notifications Table

1. New Tables
  - `notifications` - Stores user notifications for the platform
    - `id` (uuid, primary key)
    - `user_id` (uuid, references auth.users)
    - `title` (text)
    - `message` (text)
    - `type` (text - info, success, warning, error)
    - `category` (text - system, risk, crisis, prediction, simulation)
    - `read` (boolean)
    - `created_at` (timestamp)
    - `metadata` (jsonb)

2. Security
  - Enable RLS on `notifications` table
  - Add policies for users to manage their own notifications
*/

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error')),
  category TEXT NOT NULL CHECK (category IN ('system', 'risk', 'crisis', 'prediction', 'simulation')),
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Enable Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own notifications" 
  ON notifications FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
  ON notifications FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert notifications" 
  ON notifications FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their notifications" 
  ON notifications FOR DELETE 
  USING (auth.uid() = user_id);