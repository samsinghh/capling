// Dashboard header component

import { Button } from "@/components/ui/button"
import { DinosaurIcon } from "@/components/dinosaur-icon"
import { UserMenu } from "@/components/auth/user-menu"
import { RefreshCw } from "lucide-react"
import { User } from "@supabase/supabase-js"
import { Account } from "@/types"

interface DashboardHeaderProps {
  user: User | null
  currentAccount: Account | null
  currentBalance: number
  onRefresh: () => void
}

export function DashboardHeader({ 
  user, 
  currentAccount, 
  currentBalance, 
  onRefresh 
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DinosaurIcon className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Capling</h1>
              {user && (
                <p className="text-sm text-muted-foreground">
                  Welcome, {user?.user_metadata?.full_name || user?.email}!
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {currentAccount && (
              <div className="text-right">
                <p className="text-sm text-muted-foreground">{currentAccount.account_name}</p>
                <p className="text-lg font-semibold text-foreground">
                  ${currentBalance.toFixed(2)}
                </p>
              </div>
            )}
            <Button variant="ghost" size="icon" onClick={onRefresh}>
              <RefreshCw className="h-5 w-5" />
            </Button>
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  )
}
