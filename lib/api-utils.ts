// Centralized API utilities for Capling app

import { createServerClient } from '@/lib/supabase'
import { 
  CaplingError, 
  AuthenticationError, 
  NotFoundError, 
  DatabaseError,
  logError,
  logInfo,
  withRetry,
  withTimeout
} from '@/lib/errors'
import { VALIDATION } from '@/lib/constants'

// ============================================================================
// DATABASE UTILITIES
// ============================================================================

export async function getUserAccount(userId: string, accountId?: string) {
  const supabase = createServerClient()
  
  try {
    let query = supabase
      .from('accounts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
      .limit(1)

    if (accountId) {
      query = query.eq('id', accountId)
    }

    const { data: accounts, error } = await query

    if (error) {
      throw new DatabaseError(`Failed to fetch account: ${error.message}`, error)
    }

    if (!accounts || accounts.length === 0) {
      // Create default account if none exists
      return await createDefaultAccount(userId)
    }

    return accounts[0]
  } catch (error) {
    logError(error, 'getUserAccount')
    throw error
  }
}

export async function createDefaultAccount(userId: string) {
  const supabase = createServerClient()
  
  try {
    const { data: account, error } = await supabase
      .from('accounts')
      .insert([{
        user_id: userId,
        account_name: 'Main Checking',
        account_type: 'checking',
        balance: VALIDATION.minBudgetAmount * 2 // $2 starting balance
      }])
      .select()
      .single()

    if (error) {
      throw new DatabaseError(`Failed to create account: ${error.message}`, error)
    }

    logInfo('Created default account', 'createDefaultAccount', { userId, accountId: account.id })
    return account
  } catch (error) {
    logError(error, 'createDefaultAccount')
    throw error
  }
}

export async function updateAccountBalance(accountId: string, newBalance: number) {
  const supabase = createServerClient()
  
  try {
    const { error } = await supabase
      .from('accounts')
      .update({ balance: newBalance })
      .eq('id', accountId)

    if (error) {
      throw new DatabaseError(`Failed to update account balance: ${error.message}`, error)
    }

    logInfo('Updated account balance', 'updateAccountBalance', { accountId, newBalance })
  } catch (error) {
    logError(error, 'updateAccountBalance')
    throw error
  }
}

export async function getUserProfile(userId: string) {
  const supabase = createServerClient()
  
  try {
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    if (error) {
      throw new DatabaseError(`Failed to fetch user profile: ${error.message}`, error)
    }

    return profile
  } catch (error) {
    logError(error, 'getUserProfile')
    throw error
  }
}

export async function updateUserProfile(userId: string, updates: any) {
  const supabase = createServerClient()
  
  try {
    const { error } = await supabase
      .from('user_profiles')
      .upsert({
        id: userId,
        ...updates,
        updated_at: new Date().toISOString()
      })

    if (error) {
      throw new DatabaseError(`Failed to update user profile: ${error.message}`, error)
    }

    logInfo('Updated user profile', 'updateUserProfile', { userId, updates })
  } catch (error) {
    logError(error, 'updateUserProfile')
    throw error
  }
}

// ============================================================================
// TRANSACTION UTILITIES
// ============================================================================

export async function createTransaction(transactionData: any) {
  const supabase = createServerClient()
  
  try {
    const { data: transaction, error } = await supabase
      .from('transactions')
      .insert([transactionData])
      .select()
      .single()

    if (error) {
      throw new DatabaseError(`Failed to create transaction: ${error.message}`, error)
    }

    logInfo('Created transaction', 'createTransaction', { 
      transactionId: transaction.id, 
      userId: transaction.user_id,
      amount: transaction.amount 
    })
    
    return transaction
  } catch (error) {
    logError(error, 'createTransaction')
    throw error
  }
}

export async function getTransaction(transactionId: string) {
  const supabase = createServerClient()
  
  try {
    const { data: transaction, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', transactionId)
      .single()

    if (error) {
      throw new DatabaseError(`Failed to fetch transaction: ${error.message}`, error)
    }

    if (!transaction) {
      throw new NotFoundError('Transaction')
    }

    return transaction
  } catch (error) {
    logError(error, 'getTransaction')
    throw error
  }
}

export async function updateTransaction(transactionId: string, updates: any) {
  const supabase = createServerClient()
  
  try {
    const { data: transaction, error } = await supabase
      .from('transactions')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', transactionId)
      .select()
      .single()

    if (error) {
      throw new DatabaseError(`Failed to update transaction: ${error.message}`, error)
    }

    logInfo('Updated transaction', 'updateTransaction', { transactionId, updates })
    return transaction
  } catch (error) {
    logError(error, 'updateTransaction')
    throw error
  }
}

export async function getUserTransactions(userId: string, limit: number = 50) {
  const supabase = createServerClient()
  
  try {
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(limit)

    if (error) {
      throw new DatabaseError(`Failed to fetch transactions: ${error.message}`, error)
    }

    return transactions || []
  } catch (error) {
    logError(error, 'getUserTransactions')
    throw error
  }
}

// ============================================================================
// GOAL UTILITIES
// ============================================================================

export async function getUserGoals(userId: string) {
  const supabase = createServerClient()
  
  try {
    const { data: goals, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new DatabaseError(`Failed to fetch goals: ${error.message}`, error)
    }

    return goals || []
  } catch (error) {
    logError(error, 'getUserGoals')
    throw error
  }
}

export async function createGoal(goalData: any) {
  const supabase = createServerClient()
  
  try {
    const { data: goal, error } = await supabase
      .from('goals')
      .insert([goalData])
      .select()
      .single()

    if (error) {
      throw new DatabaseError(`Failed to create goal: ${error.message}`, error)
    }

    logInfo('Created goal', 'createGoal', { goalId: goal.id, userId: goal.user_id })
    return goal
  } catch (error) {
    logError(error, 'createGoal')
    throw error
  }
}

export async function updateGoal(goalId: string, updates: any) {
  const supabase = createServerClient()
  
  try {
    const { data: goal, error } = await supabase
      .from('goals')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', goalId)
      .select()
      .single()

    if (error) {
      throw new DatabaseError(`Failed to update goal: ${error.message}`, error)
    }

    logInfo('Updated goal', 'updateGoal', { goalId, updates })
    return goal
  } catch (error) {
    logError(error, 'updateGoal')
    throw error
  }
}

// ============================================================================
// LESSON UTILITIES
// ============================================================================

export async function getUserLessons(userId: string) {
  const supabase = createServerClient()
  
  try {
    const { data: lessons, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new DatabaseError(`Failed to fetch lessons: ${error.message}`, error)
    }

    return lessons || []
  } catch (error) {
    logError(error, 'getUserLessons')
    throw error
  }
}

export async function createLesson(lessonData: any) {
  const supabase = createServerClient()
  
  try {
    const { data: lesson, error } = await supabase
      .from('lessons')
      .insert([lessonData])
      .select()
      .single()

    if (error) {
      throw new DatabaseError(`Failed to create lesson: ${error.message}`, error)
    }

    logInfo('Created lesson', 'createLesson', { lessonId: lesson.id, userId: lesson.user_id })
    return lesson
  } catch (error) {
    logError(error, 'createLesson')
    throw error
  }
}

// ============================================================================
// LEVEL SYSTEM UTILITIES
// ============================================================================

export async function getUserCaplingLevel(userId: string) {
  const supabase = createServerClient()
  
  try {
    const { data: levelData, error } = await supabase
      .from('capling_levels')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') { // Not found error
      throw new DatabaseError(`Failed to fetch capling level: ${error.message}`, error)
    }

    if (!levelData) {
      // Create default level data
      return await createDefaultCaplingLevel(userId)
    }

    return levelData
  } catch (error) {
    logError(error, 'getUserCaplingLevel')
    throw error
  }
}

export async function createDefaultCaplingLevel(userId: string) {
  const supabase = createServerClient()
  
  try {
    const { data: levelData, error } = await supabase
      .from('capling_levels')
      .insert([{
        user_id: userId,
        current_level: 1,
        current_xp: 0,
        total_xp: 0,
        consecutive_happy_days: 0,
        lessons_read: 0,
        last_happiness_check: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) {
      throw new DatabaseError(`Failed to create capling level: ${error.message}`, error)
    }

    logInfo('Created default capling level', 'createDefaultCaplingLevel', { userId })
    return levelData
  } catch (error) {
    logError(error, 'createDefaultCaplingLevel')
    throw error
  }
}

export async function addXPEvent(eventData: any) {
  const supabase = createServerClient()
  
  try {
    const { data: event, error } = await supabase
      .from('xp_events')
      .insert([eventData])
      .select()
      .single()

    if (error) {
      throw new DatabaseError(`Failed to create XP event: ${error.message}`, error)
    }

    logInfo('Created XP event', 'addXPEvent', { eventId: event.id, userId: event.user_id })
    return event
  } catch (error) {
    logError(error, 'addXPEvent')
    throw error
  }
}

// ============================================================================
// AUTHENTICATION UTILITIES
// ============================================================================

export function validateUserId(userId: string): void {
  if (!userId || typeof userId !== 'string') {
    throw new AuthenticationError('Valid user ID is required')
  }
}

export function validateUserAccess(userId: string, resourceUserId: string): void {
  if (userId !== resourceUserId) {
    throw new AuthenticationError('Access denied: You can only access your own resources')
  }
}

// ============================================================================
// EXTERNAL SERVICE UTILITIES
// ============================================================================

export async function callOpenAI(prompt: string, options: any = {}) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new CaplingError('OpenAI API key not configured', 'MISSING_API_KEY', 500)
  }

  const defaultOptions = {
    model: 'gpt-3.5-turbo',
    temperature: 0.1,
    max_tokens: 200,
    ...options
  }

  try {
    const response = await withTimeout(
      fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are a helpful financial advisor. Always respond with valid JSON only.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          ...defaultOptions
        })
      }),
      10000, // 10 second timeout
      'OpenAI API call timed out'
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new CaplingError(
        `OpenAI API error: ${response.status}`,
        'OPENAI_API_ERROR',
        response.status,
        errorData
      )
    }

    const data = await response.json()
    return data
  } catch (error) {
    logError(error, 'callOpenAI')
    throw error
  }
}
