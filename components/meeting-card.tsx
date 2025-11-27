"use client"

import type { Meeting } from "@/types"
import { useState } from "react"
import MeetingPrepSummary from "./meeting-prep-summary"

interface MeetingCardProps {
  meeting: Meeting
}

export default function MeetingCard({ meeting }: MeetingCardProps) {
  const [showPrepSummary, setShowPrepSummary] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [prepSummary, setPrepSummary] = useState<any>(null)

  const handlePrepare = async () => {
    if (showPrepSummary) {
      setShowPrepSummary(false)
      return
    }

    setIsGenerating(true)
    try {
      const crmResponse = await fetch(`/api/crm?spreadsheetId=${process.env.NEXT_PUBLIC_SHEETS_ID || ""}`)
      const { crmData } = await crmResponse.json()

      const prepResponse = await fetch("/api/prep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: meeting.title,
          date: meeting.start,
          attendees: meeting.attendees?.map((a) => a.email) || [],
          crmData: crmData || {},
          description: meeting.description,
        }),
      })

      const prep = await prepResponse.json()
      setPrepSummary(prep)
      setShowPrepSummary(true)
    } catch (error) {
      console.error("Failed to prepare meeting:", error)
      alert("Failed to generate meeting prep")
    } finally {
      setIsGenerating(false)
    }
  }

  const dateTime = new Date(meeting.start).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    meridiem: "short",
  })

  if (showPrepSummary && prepSummary) {
    return <MeetingPrepSummary meeting={meeting} summary={prepSummary} onClose={() => setShowPrepSummary(false)} />
  }

  return (
    <div className="group border border-border rounded-lg p-6 bg-card hover:bg-muted/50 transition-all duration-300 card-shadow cursor-default hover:border-foreground/20">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2 group-hover:text-accent transition-colors">{meeting.title}</h3>
          <p className="text-sm text-muted-foreground mb-3">{dateTime}</p>

          {meeting.attendees && meeting.attendees.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-muted-foreground mb-2 font-medium">Attendees</p>
              <div className="flex flex-wrap gap-2">
                {meeting.attendees.map((attendee, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-muted/60 px-2.5 py-1 rounded-full border border-border/50 text-foreground transition-all duration-200"
                  >
                    {attendee.email}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handlePrepare}
          disabled={isGenerating}
          className="px-4 py-2 bg-foreground text-background font-semibold rounded-lg hover:shadow-md hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 whitespace-nowrap btn-transition group-hover:shadow-lg"
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-background border-t-transparent rounded-full animate-spin"></div>
              Preparing...
            </span>
          ) : (
            "Prepare Meeting"
          )}
        </button>
      </div>
    </div>
  )
}
