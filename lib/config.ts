// Clean, centralized configuration for Capling app

import { APP_CONFIG } from '@/lib/constants'

// ============================================================================
// ENVIRONMENT CONFIGURATION
// ============================================================================

export const ENV_CONFIG = {
  // Supabase configuration
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU',
  },
  
  // OpenAI configuration
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
    maxTokens: 200,
    temperature: 0.1,
    timeout: 10000, // 10 seconds
  },
  
  // App configuration
  app: {
    name: APP_CONFIG.name,
    version: APP_CONFIG.version,
    environment: process.env.NODE_ENV || 'development',
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
  },
  
  // API configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || '',
    timeout: 30000, // 30 seconds
    retries: 3,
  },
  
  // Feature flags
  features: {
    enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    enableDebugMode: process.env.NEXT_PUBLIC_DEBUG_MODE === 'true',
    enableMockData: process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true',
  },
} as const

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

export function validateEnvironment(): void {
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ]
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName])
  
  if (missingVars.length > 0) {
    console.warn(`Missing environment variables: ${missingVars.join(', ')}`)
  }
  
  if (!ENV_CONFIG.openai.apiKey && ENV_CONFIG.app.isProduction) {
    console.warn('OpenAI API key not configured - AI features will not work')
  }
}

// ============================================================================
// CONFIGURATION GETTERS
// ============================================================================

export function getSupabaseConfig() {
  return ENV_CONFIG.supabase
}

export function getOpenAIConfig() {
  return ENV_CONFIG.openai
}

export function getAppConfig() {
  return ENV_CONFIG.app
}

export function getApiConfig() {
  return ENV_CONFIG.api
}

export function getFeatureFlags() {
  return ENV_CONFIG.features
}

// ============================================================================
// CONFIGURATION VALIDATION
// ============================================================================

export function isConfigured(): boolean {
  return !!(
    ENV_CONFIG.supabase.url &&
    ENV_CONFIG.supabase.anonKey &&
    (ENV_CONFIG.openai.apiKey || ENV_CONFIG.features.enableMockData)
  )
}

export function canUseAI(): boolean {
  return !!ENV_CONFIG.openai.apiKey
}

export function shouldUseMockData(): boolean {
  return ENV_CONFIG.features.enableMockData || !canUseAI()
}

// Initialize configuration validation
if (typeof window === 'undefined') {
  validateEnvironment()
}