import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { type NextRequest, NextResponse } from "next/server"

interface PrepRequest {
  title: string
  date: string
  attendees: string[]
  crmData: Record<string, any>
  description?: string
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 })
    }

    const body: PrepRequest = await request.json()
    const { title, date, attendees, crmData, description } = body

    if (!title || !attendees.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const crmSummary = attendees
      .map((email) => {
        const data = crmData[email] || {}
        return `- ${email}: Last meeting: ${data.lastMeeting || "N/A"}, Status: ${data.status || "N/A"}, Notes: ${data.notes || "N/A"}`
      })
      .join("\n")

    const prompt = `Generate a professional Meeting Prep Summary for this meeting:

Meeting Info:
- Title: ${title}
- Date: ${date}
- Attendees: ${attendees.join(", ")}
${description ? `- Description: ${description}` : ""}

CRM Data (from Google Sheet):
${crmSummary || "No CRM data available"}

Output EXACTLY in this format with clear sections:

QUICK OVERVIEW
[2-3 sentences about the meeting purpose and key points]

WHAT HAPPENED LAST TIME
[2-3 sentences about relevant history with these attendees, or "No previous meeting history" if N/A]

WHAT TO SAY FIRST
[A specific opening line that sets a positive tone]

SUGGESTED QUESTIONS
[5 bullet points of strategic questions to ask]

RISKS & OPPORTUNITIES
[2-3 key risks and 2-3 opportunities to be aware of]

FOLLOW-UP DRAFT
[A brief follow-up message template to use after the meeting]`

    const { text } = await generateText({
      model: openai("gpt-4-turbo"),
      prompt,
      temperature: 0.7,
      maxTokens: 1500,
    })

    const sections = parsePrep(text)
    return NextResponse.json(sections)
  } catch (error) {
    console.error("Prep generation error:", error)
    return NextResponse.json({ error: "Failed to generate meeting prep" }, { status: 500 })
  }
}

function parsePrep(text: string) {
  return {
    quickOverview: extractSection(text, "QUICK OVERVIEW"),
    whatHappenedLastTime: extractSection(text, "WHAT HAPPENED LAST TIME"),
    whatToSayFirst: extractSection(text, "WHAT TO SAY FIRST"),
    suggestedQuestions: extractQuestions(text),
    risksAndOpportunities: extractSection(text, "RISKS & OPPORTUNITIES"),
    followUpDraft: extractSection(text, "FOLLOW-UP DRAFT"),
  }
}

function extractSection(text: string, sectionName: string): string {
  const regex = new RegExp(`${sectionName}\\s*\\n+([^A-Z\\n][^]*?)(?=\\n\\n[A-Z]|$)`, "i")
  const match = text.match(regex)
  return match ? match[1].trim() : ""
}

function extractQuestions(text: string): string[] {
  const questionsSection = extractSection(text, "SUGGESTED QUESTIONS")
  const questions = questionsSection
    .split("\n")
    .filter((line) => line.trim().startsWith("-") || line.trim().match(/^\d+\./))
    .map((line) => line.replace(/^[-\d.]\s*/, "").trim())
    .filter((q) => q.length > 0)
  return questions.slice(0, 5)
}
