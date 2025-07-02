# Netlify Deployment Guide

This guide will help you deploy the React+Tailwind Slack Tickets Dashboard to Netlify.

## Prerequisites

1. A Netlify account (free tier is sufficient)
2. Your project pushed to a Git repository (GitHub, GitLab, or Bitbucket)
3. Database access credentials

## Environment Variables Setup

### Required Environment Variables

Set these environment variables in your Netlify dashboard:

1. **DB_HOST**: `34.170.113.11`
2. **DB_PORT**: `3306`
3. **DB_USER**: `alina`
4. **DB_PASSWORD**: `{z"B=8aM;0DNOHO_`
5. **DB_NAME**: `dev` (or `prod` for production)

### How to Set Environment Variables in Netlify

1. Go to your Netlify dashboard
2. Select your site
3. Go to **Site settings** > **Environment variables**
4. Click **Add variable** for each of the above
5. Enter the **Key** and **Value** for each variable
6. Click **Save**

## Deployment Steps

### 1. Connect Your Repository

1. Log in to [Netlify](https://netlify.com)
2. Click **"New site from Git"**
3. Choose your Git provider (GitHub, GitLab, or Bitbucket)
4. Select your repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Base directory**: (leave empty)

### 2. Configure Build Settings

The `netlify.toml` file in your project root already contains the necessary configuration:

```toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"
```

### 3. Set Environment Variables

Add the database environment variables as described in the section above.

### 4. Deploy

1. Click **"Deploy site"**
2. Wait for the build to complete
3. Your site will be available at a random Netlify URL (e.g., `https://amazing-name-123456.netlify.app`)

### 5. Custom Domain (Optional)

1. Go to **Site settings** > **Domain management**
2. Click **Add custom domain**
3. Follow the instructions to configure your DNS

## API Endpoints

The deployed application will use Netlify Functions for the backend API. The following endpoints will be available:

- `GET /api/slack-tickets` - Get all tickets with filtering/pagination
- `GET /api/slack-tickets/search` - Search tickets
- `GET /api/slack-tickets/analytics` - Get analytics data
- `GET /api/slack-tickets/channels` - Get channel names (returns empty array)
- `GET /api/slack-tickets/:id` - Get ticket by ID
- `POST /api/slack-tickets` - Create new ticket
- `PUT /api/slack-tickets/:id` - Update ticket
- `DELETE /api/slack-tickets/:id` - Delete ticket

## Local Development vs Production

- **Local Development**: Uses Express server on `http://localhost:3002`
- **Production**: Uses Netlify Functions via `/api` endpoints

The application automatically detects the environment and uses the appropriate API base URL.

## Build Commands

- **Development**: `npm run dev:full` (runs both frontend and backend)
- **Frontend Only**: `npm run dev`
- **Backend Only**: `npm run backend`
- **Production Build**: `npm run build`

## Troubleshooting

### Build Fails

1. Check that all environment variables are set correctly
2. Ensure Node.js version is 18 or higher
3. Check build logs for specific error messages

### Database Connection Issues

1. Verify environment variables are correct
2. Check database server accessibility
3. Ensure database credentials have proper permissions

### Function Timeouts

Netlify Functions have a 10-second timeout on the free tier. If queries take longer:

1. Optimize database queries
2. Add proper indexes to database tables
3. Consider upgrading to Netlify Pro for longer timeouts

### CORS Issues

The Netlify functions are configured with proper CORS headers. If you still encounter CORS issues:

1. Check that API calls are going to the correct endpoints
2. Verify the redirect rules in `netlify.toml`

## Security Considerations

1. **Environment Variables**: Never commit database credentials to your repository
2. **Database Access**: Consider restricting database access to specific IPs if possible
3. **SSL**: Netlify provides HTTPS by default for all sites

## Monitoring and Logs

1. **Build Logs**: Available in Netlify dashboard under "Deploys"
2. **Function Logs**: Available in Netlify dashboard under "Functions"
3. **Real-time Logs**: Use `netlify dev` for local development with function simulation

## Performance Optimization

1. **Static Assets**: Automatically cached by Netlify CDN
2. **Database Queries**: Consider adding pagination limits
3. **Function Cold Starts**: First function call may be slower

## Backup and Recovery

1. **Database Backups**: Ensure regular database backups are in place
2. **Code Backups**: Your Git repository serves as code backup
3. **Environment Variables**: Keep a secure backup of environment variables

## Support

If you encounter issues:

1. Check Netlify documentation
2. Review function logs in Netlify dashboard
3. Test API endpoints using browser developer tools
4. Verify database connectivity independently

## Cost Considerations

**Netlify Free Tier Includes:**
- 100GB bandwidth per month
- 300 build minutes per month
- 125,000 function invocations per month
- Custom domain support

For higher usage, consider upgrading to Netlify Pro. 