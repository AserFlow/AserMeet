import { google } from "googleapis"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const spreadsheetId = request.nextUrl.searchParams.get("spreadsheetId")

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!spreadsheetId) {
      // Return empty CRM data if no spreadsheet ID provided
      return NextResponse.json({ crmData: {} })
    }

    const accessToken = authHeader.replace("Bearer ", "")

    const sheets = google.sheets({
      version: "v4",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Contacts!A:F",
    })

    const rows = response.data.values || []
    const crmData: Record<string, any> = {}

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i]
      if (row[0]) {
        crmData[row[0]] = {
          name: row[1] || "",
          lastMeeting: row[2] || "",
          status: row[3] || "",
          notes: row[4] || "",
          lastAction: row[5] || "",
        }
      }
    }

    return NextResponse.json({ crmData })
  } catch (error) {
    console.error("Sheets API error:", error)
    // Return empty CRM data on error instead of throwing
    return NextResponse.json({ crmData: {} })
  }
}
