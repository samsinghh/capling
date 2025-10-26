// Dashboard transactions component

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TransactionItem, type Transaction } from "@/components/transaction-item"
import { Plus, Receipt } from "lucide-react"

interface DashboardTransactionsProps {
  transactions: any[]
  onTransactionClick: (transaction: Transaction) => void
  onAddTransaction: () => void
  convertToTransaction: (supabaseTx: any) => Transaction
  onJustificationSubmitted: (transactionId: string, justification: string) => void
  showAll?: boolean
}

export function DashboardTransactions({
  transactions,
  onTransactionClick,
  onAddTransaction,
  convertToTransaction,
  onJustificationSubmitted,
  showAll = false
}: DashboardTransactionsProps) {
  const displayTransactions = showAll ? transactions : transactions.slice(0, 3)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">
          {showAll ? 'All Transactions' : 'Recent Transactions'}
        </h2>
        <Button 
          className="gap-2"
          onClick={onAddTransaction}
        >
          <Plus className="h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      <div className="space-y-3">
        {displayTransactions.map((transaction) => (
          <TransactionItem
            key={transaction.id}
            transaction={convertToTransaction(transaction)}
            onClick={() => onTransactionClick(convertToTransaction(transaction))}
            onJustificationSubmitted={onJustificationSubmitted}
          />
        ))}
        {transactions.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No recent transactions found</p>
            <p className="text-sm">Your transactions will appear here</p>
          </div>
        )}
      </div>
    </div>
  )
}
