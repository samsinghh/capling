// Main dashboard component - cleaned up and modularized

'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CaplingCharacter } from "@/components/capling-character"
import { BudgetProgress } from "@/components/budget-progress"
import { SummaryCard } from "@/components/summary-card"
import { TransactionItem, type Transaction } from "@/components/transaction-item"
import { JustificationModal } from "@/components/justification-modal"
import { GoalCard } from "@/components/goal-card"
import { BadgeCard } from "@/components/badge-card"
import { Wallet, Target, TrendingUp, Plus, Home, Receipt, Trophy, RefreshCw, BookOpen } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSupabaseData } from "@/hooks/use-supabase-data"
import { useGoals, type Goal } from "@/hooks/use-goals"
import { useBadges } from "@/hooks/use-badges"
import { BadgeNotification } from "@/components/badge-notification"
import { AddTransactionModal } from "@/components/add-transaction-modal"
import { GoalModal } from "@/components/goal-modal"
import { GoalAllocationModal } from "@/components/goal-allocation-modal"
import { DinosaurIcon } from "@/components/dinosaur-icon"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserMenu } from "@/components/auth/user-menu"
import { AuthForm } from "@/components/auth/auth-form"
import { OnboardingForm } from "@/components/onboarding-form"
import { LearnTab } from "@/components/learn-tab"
import { useAuth } from "@/contexts/auth-context"
import { useGoalAllocation } from "@/contexts/goal-allocation-context"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardHero } from "@/components/dashboard/dashboard-hero"
import { DashboardSummary } from "@/components/dashboard/dashboard-summary"
import { DashboardTransactions } from "@/components/dashboard/dashboard-transactions"
import { DashboardGoals } from "@/components/dashboard/dashboard-goals"
import { LoadingState } from "@/components/ui/loading-state"
import { ErrorState } from "@/components/ui/error-state"

export default function CaplingApp() {
  return (
    <ProtectedRoute>
      <AppRouter />
    </ProtectedRoute>
  )
}

function AppRouter() {
  const { user, needsOnboarding, completeOnboarding, clearAuthState } = useAuth()

  // If Supabase is available but user is not logged in, show auth form
  if (!user) {
    return <AuthForm />
  }

  // If user needs onboarding, show onboarding form
  if (needsOnboarding) {
    return (
      <OnboardingForm 
        userId={user?.id || ''}
        userEmail={user?.email || ''}
        onComplete={async () => {
          completeOnboarding()
          // Small delay to ensure database changes are committed
          await new Promise(resolve => setTimeout(resolve, 1000))
          // Refresh the page to reload all data
          window.location.reload()
        }}
        onClearAuth={clearAuthState}
      />
    )
  }

  // Otherwise show the regular app
  return <CaplingAppContent />
}

function CaplingAppContent() {
  const { user } = useAuth()
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [addTransactionOpen, setAddTransactionOpen] = useState(false)
  const [addGoalOpen, setAddGoalOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  
  const { pendingTransaction, showGoalAllocation, triggerGoalAllocation, completeGoalAllocation } = useGoalAllocation()
  
  // Use Supabase data system
  const {
    loading,
    error,
    transactions,
    currentAccount,
    currentBalance,
    weeklyBudget,
    spendingInsights,
    userProfile,
    refreshData,
  } = useSupabaseData()

  const [caplingName, setCaplingName] = useState<string>("Capling")

  // Update Capling name when user profile loads
  useEffect(() => {
    if (userProfile && 'capling_name' in userProfile && userProfile.capling_name) {
      setCaplingName(userProfile.capling_name as string)
    }
  }, [userProfile])

  // Check for pending goal allocation from test API
  useEffect(() => {
    const pendingData = sessionStorage.getItem('pendingGoalAllocation')
    if (pendingData) {
      try {
        const transactionData = JSON.parse(pendingData)
        triggerGoalAllocation(transactionData)
        sessionStorage.removeItem('pendingGoalAllocation')
      } catch (error) {
        console.error('Error parsing pending goal allocation data:', error)
        sessionStorage.removeItem('pendingGoalAllocation')
      }
    }
  }, [triggerGoalAllocation])

  // Set page title
  useEffect(() => {
    document.title = 'Capling - Your Financial Companion'
  }, [])

  // Use goals system
  const {
    goals,
    loading: goalsLoading,
    error: goalsError,
    createGoal,
    updateGoal,
    deleteGoal,
  } = useGoals()

  // Use badge system
  const {
    badges,
    newBadge,
    showNotification,
    dismissNotification
  } = useBadges()

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setModalOpen(true)
  }

  const handleCaplingNameUpdate = (newName: string) => {
    setCaplingName(newName)
    refreshData()
  }

  const handleAddTransaction = async (transactionData: any, shouldShowGoalAllocation?: boolean) => {
    try {
      refreshData()
      
      if (shouldShowGoalAllocation && transactionData.amount > 0) {
        triggerGoalAllocation({
          amount: transactionData.amount,
          merchant: transactionData.merchant,
          category: transactionData.category
        })
      }
    } catch (error) {
      console.error('Failed to add transaction:', error)
      throw error
    }
  }

  const handleAddGoal = async (goalData: any) => {
    try {
      await createGoal(goalData)
    } catch (error) {
      console.error('Failed to add goal:', error)
      throw error
    }
  }

  const handleGoalAllocationComplete = () => {
    completeGoalAllocation()
    refreshData()
  }

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal)
    setAddGoalOpen(true)
  }

  const handleUpdateGoal = async (goalId: string, updates: any) => {
    try {
      await updateGoal(goalId, updates)
      setEditingGoal(null)
    } catch (error) {
      console.error('Failed to update goal:', error)
      throw error
    }
  }

  const handleDeleteGoal = async (goalId: string) => {
    try {
      await deleteGoal(goalId)
    } catch (error) {
      console.error('Failed to delete goal:', error)
      throw error
    }
  }

  // Convert Supabase transaction to Transaction for compatibility
  const convertToTransaction = (supabaseTx: any): Transaction => ({
    id: supabaseTx.id,
    merchant: supabaseTx.merchant,
    amount: supabaseTx.amount,
    category: supabaseTx.category,
    classification: supabaseTx.classification,
    reflection: supabaseTx.reflection,
    date: supabaseTx.date,
    justification_status: supabaseTx.justification_status,
    original_classification: supabaseTx.original_classification,
    final_classification: supabaseTx.final_classification,
  })

  // Show loading state
  if (loading) {
    return <LoadingState message="Loading your financial data..." />
  }

  // Show error state
  if (error) {
    return <ErrorState error={error} onRetry={refreshData} />
  }

  return (
    <div className="min-h-screen bg-background/80 backdrop-blur-sm">
      <DashboardHeader 
        user={user}
        currentAccount={currentAccount}
        currentBalance={currentBalance}
        onRefresh={refreshData}
      />

      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <Tabs defaultValue="home" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="home" className="gap-2">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </TabsTrigger>
            <TabsTrigger value="transactions" className="gap-2">
              <Receipt className="h-4 w-4" />
              <span className="hidden sm:inline">Transactions</span>
            </TabsTrigger>
            <TabsTrigger value="goals" className="gap-2">
              <Trophy className="h-4 w-4" />
              <span className="hidden sm:inline">Goals</span>
            </TabsTrigger>
            <TabsTrigger value="learn" className="gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Learn</span>
            </TabsTrigger>
          </TabsList>

          {/* Home Dashboard */}
          <TabsContent value="home" className="space-y-6">
            <DashboardHero 
              caplingName={caplingName}
              onCaplingNameUpdate={handleCaplingNameUpdate}
              userId={user?.id}
              transactions={transactions}
              weeklySpending={spendingInsights.totalSpent}
              weeklyBudget={weeklyBudget}
            />

            <BudgetProgress 
              spent={spendingInsights.totalSpent} 
              budget={weeklyBudget}
              userId={user?.id || ''}
              onBudgetUpdate={() => refreshData()}
            />

            <DashboardSummary 
              spendingInsights={spendingInsights}
              currentBalance={currentBalance}
              transactions={transactions}
            />

            <DashboardTransactions 
              transactions={transactions}
              onTransactionClick={handleTransactionClick}
              onAddTransaction={() => setAddTransactionOpen(true)}
              convertToTransaction={convertToTransaction}
              onJustificationSubmitted={() => {
                setTimeout(() => refreshData(), 1000)
              }}
            />

            <div className="space-y-4">
              <Button 
                className="w-full gap-2" 
                size="lg"
                onClick={() => setAddTransactionOpen(true)}
              >
                <Plus className="h-5 w-5" />
                Add Transaction
              </Button>
            </div>
          </TabsContent>

          {/* Transactions Feed */}
          <TabsContent value="transactions" className="space-y-6">
            <DashboardTransactions 
              transactions={transactions}
              onTransactionClick={handleTransactionClick}
              onAddTransaction={() => setAddTransactionOpen(true)}
              convertToTransaction={convertToTransaction}
              onJustificationSubmitted={() => {
                setTimeout(() => refreshData(), 1000)
              }}
              showAll={true}
            />
          </TabsContent>

          {/* Goals & Rewards */}
          <TabsContent value="goals" className="space-y-6">
            <DashboardGoals 
              goals={goals}
              goalsLoading={goalsLoading}
              goalsError={goalsError}
              badges={badges}
              onAddGoal={() => setAddGoalOpen(true)}
              onEditGoal={handleEditGoal}
              onDeleteGoal={handleDeleteGoal}
            />
          </TabsContent>

          {/* Learn Tab */}
          <TabsContent value="learn" className="space-y-6">
            <LearnTab />
          </TabsContent>
        </Tabs>
      </main>

      {/* Modals */}
      <JustificationModal 
        open={modalOpen} 
        onOpenChange={setModalOpen} 
        transaction={selectedTransaction} 
      />
      
      <AddTransactionModal 
        open={addTransactionOpen} 
        onOpenChange={setAddTransactionOpen} 
        onTransactionAdded={handleAddTransaction}
        accountId={currentAccount?.id || ''}
        userId={user?.id || ''}
      />
      
      <GoalModal
        open={addGoalOpen}
        onOpenChange={(open) => {
          setAddGoalOpen(open)
          if (!open) setEditingGoal(null)
        }}
        onGoalAdded={handleAddGoal}
        editingGoal={editingGoal}
        onGoalUpdated={handleUpdateGoal}
      />
      
      <GoalAllocationModal
        open={showGoalAllocation}
        onOpenChange={(open) => !open && completeGoalAllocation()}
        transactionAmount={pendingTransaction?.amount || 0}
        transactionMerchant={pendingTransaction?.merchant || ''}
        transactionCategory={pendingTransaction?.category}
        onAllocationComplete={handleGoalAllocationComplete}
      />

      {/* Badge Notification */}
      {newBadge && (
        <BadgeNotification
          badge={newBadge}
          show={showNotification}
          onComplete={dismissNotification}
        />
      )}
    </div>
  )
}