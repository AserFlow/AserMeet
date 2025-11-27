import { google } from "googleapis"

export async function getCalendarEvents(accessToken: string, maxResults = 5) {
  try {
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
      maxResults,
      singleEvents: true,
      orderBy: "startTime",
    })

    return (response.data.items || []).map((event) => ({
      id: event.id,
      title: event.summary || "Untitled Meeting",
      start: event.start?.dateTime || event.start?.date || "",
      end: event.end?.dateTime || event.end?.date || "",
      attendees: (event.attendees || []).map((attendee) => ({
        email: attendee.email || "",
        displayName: attendee.displayName,
      })),
      description: event.description,
    }))
  } catch (error) {
    console.error("Failed to fetch calendar events:", error)
    throw new Error("Failed to fetch calendar events")
  }
}
