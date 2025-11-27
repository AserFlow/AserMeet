# AserMeet - AI Meeting Prep Tool

AserMeet is a comprehensive AI-powered meeting preparation tool that helps you prepare for meetings using Google Calendar and a lightweight CRM stored in Google Sheets. It provides AI-generated insights including opening lines, suggested questions, risks, and opportunities.

## Features

- **Google Calendar Integration**: Automatically fetch your next 5 upcoming meetings
- **AI-Powered Meeting Prep**: Generate comprehensive meeting preparations using OpenAI's GPT-4
- **Google Sheets CRM**: Pull attendee context from your CRM stored in Google Sheets
- **One-Click Prep Generation**: Generate complete meeting prep summaries with a single click
- **Copy to Clipboard**: Easily copy the entire prep summary for use in emails or notes
- **Clean, Minimalist UI**: Black & white theme with a modern, professional design
- **Mobile Responsive**: Fully responsive design that works on all devices

## Tech Stack

- **Frontend**: Next.js 16 with React 19, TypeScript
- **Backend**: Next.js API Routes
- **Authentication**: NextAuth.js with Google OAuth
- **AI**: OpenAI GPT-4 via AI SDK
- **Database APIs**: Google Calendar, Google Sheets
- **Styling**: Tailwind CSS v4

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ installed
- A Google Cloud account with:
  - Google Calendar API enabled
  - Google Sheets API enabled
  - OAuth 2.0 credentials (Desktop/Web application)
- An OpenAI API key

### 2. Clone and Install

\`\`\`bash
git clone <your-repo-url>
cd asermeet
npm install
\`\`\`

### 3. Google Cloud Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable these APIs:
   - Google Calendar API
   - Google Sheets API
4. Create OAuth 2.0 credentials:
   - Go to Credentials > Create Credentials > OAuth 2.0 Client ID
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (development)
     - `https://yourdomain.com/api/auth/callback/google` (production)
5. Copy your Client ID and Client Secret

### 4. Environment Variables

Create a `.env.local` file in the root directory:

\`\`\`
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# OpenAI
OPENAI_API_KEY=your_openai_api_key_here

# Google Sheets (optional)
# Find this in your Google Sheet URL: docs.google.com/spreadsheets/d/{SPREADSHEET_ID}
NEXT_PUBLIC_SHEETS_ID=your_spreadsheet_id_here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_a_random_string_here
\`\`\`

To generate `NEXTAUTH_SECRET`, run:
\`\`\`bash
openssl rand -base64 32
\`\`\`

### 5. Google Sheets Setup (Optional)

If you want to use the CRM feature:

1. Create a Google Sheet with this structure:

| Email | Name | Last Meeting | Status | Notes | Last Action |
|-------|------|--------------|--------|-------|-------------|
| john@example.com | John Smith | Q3 Planning | Active | Interested in Q4 roadmap | Sent proposal |
| jane@example.com | Jane Doe | Product Review | Active | Focus on performance | Waiting feedback |

2. Share the sheet with your Google OAuth app's service account (or use the same Google account)
3. Copy the Spreadsheet ID from the URL and add it to `.env.local` as `NEXT_PUBLIC_SHEETS_ID`

### 6. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit http://localhost:3000 and sign in with your Google account.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `OPENAI_API_KEY`
   - `NEXTAUTH_URL` (set to your Vercel domain)
   - `NEXTAUTH_SECRET` (generate a new one with `openssl rand -base64 32`)
   - `NEXT_PUBLIC_SHEETS_ID` (optional)
4. Deploy

### Deploy to Other Platforms

Similar setup as Vercel - ensure all environment variables are configured and Node.js 18+ is available.

## How It Works

1. **Sign In**: Use your Google account to authenticate
2. **View Meetings**: See your next 5 upcoming meetings from Google Calendar
3. **Prepare Meeting**: Click "Prepare Meeting" button to generate AI insights
4. **AI Generation**: The app fetches:
   - Meeting details from Google Calendar
   - Attendee context from Google Sheets CRM (if configured)
   - Generates comprehensive prep using OpenAI GPT-4
5. **Review & Copy**: View the complete prep summary and copy it for use elsewhere

## Prep Summary Sections

- **Quick Overview**: Meeting purpose and key points
- **What Happened Last Time**: Relevant history with attendees
- **What To Say First**: Specific opening line
- **Suggested Questions**: 5 strategic questions to ask
- **Risks & Opportunities**: Key risks and opportunities
- **Follow-Up Draft**: Template for post-meeting follow-up

## API Endpoints

- `GET /api/auth/signin` - Sign in with Google
- `GET /api/auth/callback/google` - OAuth callback
- `GET /api/calendar` - Fetch upcoming meetings
- `GET /api/crm` - Fetch CRM data from Google Sheets
- `POST /api/prep` - Generate meeting prep summary

## Troubleshooting

### "Failed to fetch calendar events"
- Check that Google Calendar API is enabled in Google Cloud
- Verify OAuth scopes include `calendar.readonly`
- Ensure access token is valid

### "Failed to generate meeting prep"
- Check that OpenAI API key is valid and has credits
- Verify the model specified in the API route is available
- Check OpenAI API status

### "Failed to fetch CRM data"
- Verify `NEXT_PUBLIC_SHEETS_ID` is correct
- Ensure the Google Sheet is shared with the OAuth account
- Check that sheet has "Contacts" tab with expected columns

### Sign-in loop
- Verify `NEXTAUTH_SECRET` is set in environment variables
- Check `NEXTAUTH_URL` matches your actual domain
- Verify Google OAuth credentials are correct

## Future Enhancements

- [ ] Meeting prep history storage
- [ ] Custom CRM field mapping
- [ ] Slack integration for sharing prep
- [ ] Email prep summaries before meetings
- [ ] Meeting notes and follow-up tracking
- [ ] Advanced analytics on meeting effectiveness

## License

MIT

## Support

For issues or questions, please open an issue in the repository.
