// Frontend model - types and interfaces only
// Actual database operations happen on the backend via API calls

export class SlackTicketModel {
  static tableName = 'slack_tickets_and_suggestions';

  // Note: In a frontend React app, these operations should be done through API calls
  // This class primarily serves as a reference for the data structure and operations
  // The actual implementations are in the backend (Netlify functions) and service layer

  static getTableSchema() {
    return {
      id: 'int AUTO_INCREMENT PRIMARY KEY',
      message_id: 'varchar(255)',
      user_id: 'varchar(100)',
      channel_id: 'varchar(100)',
      channel_name: 'varchar(255)',
      user_message: 'text',
      ai_response: 'text',
      confidence_score: 'decimal(3,2)',
      response_sources: 'text',
      thread_ts: 'varchar(50)',
      created_at: 'timestamp DEFAULT CURRENT_TIMESTAMP',
      updated_at: 'timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
      is_mention: 'tinyint(1) DEFAULT 0',
      processed_at: 'timestamp NULL'
    };
  }

  static getCreateTableSQL() {
    return `
      CREATE TABLE ${this.tableName} (
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
    `;
  }
} 