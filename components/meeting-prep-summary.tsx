"use client"

import type { Meeting, MeetingPrepSummary } from "@/types"
import { useState } from "react"

interface MeetingPrepSummaryProps {
  meeting: Meeting
  summary: MeetingPrepSummary
  onClose: () => void
}

export default function MeetingPrepSummaryComponent({ meeting, summary, onClose }: MeetingPrepSummaryProps) {
  const [copied, setCopied] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const handleCopySummary = () => {
    const text = `
Meeting Prep: ${meeting.title}
Date: ${new Date(meeting.start).toLocaleString()}

QUICK OVERVIEW
${summary.quickOverview}

WHAT HAPPENED LAST TIME
${summary.whatHappenedLastTime}

WHAT TO SAY FIRST
${summary.whatToSayFirst}

SUGGESTED QUESTIONS
${summary.suggestedQuestions.map((q) => `- ${q}`).join("\n")}

RISKS & OPPORTUNITIES
${summary.risksAndOpportunities}

FOLLOW-UP DRAFT
${summary.followUpDraft}
    `.trim()

    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/60 z-50 flex items-start justify-center overflow-y-auto pt-8 pb-8 backdrop-blur-sm transition-all duration-300 fade-in-animation">
      <div className="bg-background border border-border rounded-lg max-w-2xl w-full mx-4 p-8 scale-in-animation shadow-lg">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2 text-foreground">{meeting.title}</h2>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {new Date(meeting.start).toLocaleString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 p-2 rounded-lg ml-4 btn-transition"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="h-px bg-border mb-6"></div>

        <div className="space-y-4 mb-6">
          <Section title="Quick Overview" content={summary.quickOverview} icon="⚡" />

          <Section title="What Happened Last Time" content={summary.whatHappenedLastTime} icon="📋" />

          <Section title="What To Say First" content={summary.whatToSayFirst} icon="💬" />

          <div className="border border-border rounded-lg p-4 bg-muted/30 hover:bg-muted/50 transition-colors duration-300">
            <h3 className="text-base font-semibold mb-3 flex items-center gap-2 text-foreground">
              <span className="text-lg">❓</span>
              Suggested Questions
            </h3>
            <ul className="space-y-2">
              {summary.suggestedQuestions.map((question, idx) => (
                <li
                  key={idx}
                  className="text-sm flex gap-3 p-2 rounded hover:bg-background/50 transition-colors duration-200 group"
                >
                  <span className="font-medium text-muted-foreground flex-shrink-0 group-hover:text-foreground transition-colors">
                    {idx + 1}.
                  </span>
                  <span className="text-foreground">{question}</span>
                </li>
              ))}
            </ul>
          </div>

          <Section title="Risks & Opportunities" content={summary.risksAndOpportunities} icon="🎯" />

          <Section title="Follow-Up Draft" content={summary.followUpDraft} icon="✉️" />
        </div>

        <div className="flex gap-3 pt-6 border-t border-border">
          <button
            onClick={handleCopySummary}
            className={`flex-1 py-3 px-4 font-semibold rounded-lg transition-all duration-200 btn-transition flex items-center justify-center gap-2 ${
              copied ? "bg-foreground text-background" : "bg-foreground text-background hover:shadow-md hover:scale-105"
            }`}
          >
            {copied ? (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                Copied to Clipboard!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Copy Summary
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 border border-border rounded-lg hover:bg-muted text-foreground font-semibold transition-all duration-200 btn-transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

function Section({
  title,
  content,
  icon,
}: {
  title: string
  content: string
  icon?: string
}) {
  return (
    <div className="border border-border rounded-lg p-4 bg-muted/30 hover:bg-muted/50 transition-colors duration-300 group">
      <h3 className="text-base font-semibold mb-2 flex items-center gap-2 text-foreground">
        {icon && <span className="text-lg">{icon}</span>}
        {title}
      </h3>
      <p className="text-sm text-foreground leading-relaxed line-clamp-none">{content}</p>
    </div>
  )
}
