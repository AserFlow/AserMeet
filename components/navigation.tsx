"use client"

import type { Session } from "next-auth"
import { signOut } from "next-auth/react"
import { useState, useEffect } from "react"

interface NavigationProps {
  session: Session | null
}

export default function Navigation({ session }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
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

  return (
    <nav className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3 slide-up-animation">
            <div className="text-2xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              AserMeet
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {session?.user?.email && (
              <>
                <span className="text-sm text-muted-foreground transition-colors duration-200">
                  {session.user.email}
                </span>

                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg hover:bg-muted transition-all duration-200 btn-transition group"
                  aria-label="Toggle theme"
                >
                  {theme === "light" ? (
                    <svg
                      className="w-5 h-5 text-foreground group-hover:scale-110 transition-transform"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5 text-foreground group-hover:scale-110 transition-transform"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
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

                <button
                  onClick={() => signOut()}
                  className="text-sm px-4 py-2 border border-border rounded-lg hover:bg-muted text-foreground btn-transition group"
                >
                  <span className="group-hover:opacity-75 transition-opacity">Sign Out</span>
                </button>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-muted transition-all duration-200 btn-transition"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="5" />
                </svg>
              )}
            </button>

            <button onClick={() => setIsOpen(!isOpen)} className="p-2 border border-border rounded-lg btn-transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 fade-in-animation">
            {session?.user?.email && (
              <>
                <p className="text-sm text-muted-foreground px-4 py-2">{session.user.email}</p>
                <button
                  onClick={() => {
                    signOut()
                    setIsOpen(false)
                  }}
                  className="w-full text-left text-sm px-4 py-2 border border-border rounded-lg hover:bg-muted text-foreground btn-transition"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
