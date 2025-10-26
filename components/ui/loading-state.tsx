// Reusable loading state component

import { RefreshCw } from "lucide-react"

interface LoadingStateProps {
  message?: string
  className?: string
}

export function LoadingState({ 
  message = "Loading...", 
  className = "" 
}: LoadingStateProps) {
  return (
    <div className={`min-h-screen bg-background flex items-center justify-center ${className}`}>
      <div className="text-center space-y-4">
        <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  )
}
