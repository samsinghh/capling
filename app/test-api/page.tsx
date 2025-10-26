'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Play, CheckCircle, XCircle, Loader2, Home } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useSupabaseData } from '@/hooks/use-supabase-data'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

function TestAPIContent() {
  const { user } = useAuth()
  const { currentAccount, loading: dataLoading } = useSupabaseData()

  // Set page title
  useEffect(() => {
    document.title = 'Capling - Test API'
  }, [])
  
  const router = useRouter()
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [transactionForm, setTransactionForm] = useState({
    merchant: '',
    amount: '',
    category: 'shopping',
    description: ''
  })
  const [depositForm, setDepositForm] = useState({
    amount: '',
    description: ''
  })

  if (!user) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">API Testing Dashboard</h1>
          <p className="text-muted-foreground">Please sign in to test the API</p>
          <Link href="/">
            <Button><Home className="mr-2 h-4 w-4" />Go to Main App</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (dataLoading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold">API Testing Dashboard</h1>
          <p className="text-muted-foreground">Loading your account...</p>
        </div>
      </div>
    )
  }

  const addResult = (test: string, success: boolean, data: any, error?: string) => {
    setResults(prev => [...prev, {
      id: Date.now(),
      test,
      success,
      data,
      error,
      timestamp: new Date().toLocaleString()
    }])
  }

  const simulateCustomTransaction = async () => {
    setLoading(true)
    try {
      // Validate form
      if (!transactionForm.merchant || !transactionForm.amount) {
        addResult('Custom Transaction', false, null, 'Please fill in merchant and amount')
        setLoading(false)
        return
      }

      const amount = parseFloat(transactionForm.amount)
      if (isNaN(amount) || amount <= 0) {
        addResult('Custom Transaction', false, null, 'Please enter a valid amount')
        setLoading(false)
        return
      }

      console.log('🔍 Simulating custom transaction:', transactionForm)

      // Use the same API that the "Add Transaction" button uses
      const response = await fetch('/api/process-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          merchant: transactionForm.merchant,
          amount: amount,
          category: transactionForm.category,
          description: transactionForm.description || transactionForm.merchant
        })
      })

      let result
      try {
        result = await response.json()
      } catch {
        result = { error: `HTTP ${response.status}: ${response.statusText}` }
      }
      addResult(`Simulate ${transactionForm.merchant} Transaction`, response.ok, result, response.ok ? undefined : result.error)
      
      // Clear form on success
      if (response.ok) {
        setTransactionForm({
          merchant: '',
          amount: '',
          category: 'shopping',
          description: ''
        })
        
        // Redirect to main page for goal allocation if needed
        if (result.shouldShowGoalAllocation) {
          // Store transaction data in sessionStorage for the main page to pick up
          sessionStorage.setItem('pendingGoalAllocation', JSON.stringify({
            amount: amount,
            merchant: transactionForm.merchant,
            category: transactionForm.category
          }))
          // Redirect to main page
          router.push('/')
        }
      }
    } catch (error) {
      addResult('Custom Transaction', false, null, error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const makeDeposit = async () => {
    setLoading(true)
    try {
      // Validate form
      if (!depositForm.amount) {
        addResult('Deposit', false, null, 'Please enter deposit amount')
        return
      }

      const amount = parseFloat(depositForm.amount)
      if (isNaN(amount) || amount <= 0) {
        addResult('Deposit', false, null, 'Please enter a valid positive amount')
        return
      }

      console.log('Making deposit:', { amount, description: depositForm.description })

      const response = await fetch('/api/process-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          merchant: 'Deposit',
          amount: -amount, // Negative amount to make it a credit (deposit)
          category: 'income',
          description: depositForm.description || 'Test deposit'
        })
      })

      let result
      try {
        result = await response.json()
      } catch {
        result = { error: `HTTP ${response.status}: ${response.statusText}` }
      }
      
      if (response.ok) {
        addResult('Deposit', true, result, `Successfully deposited $${amount}`)
        // Clear form
        setDepositForm({ amount: '', description: '' })
      } else {
        addResult('Deposit', false, result, result.error || 'Deposit failed')
      }
    } catch (error) {
      console.error('Deposit error:', error)
      addResult('Deposit', false, null, `Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">API Testing Dashboard</h1>
              <p className="text-muted-foreground">Test the Capling API system</p>
            </div>
            <Link href="/">
              <Button variant="outline">
                <Home className="mr-2 h-4 w-4" />
                Back to App
              </Button>
            </Link>
          </div>

          {/* User Info */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-2">Account Information</h2>
            <div className="space-y-1 text-sm">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>User ID:</strong> {user.id}</p>
              <p><strong>Account Status:</strong> {currentAccount ? 'Active' : 'No account found'}</p>
              <p><strong>Balance:</strong> ${currentAccount?.balance?.toFixed(2) || '0.00'}</p>
              {!currentAccount && (
                <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded text-yellow-800 dark:text-yellow-200">
                  <p className="text-xs">
                    Note: If you just completed onboarding, try refreshing the page or going back to the main app first.
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Transaction Form */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Create Custom Transaction</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="merchant">Merchant</Label>
                  <Input
                    id="merchant"
                    placeholder="e.g., Starbucks, Amazon, Shell Gas"
                    value={transactionForm.merchant}
                    onChange={(e) => setTransactionForm(prev => ({ ...prev, merchant: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="e.g., 5.50, 25.99"
                    value={transactionForm.amount}
                    onChange={(e) => setTransactionForm(prev => ({ ...prev, amount: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={transactionForm.category} onValueChange={(value) => setTransactionForm(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="shopping">Shopping</SelectItem>
                      <SelectItem value="dining">Dining</SelectItem>
                      <SelectItem value="transport">Transport</SelectItem>
                      <SelectItem value="entertainment">Entertainment</SelectItem>
                      <SelectItem value="food">Food</SelectItem>
                      <SelectItem value="health">Health</SelectItem>
                      <SelectItem value="bills">Bills</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input
                    id="description"
                    placeholder="e.g., Morning coffee, Gas fill-up"
                    value={transactionForm.description}
                    onChange={(e) => setTransactionForm(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
              </div>
              
              <Button 
                onClick={simulateCustomTransaction} 
                disabled={loading || !transactionForm.merchant || !transactionForm.amount} 
                className="w-full bg-primary text-lg py-6"
              >
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Play className="mr-2 h-5 w-5" />}
                Simulate Transaction
              </Button>
            </div>
          </Card>

          {/* Deposit Form */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Make Deposit</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="deposit-amount">Amount ($)</Label>
                  <Input
                    id="deposit-amount"
                    type="number"
                    step="0.01"
                    placeholder="e.g., 100.00, 500.00"
                    value={depositForm.amount}
                    onChange={(e) => setDepositForm(prev => ({ ...prev, amount: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deposit-description">Description (Optional)</Label>
                  <Input
                    id="deposit-description"
                    placeholder="e.g., Paycheck, Gift, Refund"
                    value={depositForm.description}
                    onChange={(e) => setDepositForm(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Current Balance: ${currentAccount?.balance?.toFixed(2) || '0.00'}</span>
                {currentAccount?.balance && currentAccount.balance < 0 && (
                  <Badge variant="destructive">In Debt</Badge>
                )}
              </div>
              
              {/* Quick Deposit Buttons */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Quick Deposits:</Label>
                <div className="flex flex-wrap gap-2">
                  {[100, 250, 500, 1000].map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      onClick={() => setDepositForm(prev => ({ ...prev, amount: amount.toString() }))}
                      disabled={loading}
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>
              </div>
              
              <Button 
                onClick={makeDeposit} 
                disabled={loading || !depositForm.amount} 
                className="w-full bg-green-600 hover:bg-green-700 text-lg py-6"
              >
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Play className="mr-2 h-5 w-5" />}
                Make Deposit
              </Button>
            </div>
          </Card>

          {/* Results */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            {results.length === 0 ? (
              <p className="text-muted-foreground">No tests run yet. Click a test button above to get started.</p>
            ) : (
              <div className="space-y-4">
                {results.map((result) => (
                  <div key={result.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {result.success ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                        <span className="font-medium">{result.test}</span>
                        <Badge variant={result.success ? "default" : "destructive"}>
                          {result.success ? "PASS" : "FAIL"}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">{result.timestamp}</span>
                    </div>
                    
                    {result.error && (
                      <div className="mb-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-sm text-red-800 dark:text-red-200">
                        <strong>Error:</strong> {result.error}
                      </div>
                    )}
                    
                    {result.data && (
                      <div className="bg-muted p-3 rounded text-sm">
                        <pre className="whitespace-pre-wrap overflow-auto">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* API Documentation */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">API Endpoints</h2>
            <div className="space-y-3 text-sm">
              <div>
                <h3 className="font-medium">POST /api/process-transaction</h3>
                <p className="text-muted-foreground">Process a transaction with AI analysis</p>
              </div>
              <div>
                <h3 className="font-medium">POST /api/justify-transaction</h3>
                <p className="text-muted-foreground">Justify an irresponsible transaction</p>
              </div>
              <div>
                <h3 className="font-medium">POST /api/complete-onboarding</h3>
                <p className="text-muted-foreground">Complete user onboarding</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function TestAPIPage() {
  return (
    <ProtectedRoute>
      <TestAPIContent />
    </ProtectedRoute>
  )
}

