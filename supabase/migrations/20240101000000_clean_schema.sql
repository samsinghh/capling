-- Clean, consolidated database schema for Capling app
-- This replaces all the scattered migrations with a single, well-organized schema

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- CUSTOM TYPES
-- ============================================================================

-- Transaction categories
CREATE TYPE transaction_category AS ENUM (
  'shopping', 'food', 'transport', 'bills', 'dining', 'entertainment', 'health', 'income'
);

-- Transaction classifications
CREATE TYPE transaction_classification AS ENUM (
  'responsible', 'irresponsible', 'neutral'
);

-- Transaction types
CREATE TYPE transaction_type AS ENUM (
  'debit', 'credit'
);

-- Justification status
CREATE TYPE justification_status AS ENUM (
  'none', 'pending', 'justified', 'rejected'
);

-- Lesson types
CREATE TYPE lesson_type AS ENUM (
  'tip', 'vocabulary', 'concept'
);

-- Difficulty levels
CREATE TYPE difficulty_level AS ENUM (
  'beginner', 'intermediate', 'advanced'
);

-- XP event types
CREATE TYPE xp_event_type AS ENUM (
  'happiness_streak', 'lesson_read', 'responsible_purchase', 'goal_achieved', 'daily_bonus'
);

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- User profiles table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  weekly_budget DECIMAL(12,2) NOT NULL DEFAULT 500.00,
  capling_name TEXT NOT NULL DEFAULT 'Capling',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Accounts table
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  account_name TEXT NOT NULL DEFAULT 'Main Checking',
  account_type TEXT NOT NULL DEFAULT 'checking',
  balance DECIMAL(12,2) NOT NULL DEFAULT 1000.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  merchant TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  category transaction_category NOT NULL DEFAULT 'shopping',
  classification transaction_classification NOT NULL,
  original_classification transaction_classification,
  final_classification transaction_classification,
  reflection TEXT,
  improvement_suggestion TEXT,
  justification TEXT,
  justification_status justification_status NOT NULL DEFAULT 'none',
  description TEXT,
  date TEXT NOT NULL,
  timestamp BIGINT NOT NULL,
  type transaction_type NOT NULL DEFAULT 'debit',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT positive_amount CHECK (amount > 0),
  CONSTRAINT valid_merchant CHECK (length(merchant) > 0 AND length(merchant) <= 100),
  CONSTRAINT valid_description CHECK (description IS NULL OR length(description) <= 500),
  CONSTRAINT valid_justification CHECK (justification IS NULL OR length(justification) <= 1000)
);

-- Goals table
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target_amount DECIMAL(12,2) NOT NULL,
  current_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  emoji TEXT NOT NULL DEFAULT '🎯',
  category TEXT NOT NULL DEFAULT 'general',
  target_date DATE,
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT positive_target_amount CHECK (target_amount > 0),
  CONSTRAINT non_negative_current_amount CHECK (current_amount >= 0),
  CONSTRAINT valid_title CHECK (length(title) > 0 AND length(title) <= 100),
  CONSTRAINT valid_description CHECK (description IS NULL OR length(description) <= 500)
);

-- Lessons table
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  lesson_type lesson_type NOT NULL,
  topic TEXT NOT NULL,
  difficulty_level difficulty_level NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_title CHECK (length(title) > 0 AND length(title) <= 200),
  CONSTRAINT valid_content CHECK (length(content) > 0 AND length(content) <= 2000),
  CONSTRAINT valid_topic CHECK (length(topic) > 0 AND length(topic) <= 50)
);

-- Capling levels table
CREATE TABLE capling_levels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  current_level INTEGER NOT NULL DEFAULT 1,
  current_xp INTEGER NOT NULL DEFAULT 0,
  total_xp INTEGER NOT NULL DEFAULT 0,
  consecutive_happy_days INTEGER NOT NULL DEFAULT 0,
  lessons_read INTEGER NOT NULL DEFAULT 0,
  last_happiness_check TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT positive_level CHECK (current_level > 0),
  CONSTRAINT non_negative_xp CHECK (current_xp >= 0 AND total_xp >= 0),
  CONSTRAINT non_negative_days CHECK (consecutive_happy_days >= 0),
  CONSTRAINT non_negative_lessons CHECK (lessons_read >= 0)
);

-- XP events table
CREATE TABLE xp_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type xp_event_type NOT NULL,
  xp_amount INTEGER NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT positive_xp_amount CHECK (xp_amount > 0),
  CONSTRAINT valid_description CHECK (length(description) > 0 AND length(description) <= 200)
);

-- Read lessons table
CREATE TABLE read_lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  xp_awarded BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one record per user per lesson
  UNIQUE(user_id, lesson_id)
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- User-based indexes
CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_account_id ON transactions(account_id);
CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_lessons_user_id ON lessons(user_id);
CREATE INDEX idx_capling_levels_user_id ON capling_levels(user_id);
CREATE INDEX idx_xp_events_user_id ON xp_events(user_id);
CREATE INDEX idx_read_lessons_user_id ON read_lessons(user_id);

-- Time-based indexes
CREATE INDEX idx_transactions_timestamp ON transactions(timestamp DESC);
CREATE INDEX idx_transactions_date ON transactions(date DESC);
CREATE INDEX idx_xp_events_created_at ON xp_events(created_at DESC);
CREATE INDEX idx_lessons_created_at ON lessons(created_at DESC);

-- Classification indexes
CREATE INDEX idx_transactions_classification ON transactions(classification);
CREATE INDEX idx_transactions_justification_status ON transactions(justification_status);
CREATE INDEX idx_transactions_user_justification ON transactions(user_id, justification_status);

-- Goal indexes
CREATE INDEX idx_goals_completed ON goals(is_completed);
CREATE INDEX idx_goals_category ON goals(category);

-- Lesson indexes
CREATE INDEX idx_lessons_type ON lessons(lesson_type);
CREATE INDEX idx_lessons_difficulty ON lessons(difficulty_level);
CREATE INDEX idx_lessons_topic ON lessons(topic);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE capling_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE read_lessons ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can delete their own profile" ON user_profiles
  FOR DELETE USING (auth.uid() = id);

-- Accounts policies
CREATE POLICY "Users can view their own accounts" ON accounts
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own accounts" ON accounts
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own accounts" ON accounts
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own accounts" ON accounts
  FOR DELETE USING (auth.uid() = user_id);

-- Transactions policies
CREATE POLICY "Users can view their own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own transactions" ON transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own transactions" ON transactions
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own transactions" ON transactions
  FOR DELETE USING (auth.uid() = user_id);

-- Goals policies
CREATE POLICY "Users can view their own goals" ON goals
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own goals" ON goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own goals" ON goals
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own goals" ON goals
  FOR DELETE USING (auth.uid() = user_id);

-- Lessons policies
CREATE POLICY "Users can view their own lessons" ON lessons
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own lessons" ON lessons
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own lessons" ON lessons
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own lessons" ON lessons
  FOR DELETE USING (auth.uid() = user_id);

-- Capling levels policies
CREATE POLICY "Users can view their own capling levels" ON capling_levels
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own capling levels" ON capling_levels
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own capling levels" ON capling_levels
  FOR UPDATE USING (auth.uid() = user_id);

-- XP events policies
CREATE POLICY "Users can view their own xp events" ON xp_events
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own xp events" ON xp_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Read lessons policies
CREATE POLICY "Users can view their own read lessons" ON read_lessons
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own read lessons" ON read_lessons
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own read lessons" ON read_lessons
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamps
CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accounts_updated_at 
  BEFORE UPDATE ON accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at 
  BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_goals_updated_at 
  BEFORE UPDATE ON goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at 
  BEFORE UPDATE ON lessons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_capling_levels_updated_at 
  BEFORE UPDATE ON capling_levels
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user signup with robust error handling
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create user profile with proper error handling
  INSERT INTO user_profiles (id, full_name, capling_name, weekly_budget)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NULL),
    'Capling',
    500.00
  )
  ON CONFLICT (id) DO NOTHING;
  
  -- Create default account with proper error handling
  INSERT INTO accounts (user_id, account_name, account_type, balance)
  VALUES (NEW.id, 'Main Checking', 'checking', 1000.00)
  ON CONFLICT DO NOTHING;
  
  -- Create default capling level with proper error handling
  INSERT INTO capling_levels (user_id, current_level, current_xp, total_xp)
  VALUES (NEW.id, 1, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================================
-- LEVEL SYSTEM FUNCTIONS
-- ============================================================================

-- Function to calculate level from total XP
CREATE OR REPLACE FUNCTION calculate_level_from_xp(total_xp INTEGER)
RETURNS INTEGER AS $$
BEGIN
  -- Level formula: level = floor(total_xp / 50) + 1
  RETURN FLOOR(total_xp / 50.0) + 1;
END;
$$ language 'plpgsql';

-- Function to calculate XP needed for next level
CREATE OR REPLACE FUNCTION xp_needed_for_level(level INTEGER)
RETURNS INTEGER AS $$
BEGIN
  -- XP needed = (level - 1) * 50
  RETURN (level - 1) * 50;
END;
$$ language 'plpgsql';

-- Function to calculate XP needed for current level progress
CREATE OR REPLACE FUNCTION xp_for_current_level_progress(total_xp INTEGER)
RETURNS INTEGER AS $$
DECLARE
  current_level INTEGER;
  xp_for_current_level INTEGER;
  xp_for_next_level INTEGER;
BEGIN
  current_level := calculate_level_from_xp(total_xp);
  xp_for_current_level := xp_needed_for_level(current_level);
  xp_for_next_level := xp_needed_for_level(current_level + 1);
  
  RETURN xp_for_next_level - xp_for_current_level;
END;
$$ language 'plpgsql';

-- Function to calculate current level progress percentage
CREATE OR REPLACE FUNCTION current_level_progress_percentage(total_xp INTEGER)
RETURNS INTEGER AS $$
DECLARE
  current_level INTEGER;
  xp_for_current_level INTEGER;
  xp_for_next_level INTEGER;
  current_level_xp INTEGER;
BEGIN
  current_level := calculate_level_from_xp(total_xp);
  xp_for_current_level := xp_needed_for_level(current_level);
  xp_for_next_level := xp_needed_for_level(current_level + 1);
  current_level_xp := total_xp - xp_for_current_level;
  
  RETURN ROUND((current_level_xp::FLOAT / (xp_for_next_level - xp_for_current_level)) * 100);
END;
$$ language 'plpgsql';