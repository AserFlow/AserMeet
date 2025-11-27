import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const error = request.nextUrl.searchParams.get("error")

  return NextResponse.json(
    {
      error: error || "Authentication failed",
      message: "Please try signing in again.",
    },
    { status: 400 },
  )
}
