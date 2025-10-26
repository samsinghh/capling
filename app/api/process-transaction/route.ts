// Cleaned up process-transaction API route

import { NextRequest, NextResponse } from 'next/server'
import { analyzeTransaction, getLLMConfig } from '@/lib/llm-analyzer'
import { 
  validateRequired, 
  validateNumber, 
  validateTransactionCategory,
  validateUserId,
  createSuccessResponse,
  createErrorResponse,
  logError,
  logInfo
} from '@/lib/errors'
import {
  getUserAccount,
  createTransaction,
  updateAccountBalance,
  validateUserAccess
} from '@/lib/api-utils'
import { CreateTransactionRequest, CreateTransactionResponse } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body: CreateTransactionRequest = await request.json()
    const { 
      userId, 
      accountId, 
      merchant, 
      amount, 
      category, 
      description,
      timestamp 
    } = body

    // Validate required fields
    validateRequired(userId, 'userId')
    validateRequired(merchant, 'merchant')
    validateRequired(amount, 'amount')
    validateNumber(amount, 'amount', 0.01, 10000)
    validateTransactionCategory(category)
    validateUserId(userId)

    logInfo('Processing transaction', 'process-transaction', { userId, merchant, amount, category })

    // Get or create user account
    const account = await getUserAccount(userId, accountId)
    logInfo('Retrieved account', 'process-transaction', { accountId: account.id, balance: account.balance })

    // Determine transaction type and amount
    const type = amount < 0 ? 'credit' : 'debit'
    const transactionAmount = Math.abs(amount)
    const isDeposit = amount < 0
    
    // Get LLM analysis for the transaction (skip for deposits)
    let analysis
    if (isDeposit) {
      logInfo('Skipping LLM analysis for deposit', 'process-transaction', { merchant, amount: transactionAmount })
      analysis = {
        classification: 'responsible' as const,
        reflection: 'Deposit added to your account',
        confidence: 1.0,
        reasoning: 'Deposit transaction',
        improvement_suggestion: null
      }
    } else {
      try {
        logInfo('Starting LLM analysis', 'process-transaction', { merchant, amount: transactionAmount })
        const config = getLLMConfig()
        
        analysis = await analyzeTransaction(
          merchant,
          transactionAmount,
          description || merchant,
          config,
          account.balance
        )
        logInfo('LLM analysis completed', 'process-transaction', analysis)
      } catch (llmError) {
        logError(llmError, 'process-transaction')
        // Fallback analysis if LLM fails
        analysis = {
          classification: 'neutral' as const,
          reflection: 'Transaction processed - analysis unavailable',
          confidence: 0.5,
          reasoning: 'LLM analysis failed',
          improvement_suggestion: null
        }
      }
    }

    // Create transaction date
    const transactionDate = timestamp ? new Date(timestamp) : new Date()
    const formattedDate = transactionDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

    // Determine if transaction needs justification
    const needsJustification = !isDeposit && (analysis.classification === 'irresponsible' || analysis.classification === 'neutral')
    const justificationStatus = needsJustification ? 'pending' : 'none'

    // Create the transaction record
    const transactionData = {
      user_id: userId,
      account_id: account.id,
      merchant,
      amount: transactionAmount,
      category: category || 'shopping',
      classification: analysis.classification,
      original_classification: analysis.classification,
      final_classification: analysis.classification,
      reflection: analysis.reflection,
      improvement_suggestion: analysis.improvement_suggestion,
      description: description || merchant,
      date: formattedDate,
      timestamp: transactionDate.getTime(),
      type,
      justification_status: justificationStatus
    }

    // Create transaction in database
    const newTransaction = await createTransaction(transactionData)

    // Update account balance
    const newBalance = type === 'credit' 
      ? account.balance + transactionAmount 
      : account.balance - transactionAmount

    await updateAccountBalance(account.id, newBalance)

    const response: CreateTransactionResponse = {
      success: true,
      transaction: newTransaction,
      newBalance,
      analysis: {
        classification: analysis.classification,
        reflection: analysis.reflection
      },
      shouldShowGoalAllocation: transactionAmount > 0 && analysis.classification === 'irresponsible'
    }

    logInfo('Transaction processed successfully', 'process-transaction', { 
      transactionId: newTransaction.id, 
      newBalance 
    })

    return NextResponse.json(response)

  } catch (error) {
    logError(error, 'process-transaction')
    return NextResponse.json(
      createErrorResponse(error),
      { status: error instanceof Error && 'statusCode' in error ? error.statusCode : 500 }
    )
  }
}

// GET endpoint to retrieve recent transactions for an account
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const accountId = searchParams.get('accountId')
    const limit = parseInt(searchParams.get('limit') || '10')

    validateRequired(userId, 'userId')
    validateRequired(accountId, 'accountId')
    validateUserId(userId!)

    const { getUserTransactions } = await import('@/lib/api-utils')
    const transactions = await getUserTransactions(userId!, limit)

    return NextResponse.json(createSuccessResponse(transactions))

  } catch (error) {
    logError(error, 'process-transaction-get')
    return NextResponse.json(
      createErrorResponse(error),
      { status: error instanceof Error && 'statusCode' in error ? error.statusCode : 500 }
    )
  }
}