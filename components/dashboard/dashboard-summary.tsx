// Dashboard summary cards component

import { SummaryCard } from "@/components/summary-card"
import { Wallet, Target, TrendingUp } from "lucide-react"
import { SpendingInsights, Transaction } from "@/types"

interface DashboardSummaryProps {
  spendingInsights: SpendingInsights
  currentBalance: number
  transactions: Transaction[]
}

export function DashboardSummary({
  spendingInsights,
  currentBalance,
  transactions
}: DashboardSummaryProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <SummaryCard
        title="This Week's Spending"
        value={`$${spendingInsights.totalSpent.toFixed(2)}`}
        icon={Wallet}
        trend={`${spendingInsights.topCategory} is your top category`}
      />
      <SummaryCard 
        title="Account Balance" 
        value={`$${currentBalance.toFixed(2)}`} 
        icon={Target} 
        trend={`${spendingInsights.transactionCount} transactions this month`} 
      />
      <SummaryCard
        title="Reflection Score"
        value={`${Math.round(spendingInsights.responsiblePercentage)}%`}
        icon={TrendingUp}
        trend={`${Math.round(spendingInsights.responsiblePercentage)}% responsible spending`}
      />
    </div>
  )
}
