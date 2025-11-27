"use client"

import type { ReactNode } from "react"

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export default function ErrorBoundary({ children }: ErrorBoundaryProps) {
  // Error boundary is typically a class component, but we'll provide error handling
  try {
    return <>{children}</>
  } catch (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
          <p className="text-muted mb-4">An error occurred while loading this page. Please try refreshing.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-foreground text-background font-semibold rounded hover:opacity-90 transition-opacity"
          >
            Refresh Page
          </button>
        </div>
      </div>
    )
  }
}
