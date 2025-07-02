const mysql = require('mysql2/promise');

// Test database connection with the exact same config as Netlify
const dbConfig = {
  host: '34.170.113.11',
  port: 3306,
  user: 'alina',
  password: '{z"B=8aM;0DNOHO_',
  database: 'dev',
  ssl: false,
  connectTimeout: 10000
};

async function testConnection() {
  console.log('🔍 Testing database connection...');
  console.log('Config:', {
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    database: dbConfig.database
  });

  try {
    // Create connection
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected successfully!');
    
    // Test query
    const [rows] = await connection.execute('SELECT CONNECTION_ID(), USER(), CURRENT_USER()');
    console.log('📊 Connection info:', rows[0]);
    
    // Test table access
    const [tables] = await connection.execute('SHOW TABLES FROM dev');
    console.log('📋 Available tables:', tables.length);
    
    // Test slack tickets table
    try {
      const [count] = await connection.execute('SELECT COUNT(*) as count FROM slack_tickets_and_suggestions');
      console.log('🎫 Slack tickets count:', count[0].count);
    } catch (tableError) {
      console.log('⚠️  Table access error:', tableError.message);
    }
    
    await connection.end();
    console.log('✅ Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Error code:', error.code);
    console.error('Error errno:', error.errno);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 This is a user permission error. Solutions:');
      console.log('1. Execute the SQL commands in diagnose-and-fix-mysql.sql');
      console.log('2. Make sure to run them as a MySQL admin user');
      console.log('3. Check that the user was created with wildcard host (%)');
    }
  }
}

testConnection(); 