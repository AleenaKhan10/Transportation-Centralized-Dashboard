# Slack Tickets & Suggestions Feature Setup

This document outlines the setup and implementation of the Slack Tickets & Suggestions feature for the AGY Logistics Dashboard.

## Overview

The feature provides multiple views for analyzing AI interactions from Slack channels:

- **Chat View**: Natural conversation flow mimicking Slack interface
- **Table/Grid View**: High data density table with sorting and filtering
- **Card Layout**: Modern, visually appealing card-based layout
- **Analytics Dashboard**: Business insights with charts and metrics
- **Timeline View**: Chronological activity flow

## Database Setup

### 1. Database Schema

Create the following table in your MySQL database:

```sql
CREATE TABLE slack_tickets_and_suggestions (
  id int AUTO_INCREMENT PRIMARY KEY,
  message_id varchar(255),
  user_id varchar(100),
  channel_id varchar(100),
  channel_name varchar(255),
  user_message text,
  ai_response text,
  confidence_score decimal(3,2),
  response_sources text,
  thread_ts varchar(50),
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_mention tinyint(1) DEFAULT 0,
  processed_at timestamp NULL
);
```

### 2. Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# Database Configuration
VITE_DB_HOST=localhost
VITE_DB_PORT=3306
VITE_DB_USER=your_username
VITE_DB_PASSWORD=your_password
VITE_DB_NAME=agy_logistics

# API Configuration
VITE_API_URL=http://localhost:3000/api

# For Netlify Functions (production)
DB_HOST=your_production_host
DB_PORT=3306
DB_USER=your_production_user
DB_PASSWORD=your_production_password
DB_NAME=agy_logistics
```

## Installation

### 1. Install Dependencies

The MySQL driver has been added to package.json:

```bash
npm install
```

### 2. Enable Mock Data (Testing)

Currently, the feature uses mock data for testing. To switch between mock and real data:

In `src/services/slackTicketsService.ts`, change:
```typescript
const USE_MOCK_DATA = true; // Set to false when real API is available
```

### 3. Database Connection

The database configuration is set up in:
- `src/config/database.ts` - Database connection pool
- `src/models/SlackTicket.ts` - Data model with CRUD operations
- `netlify/functions/slack-tickets.js` - API endpoints

## File Structure

```
src/
├── components/
│   └── slack-tickets/
│       ├── SlackTicketsChatView.tsx
│       ├── SlackTicketsTableView.tsx
│       ├── SlackTicketsCardView.tsx
│       ├── SlackTicketsAnalyticsView.tsx
│       ├── SlackTicketsTimelineView.tsx
│       └── SlackTicketsFilters.tsx
├── config/
│   └── database.ts
├── models/
│   └── SlackTicket.ts
├── pages/
│   └── SlackTicketsPage.tsx
├── services/
│   ├── slackTicketsService.ts
│   └── mockSlackTicketsService.ts
└── types/
    └── index.ts (updated with Slack types)
```

## Usage

### 1. Navigation

The "Slack Tickets" tab has been added to the sidebar navigation. Users can access it at `/dashboard/slack-tickets`.

### 2. View Switching

Users can switch between different views using the view selector:
- Chat Interface
- Table/Grid
- Card Layout
- Analytics Dashboard
- Timeline

### 3. Filtering & Search

- **Search**: Text search across messages, responses, and channels
- **Filters**: Channel, mention type, confidence score range, date range
- **Export**: CSV export functionality

## API Endpoints

When using real data, the following endpoints will be available:

- `GET /api/slack-tickets` - Get tickets with pagination and filtering
- `GET /api/slack-tickets/:id` - Get specific ticket
- `GET /api/slack-tickets/channels` - Get channel names
- `GET /api/slack-tickets/analytics` - Get analytics data
- `GET /api/slack-tickets/search` - Search tickets
- `GET /api/slack-tickets/export` - Export to CSV
- `POST /api/slack-tickets` - Create new ticket
- `PUT /api/slack-tickets/:id` - Update ticket
- `DELETE /api/slack-tickets/:id` - Delete ticket

## Mock Data

For testing purposes, mock data includes:
- 5 sample tickets from different channels
- Analytics data with charts
- Realistic conversation examples
- Different confidence scores and message types

## Next Steps

1. **Set up actual database** with the provided schema
2. **Configure environment variables** for database connection
3. **Switch from mock to real data** by setting `USE_MOCK_DATA = false`
4. **Implement Slack integration** to populate the database
5. **Configure production deployment** with proper database credentials

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify environment variables
   - Check database server is running
   - Ensure user has proper permissions

2. **Mock Data Not Loading**
   - Check browser console for errors
   - Verify `USE_MOCK_DATA = true` in service file

3. **Navigation Issues**
   - Clear browser cache
   - Check for TypeScript compilation errors

### Support

For additional support or questions about implementation, refer to the codebase or contact the development team. 