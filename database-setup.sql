-- Create database
CREATE DATABASE IF NOT EXISTS agy_logistics;
USE agy_logistics;

-- Create slack_tickets_and_suggestions table
CREATE TABLE IF NOT EXISTS slack_tickets_and_suggestions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    message_id VARCHAR(255),
    user_id VARCHAR(100),
    channel_id VARCHAR(100),
    channel_name VARCHAR(255),
    user_message TEXT,
    ai_response TEXT,
    confidence_score DECIMAL(3,2),
    response_sources TEXT,
    thread_ts VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_mention TINYINT(1) DEFAULT 0,
    processed_at TIMESTAMP NULL,
    
    INDEX idx_channel_name (channel_name),
    INDEX idx_created_at (created_at),
    INDEX idx_is_mention (is_mention),
    INDEX idx_confidence_score (confidence_score),
    INDEX idx_message_id (message_id),
    INDEX idx_thread_ts (thread_ts)
);

-- Insert some sample data for testing (you can remove this after confirming the connection works)
INSERT INTO slack_tickets_and_suggestions (
    message_id, user_id, channel_id, channel_name, user_message, ai_response, 
    confidence_score, response_sources, thread_ts, is_mention, processed_at
) VALUES 
(
    'msg_001', 'U12345', 'C123456', 'general', 
    'What are the current shipping rates to New York?',
    'Based on our current rate sheet, shipping to New York starts at $85 for standard delivery (3-5 business days) and $135 for express delivery (1-2 business days). These rates apply to loads up to 26,000 lbs. For heavier loads or special requirements, please contact our dispatch team.',
    0.92, 'rate_sheet_2024, dispatch_guidelines', '1234567890.123456', 0, NOW()
),
(
    'msg_002', 'U67890', 'C123456', 'logistics', 
    '@agy_bot Can you check the status of load #LX789?',
    'Load #LX789 is currently in transit. The driver departed from Chicago at 14:30 EST and is expected to arrive in Detroit by 18:00 EST today. The load includes automotive parts and is on schedule. Tracking shows the last GPS ping was 30 minutes ago near Kalamazoo, MI.',
    0.88, 'load_tracking_system, gps_data', '1234567890.234567', 1, NOW()
),
(
    'msg_003', 'U11111', 'C789012', 'customer-support', 
    'How do I submit a damage claim for shipment #SH456?',
    'To submit a damage claim for shipment #SH456, please follow these steps:\n1. Take photos of the damaged items and packaging\n2. Fill out our online claim form at portal.agy-logistics.com/claims\n3. Attach the photos and original bill of lading\n4. Submit within 48 hours of delivery\n\nOur claims team will review and respond within 2 business days.',
    0.95, 'claims_procedure, customer_portal_guide', NULL, 0, NOW()
); 