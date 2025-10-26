// Dashboard goals component

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { GoalCard } from "@/components/goal-card"
import { BadgeCard } from "@/components/badge-card"
import { Plus, Target, AlertCircle, RefreshCw } from "lucide-react"
import { Goal, Badge } from "@/types"

interface DashboardGoalsProps {
  goals: Goal[]
  goalsLoading: boolean
  goalsError: string | null
  badges: Badge[]
  onAddGoal: () => void
  onEditGoal: (goal: Goal) => void
  onDeleteGoal: (goalId: string) => void
}

export function DashboardGoals({
  goals,
  goalsLoading,
  goalsError,
  badges,
  onAddGoal,
  onEditGoal,
  onDeleteGoal
}: DashboardGoalsProps) {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Your Goals</h2>
          <p className="text-muted-foreground">Track your progress and earn rewards</p>
        </div>
        <Button onClick={onAddGoal} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Goal
        </Button>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Active Goals</h3>
        {goalsLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading your goals...</p>
          </div>
        ) : goalsError ? (
          <div className="text-center py-8 text-destructive">
            <AlertCircle className="h-8 w-8 mx-auto mb-4" />
            <p>Failed to load goals: {goalsError}</p>
          </div>
        ) : goals.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Target className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No Goals Yet</h3>
            <p>Create your first financial goal to start tracking your progress!</p>
            <Button 
              onClick={onAddGoal} 
              className="mt-4 gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Your First Goal
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={onEditGoal}
                onDelete={onDeleteGoal}
              />
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Badges & Achievements</h3>
          <div className="text-sm text-muted-foreground">
            {badges.filter(b => b.earned).length} of {badges.length} earned
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {badges.map((badge) => (
            <BadgeCard
              key={badge.id}
              title={badge.title}
              description={badge.description}
              emoji={badge.emoji}
              earned={badge.earned}
            />
          ))}
        </div>
      </div>
    </>
  )
}
