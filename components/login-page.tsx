"use client"

import { signIn } from "next-auth/react"
import { useState, useEffect } from "react"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [theme, setTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    const savedTheme = (localStorage.getItem("theme") as "light" | "dark") || "light"
    setTheme(savedTheme)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  const handleSignIn = async () => {
    setIsLoading(true)
    await signIn("google", { callbackUrl: "/" })
  }

  return (
    <div className="flex items-center justify-center h-screen bg-background transition-colors duration-300">
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-muted transition-all duration-200 border border-border"
          aria-label="Toggle theme"
        >
          {theme === "light" ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2" />
              <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2" />
              <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" />
              <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="2" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2" />
            </svg>
          )}
        </button>
      </div>

      <div className="w-full max-w-md px-8 fade-in-animation">
        <div className="text-center mb-8 slide-up-animation">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent">
            AserMeet
          </h1>
          <p className="text-muted-foreground text-lg">AI-Powered Meeting Prep</p>
        </div>

        <div className="space-y-4 mb-8 slide-up-animation" style={{ animationDelay: "0.1s" }}>
          <p className="text-center text-foreground leading-relaxed">
            Prepare for your meetings with AI insights from your calendar and CRM.
          </p>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <div className="w-1 h-1 bg-accent rounded-full"></div>
              <span>Connect your Google Calendar</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1 h-1 bg-accent rounded-full"></div>
              <span>Link your Google Sheets CRM</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1 h-1 bg-accent rounded-full"></div>
              <span>Get AI-powered meeting prep</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleSignIn}
          disabled={isLoading}
          className="w-full py-3 px-4 bg-foreground text-background font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 scale-in-animation"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin"></div>
              Signing in...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign in with Google
            </span>
          )}
        </button>

        <p className="text-center text-muted-foreground text-xs mt-6">
          We use Google Calendar and Sheets to power your meeting insights.
        </p>
      </div>
    </div>
  )
}
