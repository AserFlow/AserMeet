# AserMeet Deployment Guide

## Deploy to Vercel (Recommended)

Vercel is the easiest way to deploy AserMeet with full Next.js support.

### Step 1: Push to GitHub

\`\`\`bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/asermeet.git
git push -u origin main
\`\`\`

### Step 2: Create Vercel Project

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Select your GitHub repository
4. Configure project:
   - Framework: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Install Command: `npm install`

### Step 3: Add Environment Variables

In Vercel project settings, add these environment variables:

\`\`\`
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
OPENAI_API_KEY=your_openai_api_key
NEXTAUTH_URL=https://your-vercel-domain.vercel.app
NEXTAUTH_SECRET=your_generated_secret
NEXT_PUBLIC_SHEETS_ID=your_spreadsheet_id (optional)
\`\`\`

### Step 4: Deploy

Click "Deploy" and wait for deployment to complete. Your app will be live at the Vercel domain.

### Step 5: Update Google OAuth

After deployment, update your Google Cloud OAuth credentials:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to Credentials
3. Edit the OAuth 2.0 Client ID
4. Add authorized redirect URIs:
   - `https://your-vercel-domain.vercel.app/api/auth/callback/google`

## Deploy to Other Platforms

### Render

1. Connect your GitHub repository to Render
2. Create new Web Service
3. Add environment variables
4. Deploy

### Railway

1. Connect GitHub repository
2. Create new project
3. Add environment variables
4. Deploy

### Self-Hosted (Docker)

Create a Dockerfile:

\`\`\`dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY .next ./.next
COPY public ./public

EXPOSE 3000

ENV NODE_ENV production

CMD ["npm", "start"]
\`\`\`

Build and deploy:

\`\`\`bash
docker build -t asermeet .
docker run -p 3000:3000 -e GOOGLE_CLIENT_ID=... asermeet
\`\`\`

## Environment Variables Checklist

- [ ] `GOOGLE_CLIENT_ID` - From Google Cloud Console
- [ ] `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
- [ ] `OPENAI_API_KEY` - From OpenAI Platform
- [ ] `NEXTAUTH_URL` - Your deployed domain
- [ ] `NEXTAUTH_SECRET` - Generated via `openssl rand -base64 32`
- [ ] `NEXT_PUBLIC_SHEETS_ID` - (Optional) Your Google Sheet ID

## Post-Deployment Checklist

- [ ] Test Google sign-in
- [ ] Verify calendar events load
- [ ] Test meeting prep generation
- [ ] Check error handling
- [ ] Monitor OpenAI API usage
- [ ] Set up alerts for failed deployments

## Troubleshooting Deployments

### Build failures
- Check Node.js version (18+)
- Verify all dependencies in package.json
- Run `npm ci` locally to test

### Runtime errors
- Check environment variables are set
- Review deployment logs
- Test API endpoints with curl

### Authentication issues
- Verify NEXTAUTH_URL matches domain
- Check OAuth redirect URIs
- Confirm NEXTAUTH_SECRET is set

## Performance Optimization

- Cache Google Calendar API responses
- Implement request rate limiting
- Use CDN for static assets (automatic on Vercel)
- Monitor OpenAI token usage

## Monitoring

Set up monitoring for:
- API error rates
- OpenAI API usage and costs
- Google API quota usage
- Authentication success rates

## Database (Future)

When adding persistent storage:
- Use Vercel Postgres or Neon
- Store prep history for each user
- Cache CRM data
- Track meeting outcomes

## Security Best Practices

- Use environment variables for all secrets
- Enable HTTPS only (automatic on Vercel)
- Implement request rate limiting
- Validate all user inputs
- Rotate secrets regularly
- Monitor for unauthorized access

## Cost Optimization

- Set OpenAI API usage limits
- Monitor Google API quota usage
- Use Vercel free tier if eligible
- Cache frequent API responses
- Consider request batching

## Support & Troubleshooting

For deployment issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test API endpoints locally
4. Review Google/OpenAI error messages
5. Contact support if issues persist
