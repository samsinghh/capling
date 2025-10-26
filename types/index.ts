// Centralized type definitions for Capling app

// ============================================================================
// DATABASE TYPES
// ============================================================================

export interface Database {
  public: {
    Tables: {
      accounts: {
        Row: Account
        Insert: Omit<Account, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Account, 'id' | 'created_at' | 'updated_at'>>
      }
      transactions: {
        Row: Transaction
        Insert: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Transaction, 'id' | 'created_at' | 'updated_at'>>
      }
      goals: {
        Row: Goal
        Insert: Omit<Goal, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Goal, 'id' | 'created_at' | 'updated_at'>>
      }
      user_profiles: {
        Row: UserProfile
        Insert: Omit<UserProfile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<UserProfile, 'created_at' | 'updated_at'>>
      }
      lessons: {
        Row: Lesson
        Insert: Omit<Lesson, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Lesson, 'id' | 'created_at' | 'updated_at'>>
      }
      capling_levels: {
        Row: CaplingLevel
        Insert: Omit<CaplingLevel, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<CaplingLevel, 'id' | 'created_at' | 'updated_at'>>
      }
      xp_events: {
        Row: XPEvent
        Insert: Omit<XPEvent, 'id' | 'created_at'>
        Update: Partial<Omit<XPEvent, 'id' | 'created_at'>>
      }
      read_lessons: {
        Row: ReadLesson
        Insert: Omit<ReadLesson, 'id' | 'read_at'>
        Update: Partial<Omit<ReadLesson, 'id' | 'read_at'>>
      }
    }
  }
}

// ============================================================================
// CORE ENTITY TYPES
// ============================================================================

export interface Account {
  id: string
  user_id: string
  account_name: string
  account_type: string
  balance: number
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  user_id: string
  account_id: string
  merchant: string
  amount: number
  category: TransactionCategory
  classification: TransactionClassification
  original_classification?: string
  final_classification?: string
  reflection?: string
  improvement_suggestion?: string
  justification?: string
  justification_status: JustificationStatus
  description?: string
  date: string
  timestamp: number
  type: TransactionType
  created_at: string
  updated_at: string
}

export interface Goal {
  id: string
  user_id: string
  title: string
  description?: string
  target_amount: number
  current_amount: number
  emoji: string
  category: string
  target_date?: string
  is_completed: boolean
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  full_name?: string
  avatar_url?: string
  weekly_budget: number
  capling_name?: string
  created_at: string
  updated_at: string
}

export interface Lesson {
  id: string
  user_id: string
  title: string
  content: string
  lesson_type: LessonType
  topic: string
  difficulty_level: DifficultyLevel
  created_at: string
  updated_at: string
}

export interface CaplingLevel {
  id: string
  user_id: string
  current_level: number
  current_xp: number
  total_xp: number
  consecutive_happy_days: number
  lessons_read: number
  last_happiness_check: string
  created_at: string
  updated_at: string
}

export interface XPEvent {
  id: string
  user_id: string
  event_type: XPEventType
  xp_amount: number
  description: string
  metadata?: any
  created_at: string
}

export interface ReadLesson {
  id: string
  user_id: string
  lesson_id: string
  xp_awarded: boolean
  read_at: string
}

// ============================================================================
// ENUM TYPES
// ============================================================================

export type TransactionCategory = 
  | 'shopping' 
  | 'food' 
  | 'transport' 
  | 'bills' 
  | 'dining' 
  | 'entertainment' 
  | 'health' 
  | 'income'

export type TransactionClassification = 
  | 'responsible' 
  | 'irresponsible' 
  | 'neutral'

export type TransactionType = 'debit' | 'credit'

export type JustificationStatus = 
  | 'none' 
  | 'pending' 
  | 'justified' 
  | 'rejected'

export type LessonType = 'tip' | 'vocabulary' | 'concept'

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced'

export type XPEventType = 
  | 'happiness_streak' 
  | 'lesson_read' 
  | 'responsible_purchase' 
  | 'goal_achieved' 
  | 'daily_bonus'

export type CaplingMood = 
  | 'happy' 
  | 'neutral' 
  | 'worried' 
  | 'sad' 
  | 'depressed'

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

export interface CreateTransactionRequest {
  userId: string
  accountId?: string
  merchant: string
  amount: number
  category: TransactionCategory
  description?: string
  timestamp?: number
}

export interface CreateTransactionResponse {
  success: boolean
  transaction: Transaction
  newBalance: number
  analysis: {
    classification: TransactionClassification
    reflection: string
  }
  shouldShowGoalAllocation: boolean
}

export interface AnalyzeTransactionRequest {
  merchant: string
  amount: number
  description?: string
}

export interface AnalyzeTransactionResponse {
  classification: TransactionClassification
  reflection: string
  confidence: number
  reasoning: string
  improvement_suggestion?: string
}

export interface JustifyTransactionRequest {
  transactionId: string
  justification: string
}

export interface JustifyTransactionResponse {
  success: boolean
  transaction: Transaction
  justificationAnalysis: {
    isValid: boolean
    reasoning: string
    newReflection: string
  }
  budgetAdjustment: {
    adjusted: boolean
    newBudget?: number
    reason?: string
  }
}

export interface CreateGoalRequest {
  title: string
  description?: string
  target_amount: number
  emoji?: string
  category?: string
  target_date?: string
}

export interface CompleteOnboardingRequest {
  userId: string
  weeklyBudget: number
  initialBalance: number
  goals?: Array<{
    title: string
    targetAmount: number
    category: string
    emoji: string
  }>
}

// ============================================================================
// UI STATE TYPES
// ============================================================================

export interface SpendingInsights {
  totalSpent: number
  responsiblePercentage: number
  topCategory: string
  transactionCount: number
}

export interface LevelInfo {
  level: number
  xp: number
  totalXp: number
  consecutiveHappyDays: number
  lessonsRead: number
  xpForNextLevel: number
  progressPercentage: number
}

export interface Badge {
  id: string
  title: string
  description: string
  emoji: string
  earned: boolean
  earnedAt?: Date
  category: 'spending' | 'saving' | 'streak' | 'milestone'
}

export interface GoalSuggestion {
  goalId: string
  suggestedAmount: number
  reason: string
  confidence: number
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface ApiError {
  error: string
  details?: string
  code?: string
  hint?: string
}

export interface LoadingState {
  loading: boolean
  error: string | null
}

export interface PaginationParams {
  limit?: number
  offset?: number
}

export interface SortParams {
  field: string
  direction: 'asc' | 'desc'
}
