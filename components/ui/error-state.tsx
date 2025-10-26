// Reusable error state component

import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw } from "lucide-react"

interface ErrorStateProps {
  error: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({ 
  error, 
  onRetry,
  className = "" 
}: ErrorStateProps) {
  return (
    <div className={`min-h-screen bg-background flex items-center justify-center ${className}`}>
      <div className="text-center space-y-4 max-w-md">
        <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
        <h2 className="text-xl font-semibold">Unable to Load Data</h2>
        <p className="text-muted-foreground">{error}</p>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            There was an issue loading your data. This might be due to:
          </p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Database connection issues</li>
            <li>• Authentication problems</li>
            <li>• Network connectivity problems</li>
          </ul>
        </div>
        {onRetry && (
          <Button onClick={onRetry} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  )
}
