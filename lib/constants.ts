// Centralized constants for Capling app

// ============================================================================
// APP CONFIGURATION
// ============================================================================

export const APP_CONFIG = {
  name: 'Capling',
  version: '1.0.0',
  defaultWeeklyBudget: 500,
  defaultInitialBalance: 1000,
  currency: 'USD',
  maxTransactionAmount: 10000,
  minTransactionAmount: 0.01,
} as const

// ============================================================================
// LEVEL SYSTEM CONSTANTS
// ============================================================================

export const LEVEL_CONFIG = {
  xpPerLevel: 50,
  maxLevel: 100,
  levelTitles: {
    1: 'Capling Beginner',
    5: 'Financial Learner',
    10: 'Budget Builder',
    15: 'Money Manager',
    20: 'Smart Saver',
    30: 'Budget Expert',
    40: 'Investment Guru',
    50: 'Financial Master',
  },
  levelColors: {
    1: 'from-gray-500 to-gray-600',
    5: 'from-pink-500 to-red-500',
    10: 'from-red-500 to-orange-500',
    15: 'from-orange-500 to-yellow-500',
    20: 'from-yellow-500 to-green-600',
    30: 'from-green-600 to-blue-600',
    40: 'from-blue-600 to-purple-600',
    50: 'from-purple-600 to-pink-600',
  },
  xpRewards: {
    lesson_read: 25,
    responsible_purchase: 15,
    goal_achieved: 50,
    daily_bonus: 5,
    happiness_streak: 10, // per day, max 100
  },
} as const

// ============================================================================
// TRANSACTION CATEGORIES
// ============================================================================

export const TRANSACTION_CATEGORIES = {
  shopping: { label: 'Shopping', icon: '🛍️', color: 'blue' },
  food: { label: 'Food', icon: '🍎', color: 'green' },
  transport: { label: 'Transport', icon: '🚗', color: 'purple' },
  bills: { label: 'Bills', icon: '📄', color: 'red' },
  dining: { label: 'Dining', icon: '🍽️', color: 'orange' },
  entertainment: { label: 'Entertainment', icon: '🎬', color: 'pink' },
  health: { label: 'Health', icon: '🏥', color: 'teal' },
  income: { label: 'Income', icon: '💰', color: 'emerald' },
} as const

// ============================================================================
// GOAL CATEGORIES
// ============================================================================

export const GOAL_CATEGORIES = {
  general: { label: 'General', emoji: '🎯', color: 'blue' },
  travel: { label: 'Travel', emoji: '✈️', color: 'cyan' },
  emergency: { label: 'Emergency Fund', emoji: '🆘', color: 'red' },
  education: { label: 'Education', emoji: '📚', color: 'purple' },
  home: { label: 'Home', emoji: '🏠', color: 'green' },
  car: { label: 'Car', emoji: '🚗', color: 'orange' },
  health: { label: 'Health', emoji: '💊', color: 'teal' },
  entertainment: { label: 'Entertainment', emoji: '🎬', color: 'pink' },
} as const

// ============================================================================
// LESSON CONFIGURATION
// ============================================================================

export const LESSON_CONFIG = {
  types: {
    tip: { label: 'Tip', emoji: '💡', color: 'yellow' },
    vocabulary: { label: 'Vocabulary', emoji: '📚', color: 'blue' },
    concept: { label: 'Concept', emoji: '🎓', color: 'purple' },
  },
  difficulties: {
    beginner: { label: 'Beginner', color: 'green' },
    intermediate: { label: 'Intermediate', color: 'yellow' },
    advanced: { label: 'Advanced', color: 'red' },
  },
  topics: [
    'budgeting',
    'investing',
    'debt management',
    'saving',
    'credit',
    'insurance',
    'retirement',
    'taxes',
    'real estate',
    'entrepreneurship',
  ],
} as const

// ============================================================================
// BADGE DEFINITIONS
// ============================================================================

export const BADGE_DEFINITIONS = [
  {
    id: 'first-transaction',
    title: 'Getting Started',
    description: 'Made your first transaction',
    emoji: '🎯',
    category: 'milestone' as const,
    condition: (data: any) => data.transactions.length >= 1,
  },
  {
    id: 'smart-spender',
    title: 'Smart Spender',
    description: 'Stayed under budget for a week',
    emoji: '💰',
    category: 'spending' as const,
    condition: (data: any) => data.weeklySpending <= data.weeklyBudget,
  },
  {
    id: 'coffee-lover',
    title: 'Coffee Lover',
    description: 'Made 5+ coffee purchases',
    emoji: '☕',
    category: 'spending' as const,
    condition: (data: any) => data.coffeeTransactions.length >= 5,
  },
  {
    id: 'responsible-shopper',
    title: 'Responsible Shopper',
    description: 'Made 10+ responsible purchases',
    emoji: '🛡️',
    category: 'spending' as const,
    condition: (data: any) => data.responsibleTransactions.length >= 10,
  },
  {
    id: 'account-builder',
    title: 'Account Builder',
    description: 'Built your account balance to $1000+',
    emoji: '🏦',
    category: 'saving' as const,
    condition: (data: any) => data.currentBalance >= 1000,
  },
  {
    id: 'transaction-tracker',
    title: 'Transaction Tracker',
    description: 'Tracked 25+ transactions',
    emoji: '📊',
    category: 'milestone' as const,
    condition: (data: any) => data.transactions.length >= 25,
  },
  {
    id: 'budget-master',
    title: 'Budget Master',
    description: 'Mastered your budget management',
    emoji: '👑',
    category: 'spending' as const,
    condition: (data: any) => data.transactions.length >= 20 && data.weeklySpending <= data.weeklyBudget,
  },
  {
    id: 'goal-crusher',
    title: 'Goal Crusher',
    description: 'Making progress toward your goals',
    emoji: '🎯',
    category: 'saving' as const,
    condition: (data: any) => data.transactions.length >= 15,
  },
] as const

// ============================================================================
// MOOD CONFIGURATION
// ============================================================================

export const MOOD_CONFIG = {
  happy: {
    color: 'from-green-400 to-emerald-500',
    emoji: '😊',
    message: 'Great job! Keep it up!',
    threshold: 70,
  },
  neutral: {
    color: 'from-blue-400 to-cyan-500',
    emoji: '😐',
    message: 'You\'re doing okay!',
    threshold: 45,
  },
  worried: {
    color: 'from-yellow-400 to-orange-500',
    emoji: '😟',
    message: 'Let\'s be more careful!',
    threshold: 25,
  },
  sad: {
    color: 'from-red-400 to-pink-500',
    emoji: '😢',
    message: 'We can do better!',
    threshold: 0,
  },
  depressed: {
    color: 'from-gray-600 to-gray-800',
    emoji: '💔',
    message: 'We need to fix this!',
    threshold: -1, // Special case for negative balance
  },
} as const

// ============================================================================
// MERCHANT MAPPINGS FOR GOAL SUGGESTIONS
// ============================================================================

export const MERCHANT_MAPPINGS = {
  'starbucks': ['general'],
  'mcdonald\'s': ['general'],
  'target': ['home', 'general'],
  'walmart': ['home', 'general'],
  'amazon': ['home', 'general', 'entertainment'],
  'netflix': ['entertainment'],
  'spotify': ['entertainment'],
  'apple': ['general', 'entertainment'],
  'google': ['general', 'entertainment'],
  'uber': ['transport', 'general'],
  'lyft': ['transport', 'general'],
  'shell': ['transport', 'car'],
  'exxon': ['transport', 'car'],
  'whole foods': ['health', 'general'],
  'trader joe\'s': ['health', 'general'],
  'chipotle': ['general'],
  'pizza hut': ['general', 'entertainment'],
  'domino\'s': ['general', 'entertainment'],
  'gucci': ['general', 'entertainment'],
  'nike': ['general', 'health'],
  'adidas': ['general', 'health'],
  'zara': ['general'],
  'h&m': ['general'],
  'uniqlo': ['general'],
} as const

export const CATEGORY_MAPPINGS = {
  'shopping': ['general', 'home', 'entertainment'],
  'food': ['general', 'health'],
  'transport': ['general', 'car'],
  'bills': ['general', 'home', 'emergency'],
  'dining': ['general', 'entertainment'],
  'entertainment': ['entertainment', 'general'],
  'health': ['health', 'emergency'],
  'income': ['general', 'emergency', 'savings'],
} as const

// ============================================================================
// API ENDPOINTS
// ============================================================================

export const API_ENDPOINTS = {
  transactions: '/api/process-transaction',
  analyze: '/api/analyze-transaction',
  justify: '/api/justify-transaction',
  accounts: '/api/create-account',
  onboarding: '/api/complete-onboarding',
  lessons: '/api/lessons',
  generateLesson: '/api/generate-daily-lesson',
  caplingLevels: '/api/capling-levels',
  updateBudget: '/api/update-budget',
  updateCaplingName: '/api/update-capling-name',
  markLessonRead: '/api/mark-lesson-read',
} as const

// ============================================================================
// VALIDATION CONSTANTS
// ============================================================================

export const VALIDATION = {
  minPasswordLength: 8,
  maxPasswordLength: 128,
  minBudgetAmount: 1,
  maxBudgetAmount: 10000,
  minGoalAmount: 1,
  maxGoalAmount: 1000000,
  maxMerchantLength: 100,
  maxDescriptionLength: 500,
  maxJustificationLength: 1000,
} as const

// ============================================================================
// UI CONSTANTS
// ============================================================================

export const UI_CONFIG = {
  animationDuration: 300,
  toastDuration: 5000,
  debounceDelay: 500,
  maxRetries: 3,
  itemsPerPage: 10,
  maxRecentTransactions: 5,
  maxGoalsDisplay: 6,
} as const
