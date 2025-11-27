import { google } from "googleapis"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const accessToken = authHeader.replace("Bearer ", "")

    const calendar = google.calendar({
      version: "v3",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const now = new Date()
    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: now.toISOString(),
      maxResults: 5,
      singleEvents: true,
      orderBy: "startTime",
    })

    const meetings = (response.data.items || []).map((event) => ({
      id: event.id,
      title: event.summary || "Untitled Meeting",
      start: event.start?.dateTime || event.start?.date || "",
      end: event.end?.dateTime || event.end?.date || "",
      attendees: (event.attendees || [])
        .filter((a) => a.email)
        .map((attendee) => ({
          email: attendee.email || "",
          displayName: attendee.displayName,
        })),
      description: event.description,
    }))

    return NextResponse.json({ meetings })
  } catch (error) {
    console.error("Calendar API error:", error)
    return NextResponse.json({ error: "Failed to fetch calendar events" }, { status: 500 })
  }
}
