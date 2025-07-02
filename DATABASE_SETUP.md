# Database Setup for Slack Tickets Feature

## Prerequisites

1. **MySQL Server** (5.7 or higher) or **MariaDB** (10.2 or higher)
2. **Database access credentials** (host, username, password)

## Setup Instructions

### 1. Database Configuration

Create the following environment variables for your database connection:

```bash
# For Local Development (.env file - create this in your project root)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=agy_logistics
VITE_API_URL=/.netlify/functions
```

### 2. Create Database and Table

Run the provided SQL script to set up your database:

```bash
# Option 1: Using MySQL command line
mysql -u root -p < database-setup.sql

# Option 2: Using MySQL Workbench or phpMyAdmin
# Copy and paste the contents of database-setup.sql into your SQL editor and execute
```

### 3. Verify Database Setup

The `database-setup.sql` script will:
- Create the `agy_logistics` database
- Create the `slack_tickets_and_suggestions` table with proper indexes
- Insert 3 sample records for testing

### 4. Environment Variables for Production

For production deployment (Netlify), set these environment variables in your Netlify dashboard:

```
DB_HOST=your_production_host
DB_PORT=3306
DB_USER=your_production_user
DB_PASSWORD=your_production_password
DB_NAME=agy_logistics
```

### 5. Test the Connection

1. Start your development server: `npm run dev`
2. Navigate to the Slack Tickets page
3. You should see the 3 sample tickets from the database
4. Test the search and filter functionality

### 6. Database Schema

The `slack_tickets_and_suggestions` table includes:

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT AUTO_INCREMENT | Primary key |
| `message_id` | VARCHAR(255) | Slack message identifier |
| `user_id` | VARCHAR(100) | Slack user ID |
| `channel_id` | VARCHAR(100) | Slack channel ID |
| `channel_name` | VARCHAR(255) | Human-readable channel name |
| `user_message` | TEXT | Original user message |
| `ai_response` | TEXT | AI assistant response |
| `confidence_score` | DECIMAL(3,2) | AI confidence (0.00-1.00) |
| `response_sources` | TEXT | Sources used for the response |
| `thread_ts` | VARCHAR(50) | Slack thread timestamp |
| `created_at` | TIMESTAMP | Record creation time |
| `updated_at` | TIMESTAMP | Last update time |
| `is_mention` | TINYINT(1) | Whether this was a mention |
| `processed_at` | TIMESTAMP | When AI processed this |

### 7. Indexes for Performance

The table includes optimized indexes for:
- Channel filtering (`idx_channel_name`)
- Date range queries (`idx_created_at`)
- Mention filtering (`idx_is_mention`)
- Confidence score filtering (`idx_confidence_score`)
- Message lookup (`idx_message_id`)
- Thread grouping (`idx_thread_ts`)

## Troubleshooting

### Connection Issues
- Ensure MySQL server is running
- Check your credentials in environment variables
- Verify firewall settings allow database connections
- For production, ensure your database allows external connections

### No Data Showing
- Check browser console for API errors
- Verify the Netlify function is deployed correctly
- Ensure environment variables are set in Netlify dashboard

### Sample Data for Testing

If you need more test data, use this SQL:

```sql
INSERT INTO slack_tickets_and_suggestions (
    message_id, user_id, channel_id, channel_name, user_message, ai_response, 
    confidence_score, response_sources, thread_ts, is_mention
) VALUES 
('msg_004', 'U22222', 'C123456', 'dispatch', 
 'What is the ETA for driver John on route RT-445?',
 'Driver John (ID: D-1234) on route RT-445 has an estimated arrival time of 16:30 EST at the destination in Cleveland, OH. Current location shows Mile Marker 87 on I-71 North. Load is on schedule with no reported delays.',
 0.89, 'driver_tracking, route_optimization', NULL, 0),
('msg_005', 'U33333', 'C789012', 'billing', 
 '@agy_bot When will invoice #INV-2024-0156 be processed?',
 'Invoice #INV-2024-0156 was submitted on March 15th and is currently in the approval queue. Processing typically takes 3-5 business days from submission. You can expect processing to complete by March 20th. You will receive an email confirmation once processed.',
 0.94, 'billing_system, invoice_tracker', '1234567890.345678', 1);
```

## Ready to Use!

Once the database is set up and environment variables are configured, your Slack Tickets feature will automatically connect to the real database instead of using mock data. 