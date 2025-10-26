// Dashboard hero section with Capling character

import { CaplingCharacter } from "@/components/capling-character"
import { Transaction } from "@/types"
import { MOOD_CONFIG } from "@/lib/constants"

interface DashboardHeroProps {
  caplingName: string
  onCaplingNameUpdate: (newName: string) => void
  userId?: string
  transactions: Transaction[]
  weeklySpending: number
  weeklyBudget: number
}

export function DashboardHero({
  caplingName,
  onCaplingNameUpdate,
  userId,
  transactions,
  weeklySpending,
  weeklyBudget
}: DashboardHeroProps) {
  const getMood = () => {
    if (!transactions || transactions.length === 0) return "neutral"
    
    // Check if user is in debt (negative account balance) - this overrides everything else
    const currentBalance = transactions.reduce((sum, tx) => {
      return tx.type === 'credit' ? sum + tx.amount : sum - tx.amount
    }, 1000) // Starting balance assumption
    
    if (currentBalance < 0) {
      return "depressed"
    }
    
    // Get recent transactions (last 7 days)
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const recentTransactions = transactions.filter(tx => {
      const txDate = new Date(tx.timestamp)
      return txDate >= weekAgo
    })
    
    // Calculate budget percentage
    const budgetPercentage = (weeklySpending / weeklyBudget) * 100
    
    // Analyze transaction classifications
    const responsibleCount = recentTransactions.filter(tx => tx.classification === 'responsible').length
    const irresponsibleCount = recentTransactions.filter(tx => tx.classification === 'irresponsible').length
    const totalRecent = recentTransactions.length
    
    // Calculate responsible spending ratio
    const responsibleRatio = totalRecent > 0 ? responsibleCount / totalRecent : 0.5
    
    // Check for concerning patterns
    const largeTransactions = recentTransactions.filter(tx => tx.amount > 100).length
    const frequentIrresponsible = irresponsibleCount >= 3
    const overBudget = budgetPercentage > 100
    const highIrresponsibleRatio = totalRecent > 0 && (irresponsibleCount / totalRecent) > 0.6
    
    // Calculate mood score (0-100, higher = happier)
    let moodScore = 50 // Start neutral
    
    // Budget factor (40% weight)
    if (budgetPercentage < 50) moodScore += 20
    else if (budgetPercentage < 80) moodScore += 10
    else if (budgetPercentage < 100) moodScore -= 10
    else moodScore -= 30
    
    // Responsible spending factor (35% weight)
    if (responsibleRatio > 0.7) moodScore += 15
    else if (responsibleRatio > 0.5) moodScore += 5
    else if (responsibleRatio > 0.3) moodScore -= 10
    else moodScore -= 20
    
    // Pattern analysis (25% weight)
    if (frequentIrresponsible) moodScore -= 15
    if (highIrresponsibleRatio) moodScore -= 10
    if (largeTransactions > 2) moodScore -= 10
    if (overBudget) moodScore -= 15
    
    // Determine mood based on score
    if (moodScore >= 70) return "happy"
    if (moodScore >= 45) return "neutral"
    if (moodScore >= 25) return "worried"
    return "sad"
  }

  const getMoodMessage = () => {
    if (!transactions || transactions.length === 0) {
      return "Capling is excited to help you track your spending! Start by adding your first transaction."
    }
    
    const mood = getMood()
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const recentTransactions = transactions.filter(tx => {
      const txDate = new Date(tx.timestamp)
      return txDate >= weekAgo
    })
    
    const budgetPercentage = (weeklySpending / weeklyBudget) * 100
    const responsibleCount = recentTransactions.filter(tx => tx.classification === 'responsible').length
    const irresponsibleCount = recentTransactions.filter(tx => tx.classification === 'irresponsible').length
    const totalRecent = recentTransactions.length
    const responsibleRatio = totalRecent > 0 ? responsibleCount / totalRecent : 0.5
    
    switch (mood) {
      case "happy":
        if (responsibleRatio > 0.7 && budgetPercentage < 60) {
          return "Capling is absolutely thrilled! You're making excellent financial decisions and staying well within budget. You're a spending superstar! 🌟"
        } else if (responsibleRatio > 0.6) {
          return "Capling is proud of your responsible spending choices! You're making smart decisions that will pay off in the long run. Keep it up! 💪"
        } else {
          return "Capling is happy with your progress! You're managing your budget well and making mostly good choices. Great job! 😊"
        }
        
      case "neutral":
        if (budgetPercentage > 80 && responsibleRatio < 0.5) {
          return "Capling notices you're getting close to your budget limit and making some questionable purchases. Let's focus on more responsible choices! 🤔"
        } else if (budgetPercentage > 80) {
          return "Capling is keeping an eye on your spending. You're approaching your budget limit, but your choices are mostly responsible. Stay mindful! 👀"
        } else if (responsibleRatio < 0.4) {
          return "Capling sees you're staying within budget, but some of your recent purchases could be more thoughtful. Let's work on better decision-making! 💭"
        } else {
          return "Capling thinks you're doing okay overall, but there's definitely room for improvement in your spending habits. Small changes can make a big difference! 📈"
        }
        
      case "worried":
        if (budgetPercentage > 100) {
          return "Capling is concerned! You've exceeded your budget and made several questionable purchases. Let's create a plan to get back on track! 🚨"
        } else if (irresponsibleCount >= 3) {
          return "Capling is worried about your recent spending patterns. You've made multiple irresponsible purchases lately. Let's break this cycle! ⚠️"
        } else if (responsibleRatio < 0.3) {
          return "Capling is concerned about your spending choices. Most of your recent purchases have been classified as irresponsible. Time for a spending reset! 🔄"
        } else {
          return "Capling is getting worried about your spending habits. You're making some concerning choices that could impact your financial health. Let's talk! 💬"
        }
        
      case "sad":
        if (budgetPercentage > 120) {
          return "Capling is really sad about your spending situation. You're way over budget and making many poor financial decisions. We need to take action now! 😢"
        } else if (irresponsibleCount >= 5) {
          return "Capling is heartbroken by your recent spending choices. You've made too many irresponsible purchases in a short time. Let's turn this around together! 💔"
        } else {
          return "Capling is saddened by your current spending patterns. Your financial choices are concerning and need immediate attention. Don't worry, we'll fix this! 🤗"
        }
        
      case "depressed":
        return "Capling is deeply concerned and depressed about your financial situation. Your account is in the negative, which is a serious problem that needs immediate attention. Let's work together to get you back on track! 💔"
        
      default:
        return "Capling is here to help you with your financial journey!"
    }
  }

  const mood = getMood()
  const reflectionScore = Math.round(
    transactions.length > 0 
      ? (transactions.filter(tx => tx.classification === 'responsible').length / transactions.length) * 100
      : 75
  )

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 border border-primary/20 p-8">
      <div className="flex flex-col items-center text-center space-y-8">
        {/* Capling Character - Centered and Large */}
        <div className="flex justify-center">
          <CaplingCharacter 
            mood={mood} 
            name={caplingName}
            showNameEditor={true}
            onNameUpdate={onCaplingNameUpdate}
            userId={userId}
          />
        </div>
        
        {/* Welcome Message */}
        <div className="space-y-6 max-w-2xl">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
            Welcome back!
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {getMoodMessage()}
          </p>
        </div>
        
        {/* Quick Stats */}
        <div className="flex flex-wrap gap-4 justify-center">
          <div className="bg-background/50 backdrop-blur-sm rounded-lg px-6 py-3 border">
            <p className="text-sm text-muted-foreground">This Week</p>
            <p className="text-xl font-semibold text-foreground">${weeklySpending.toFixed(2)}</p>
          </div>
          <div className="bg-background/50 backdrop-blur-sm rounded-lg px-6 py-3 border">
            <p className="text-sm text-muted-foreground">Budget Left</p>
            <p className="text-xl font-semibold text-foreground">${(weeklyBudget - weeklySpending).toFixed(2)}</p>
          </div>
          <div className="bg-background/50 backdrop-blur-sm rounded-lg px-6 py-3 border">
            <p className="text-sm text-muted-foreground">Score</p>
            <p className="text-xl font-semibold text-foreground">{reflectionScore}%</p>
          </div>
        </div>
      </div>
    </div>
  )
}
