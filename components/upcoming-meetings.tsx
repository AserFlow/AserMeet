"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import MeetingCard from "./meeting-card"
import type { Meeting } from "@/types"

export default function UpcomingMeetings() {
  const { data: session } = useSession()
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchMeetings = async () => {
      if (!session?.accessToken) return

      try {
        setIsLoading(true)
        setError("")
        const response = await fetch("/api/calendar", {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch meetings")
        }

        const data = await response.json()
        setMeetings(data.meetings || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load meetings")
        console.error("Error fetching meetings:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMeetings()
    const interval = setInterval(fetchMeetings, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [session?.accessToken])

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 slide-up-animation">
        <h2 className="text-3xl font-bold mb-2">Upcoming Meetings</h2>
        <p className="text-muted-foreground text-sm">Prepare for your next meetings with AI-powered insights</p>
      </div>

      {isLoading && (
        <div className="flex justify-center py-12 fade-in-animation">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-border border-t-foreground rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your meetings...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-muted/50 border border-border rounded-lg p-4 mb-6 fade-in-animation">
          <p className="text-sm font-semibold mb-1 text-foreground">Error</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      )}

      {!isLoading && meetings.length === 0 && !error && (
        <div className="text-center py-12 border border-border rounded-lg fade-in-animation">
          <p className="text-muted-foreground">No upcoming meetings found</p>
          <p className="text-sm text-muted-foreground mt-2">Check your Google Calendar for scheduled meetings</p>
        </div>
      )}

      <div className="grid gap-4">
        {meetings.map((meeting, idx) => (
          <div key={meeting.id} style={{ animationDelay: `${idx * 0.05}s` }} className="slide-up-animation">
            <MeetingCard meeting={meeting} />
          </div>
        ))}
      </div>
    </div>
  )
}
