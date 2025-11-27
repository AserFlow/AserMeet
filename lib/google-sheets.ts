import { google } from "googleapis"

export async function getCRMData(accessToken: string, spreadsheetId: string) {
  try {
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

    return crmData
  } catch (error) {
    console.error("Failed to fetch CRM data:", error)
    // Return empty object if fetch fails, don't throw
    return {}
  }
}
