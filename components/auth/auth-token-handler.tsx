// Utility component to handle auth token errors

'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export function AuthTokenHandler() {
  const [cleared, setCleared] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const clearAuthState = async () => {
    setLoading(true)
    try {
      // Sign out from Supabase
      await supabase.auth.signOut()
      
      // Clear all local storage
      if (typeof window !== 'undefined') {
        localStorage.clear()
        sessionStorage.clear()
      }
      
      setCleared(true)
      
      // Reload the page after a short delay
      setTimeout(() => {
        window.location.href = '/'
      }, 1500)
    } catch (error) {
      console.error('Error clearing auth state:', error)
    } finally {
      setLoading(false)
    }
  }

  // Auto-clear on mount if there's a refresh token error
  useEffect(() => {
    const checkAndClearInvalidToken = async () => {
      try {
        const { error } = await supabase.auth.getSession()
        if (error && (error.message.includes('Refresh Token') || error.message.includes('Invalid'))) {
          await clearAuthState()
        }
      } catch (error) {
        console.error('Error checking token:', error)
      }
    }
    
    checkAndClearInvalidToken()
  }, [])

  if (cleared) {
    return (
      <Alert variant="default">
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          Auth state cleared successfully! Redirecting...
        </AlertDescription>
      </Alert>
    )
  }

  return null
}

export function ClearAuthButton() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleClear = async () => {
    setLoading(true)
    try {
      await supabase.auth.signOut()
      
      if (typeof window !== 'undefined') {
        localStorage.clear()
        sessionStorage.clear()
      }
      
      setSuccess(true)
      
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error) {
      console.error('Error clearing auth:', error)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Alert variant="default">
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>Session cleared! Reloading...</AlertDescription>
      </Alert>
    )
  }

  return (
    <Button 
      onClick={handleClear} 
      disabled={loading}
      variant="outline"
      size="sm"
    >
      {loading ? (
        <>
          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          Clearing...
        </>
      ) : (
        <>
          <RefreshCw className="mr-2 h-4 w-4" />
          Clear Session
        </>
      )}
    </Button>
  )
}
