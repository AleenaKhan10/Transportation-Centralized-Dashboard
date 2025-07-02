const mysql = require('mysql2/promise');

// Database connection configuration
const dbConfig = {
  host: '34.170.113.11',
  port: 3306,
  user: 'alina',
  password: '{z"B=8aM;0DNOHO_',
  database: 'dev',
  connectTimeout: 10000
};

async function testDatabase() {
  try {
    console.log('🔍 Testing database connection...');
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database successfully');

    // Test table exists
    console.log('🔍 Checking if table exists...');
    const [tables] = await connection.execute("SHOW TABLES LIKE 'slack_tickets_and_suggestions'");
    console.log('📋 Tables found:', tables);

    if (tables.length === 0) {
      console.log('❌ Table slack_tickets_and_suggestions does not exist');
      await connection.end();
      return;
    }

    // Check table structure
    console.log('🔍 Checking table structure...');
    const [columns] = await connection.execute("DESCRIBE slack_tickets_and_suggestions");
    console.log('📋 Table columns:', columns);

    // Count records
    console.log('🔍 Counting records...');
    const [countResult] = await connection.execute('SELECT COUNT(*) as total FROM slack_tickets_and_suggestions');
    console.log(`📊 Total records: ${countResult[0].total}`);

    // Sample records
    console.log('🔍 Fetching sample records...');
    const [sampleRecords] = await connection.execute('SELECT * FROM slack_tickets_and_suggestions LIMIT 3');
    console.log('📋 Sample records:', JSON.stringify(sampleRecords, null, 2));

    await connection.end();
    console.log('✅ Database test completed');

  } catch (error) {
    console.error('❌ Database error:', error.message);
    console.error('❌ Full error:', error);
  }
}

testDatabase(); 