// Improved auth form with better error handling

'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react'
import { DinosaurIcon } from '@/components/dinosaur-icon'
import { AuthTokenHandler } from '@/components/auth/auth-token-handler'
import { logError, logInfo } from '@/lib/errors'

export function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [supabaseError, setSupabaseError] = useState<string | null>(null)

  const { signUp, signIn } = useAuth()

  // Check if Supabase is available
  React.useEffect(() => {
    const checkSupabase = async () => {
      try {
        const response = await fetch('http://127.0.0.1:54321/rest/v1/', {
          method: 'HEAD',
        })
        if (!response.ok) {
          setSupabaseError('Supabase is not running. Please start it with: supabase start')
        } else {
          setSupabaseError(null)
        }
      } catch (error) {
        setSupabaseError('Supabase is not running. Please start it with: supabase start')
      }
    }
    checkSupabase()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      logInfo(`Starting ${isSignUp ? 'signup' : 'signin'}`, 'auth-form', { email })
      
      if (isSignUp) {
        const { error } = await signUp(email, password, fullName)
        if (error) {
          setError(error.message)
          logError(error, 'auth-form')
        } else {
          setMessage('Account created successfully! Please check your email for the confirmation link.')
          logInfo('Signup successful', 'auth-form', { email })
        }
      } else {
        const { error } = await signIn(email, password)
        if (error) {
          setError(error.message)
          logError(error, 'auth-form')
        } else {
          setMessage('Signed in successfully!')
          logInfo('Signin successful', 'auth-form', { email })
        }
      }
    } catch (error) {
      const errorMessage = 'An unexpected error occurred. Please try again.'
      setError(errorMessage)
      logError(error, 'auth-form')
    } finally {
      setLoading(false)
    }
  }

  const clearMessages = () => {
    setError(null)
    setMessage(null)
  }

  const switchMode = (newIsSignUp: boolean) => {
    setIsSignUp(newIsSignUp)
    clearMessages()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 flex items-center justify-center p-4">
      <AuthTokenHandler />
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <DinosaurIcon className="w-12 h-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to Capling</CardTitle>
          <CardDescription>
            {isSignUp ? 'Create your account to start your financial journey' : 'Sign in to continue your financial journey'}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {/* Supabase Connection Error */}
          {supabaseError && (
            <Alert className="mb-4" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{supabaseError}</AlertDescription>
            </Alert>
          )}

          {/* Success Message */}
          {message && (
            <Alert className="mb-4" variant="default">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {/* Error Message */}
          {error && (
            <Alert className="mb-4" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs value={isSignUp ? 'signup' : 'signin'} onValueChange={(value) => switchMode(value === 'signup')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-fullname">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-fullname"
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                      minLength={6}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Password must be at least 6 characters long
                  </p>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => switchMode(!isSignUp)}
                className="text-primary hover:underline"
              >
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}