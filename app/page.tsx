"use client"

import { useEffect, useState } from "react"
import Navigation from "@/components/navigation"
import UpcomingMeetings from "@/components/upcoming-meetings"
import { useSession } from "next-auth/react"
import LoginPage from "@/components/login-page"

export default function Home() {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(status === "loading")
  }, [status])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-muted border-t-foreground rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return <LoginPage />
  }

  return (
    <main className="bg-background text-foreground min-h-screen">
      <Navigation session={session} />
      <UpcomingMeetings />
    </main>
  )
}
