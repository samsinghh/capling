// Improved auth context with better error handling

'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { logError, logInfo, CaplingError, AuthenticationError } from '@/lib/errors'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  needsOnboarding: boolean
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<{ error: any }>
  completeOnboarding: () => void
  clearAuthState: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [needsOnboarding, setNeedsOnboarding] = useState(false)

  useEffect(() => {
    // Set loading to false immediately to prevent hanging
    setLoading(false)
    
    // Check if Supabase is available in the background
    const checkSupabaseConnection = async () => {
      try {
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          // If we get an invalid refresh token error, clear the session
          if (error.message.includes('Refresh Token') || error.message.includes('Invalid')) {
            logInfo('Invalid/expired token detected, clearing session', 'auth-context')
            await supabase.auth.signOut()
            
            // Clear local storage
            if (typeof window !== 'undefined') {
              localStorage.clear()
              sessionStorage.clear()
            }
            
            setSession(null)
            setUser(null)
            setNeedsOnboarding(false)
            return
          }
          
          logError(error, 'auth-context')
          return
        }
        
        setSession(session)
        setUser(session?.user ?? null)
        
        // Check if user needs onboarding
        if (session?.user) {
          await checkOnboardingStatus(session.user.id)
        }
      } catch (error) {
        logError(error, 'auth-context')
        // Clear session on any error to prevent infinite loops
        setSession(null)
        setUser(null)
        setNeedsOnboarding(false)
      }
    }

    checkSupabaseConnection()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      logInfo(`Auth state change: ${event}`, 'auth-context', { userId: session?.user?.id })
      
      // Handle token refresh errors
      if (event === 'TOKEN_REFRESHED' && !session) {
        logInfo('Token refresh failed, clearing session', 'auth-context')
        await supabase.auth.signOut()
        if (typeof window !== 'undefined') {
          localStorage.clear()
          sessionStorage.clear()
        }
      }
      
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
      
      // Check onboarding status when user changes
      if (session?.user) {
        logInfo('User authenticated, checking onboarding status', 'auth-context')
        checkOnboardingStatus(session.user.id)
      } else {
        logInfo('No user session', 'auth-context')
        setNeedsOnboarding(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkOnboardingStatus = async (userId: string) => {
    try {
      logInfo('Checking onboarding status', 'auth-context', { userId })
      
      // First, verify the user actually exists in auth.users
      const { data: authUser, error: authError } = await supabase.auth.getUser()
      
      if (authError || !authUser.user || authUser.user.id !== userId) {
        logInfo('User not properly authenticated, signing out', 'auth-context')
        await supabase.auth.signOut()
        setNeedsOnboarding(false)
        return
      }
      
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('weekly_budget')
        .eq('id', userId)
        .maybeSingle()
      
      logInfo('Profile check result', 'auth-context', { profile, error })
      
      if (error) {
        logError(error, 'auth-context')
        // If there's an error, assume user needs onboarding
        setNeedsOnboarding(true)
        return
      }
      
      if (!profile || !profile.weekly_budget) {
        logInfo('User needs onboarding', 'auth-context')
        setNeedsOnboarding(true)
      } else {
        logInfo('User onboarding complete', 'auth-context')
        setNeedsOnboarding(false)
      }
    } catch (error) {
      logError(error, 'auth-context')
      setNeedsOnboarding(true)
    }
  }

  const completeOnboarding = () => {
    setNeedsOnboarding(false)
  }

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      logInfo('Starting user signup', 'auth-context', { email, hasFullName: !!fullName })
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })
      
      logInfo('Signup result', 'auth-context', { 
        success: !error, 
        userId: data.user?.id,
        error: error?.message 
      })
      
      if (error) {
        // Provide more user-friendly error messages
        let userMessage = error.message
        
        if (error.message.includes('Database error')) {
          userMessage = 'There was an issue creating your account. Please try again or contact support.'
        } else if (error.message.includes('User already registered')) {
          userMessage = 'An account with this email already exists. Please sign in instead.'
        } else if (error.message.includes('Invalid email')) {
          userMessage = 'Please enter a valid email address.'
        } else if (error.message.includes('Password should be at least')) {
          userMessage = 'Password must be at least 6 characters long.'
        }
        
        return { 
          error: { 
            message: userMessage,
            originalError: error.message 
          } 
        }
      }
      
      // If signup is successful and user is created, set needsOnboarding to true
      if (data.user) {
        logInfo('User created successfully', 'auth-context', { userId: data.user.id })
        setNeedsOnboarding(true)
      }
      
      return { error: null }
    } catch (error) {
      logError(error, 'auth-context')
      return { 
        error: { 
          message: 'Database connection failed. Please make sure Supabase is running and try again.' 
        } 
      }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      logInfo('Starting user signin', 'auth-context', { email })
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        let userMessage = error.message
        
        if (error.message.includes('Invalid login credentials')) {
          userMessage = 'Invalid email or password. Please check your credentials and try again.'
        } else if (error.message.includes('Email not confirmed')) {
          userMessage = 'Please check your email and click the confirmation link before signing in.'
        }
        
        return { 
          error: { 
            message: userMessage,
            originalError: error.message 
          } 
        }
      }
      
      return { error: null }
    } catch (error) {
      logError(error, 'auth-context')
      return { 
        error: { 
          message: 'Database connection failed. Please make sure Supabase is running and try again.' 
        } 
      }
    }
  }

  const signOut = async () => {
    try {
      logInfo('Starting user signout', 'auth-context')
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        logError(error, 'auth-context')
      }
      
      return { error }
    } catch (error) {
      logError(error, 'auth-context')
      return { error }
    }
  }

  const clearAuthState = async () => {
    try {
      logInfo('Clearing auth state', 'auth-context')
      
      // Clear all auth state
      await supabase.auth.signOut()
      
      // Clear local storage
      if (typeof window !== 'undefined') {
        localStorage.clear()
        sessionStorage.clear()
      }
      
      // Reset state
      setUser(null)
      setSession(null)
      setNeedsOnboarding(false)
      
      logInfo('Auth state cleared successfully', 'auth-context')
    } catch (error) {
      logError(error, 'auth-context')
    }
  }

  const value = {
    user,
    session,
    loading,
    needsOnboarding,
    signUp,
    signIn,
    signOut,
    completeOnboarding,
    clearAuthState,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}