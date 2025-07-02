const mysql = require('mysql2/promise');

// Database configuration - use environment variables in production
const dbConfig = {
  host: process.env.DB_HOST || '34.170.113.11',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'alina',
  password: process.env.DB_PASSWORD || '{z"B=8aM;0DNOHO_',
  database: process.env.DB_NAME || 'dev',
  ssl: false,
  connectTimeout: 60000,
  acquireTimeout: 60000,
  timeout: 60000
};

// Create connection pool
let pool = null;

const getPool = () => {
  if (!pool) {
    pool = mysql.createPool({
      ...dbConfig,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      acquireTimeout: 60000,
      timeout: 60000,
      reconnect: true
    });
  }
  return pool;
};

const tableName = 'slack_tickets_and_suggestions';

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    const pool = getPool();
    const { httpMethod, path, queryStringParameters } = event;
    const pathSegments = path.split('/').filter(segment => segment);
    
    // Remove .netlify/functions/slack-tickets from path segments
    const relevantSegments = pathSegments.slice(pathSegments.indexOf('slack-tickets') + 1);
    const endpoint = relevantSegments[0] || '';

    switch (httpMethod) {
      case 'GET':
        // Handle search first (before checking for ID)
        if (endpoint === 'search') {
          return await searchTickets(pool, queryStringParameters, headers);
        } else if (endpoint === 'channels') {
          return await getChannelNames(pool, headers);
        } else if (endpoint === 'analytics') {
          return await getAnalytics(pool, headers);
        } else if (endpoint === 'export') {
          return await exportTickets(pool, queryStringParameters, headers);
        } else if (relevantSegments.includes('thread')) {
          const threadTs = relevantSegments[relevantSegments.length - 1];
          return await getTicketsByThread(pool, threadTs, headers);
        } else if (!isNaN(parseInt(endpoint)) && endpoint !== '') {
          return await getTicketById(pool, parseInt(endpoint), headers);
        } else if (endpoint === '' || endpoint === 'slack-tickets') {
          // Default GET request for tickets list
          return await getSlackTickets(pool, queryStringParameters, headers);
        }
        break;

      case 'POST':
        if (endpoint === '' || endpoint === 'slack-tickets') {
          const ticketData = JSON.parse(event.body);
          return await createTicket(pool, ticketData, headers);
        }
        break;

      case 'PUT':
        if (!isNaN(parseInt(endpoint))) {
          const ticketData = JSON.parse(event.body);
          return await updateTicket(pool, parseInt(endpoint), ticketData, headers);
        }
        break;

      case 'DELETE':
        if (!isNaN(parseInt(endpoint))) {
          return await deleteTicket(pool, parseInt(endpoint), headers);
        }
        break;

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Endpoint not found' }),
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
    };
  }
};

// Get slack tickets with filtering and pagination
async function getSlackTickets(pool, params, headers) {
  const page = parseInt(params?.page || '1');
  const limit = parseInt(params?.limit || '50');
  const offset = (page - 1) * limit;

  let whereClause = '';
  const queryParams = [];
  const conditions = [];

  // Build WHERE clause based on filters
  if (params?.channel_name) {
    conditions.push('channel_name = ?');
    queryParams.push(params.channel_name);
  }

  if (params?.user_id) {
    conditions.push('user_id = ?');
    queryParams.push(params.user_id);
  }

  if (params?.search) {
    conditions.push('(user_message LIKE ? OR ai_response LIKE ?)');
    queryParams.push(`%${params.search}%`, `%${params.search}%`);
  }

  if (params?.is_mention !== undefined) {
    conditions.push('is_mention = ?');
    queryParams.push(params.is_mention === 'true' ? 1 : 0);
  }

  if (params?.confidence_min !== undefined) {
    conditions.push('confidence_score >= ?');
    queryParams.push(parseFloat(params.confidence_min));
  }

  if (params?.confidence_score_max !== undefined) {
    conditions.push('confidence_score <= ?');
    queryParams.push(parseFloat(params.confidence_score_max));
  }

  if (params?.date_from) {
    conditions.push('created_at >= ?');
    queryParams.push(params.date_from);
  }

  if (params?.date_to) {
    conditions.push('created_at <= ?');
    queryParams.push(params.date_to);
  }

  if (conditions.length > 0) {
    whereClause = 'WHERE ' + conditions.join(' AND ');
  }

  // Get total count
  const countQuery = `SELECT COUNT(*) as total FROM ${tableName} ${whereClause}`;
  const [countResult] = await pool.execute(countQuery, queryParams);
  const total = countResult[0].total;

  // Get paginated results using direct value insertion for LIMIT/OFFSET
  const dataQuery = `
    SELECT * FROM ${tableName} 
    ${whereClause}
    ORDER BY created_at DESC 
    LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}
  `;
  
  const [rows] = await pool.execute(dataQuery, queryParams);

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      data: rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }),
  };
}

// Get ticket by ID
async function getTicketById(pool, id, headers) {
  const query = `SELECT * FROM ${tableName} WHERE id = ?`;
  const [rows] = await pool.execute(query, [id]);
  
  if (rows.length === 0) {
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Ticket not found' }),
    };
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(rows[0]),
  };
}

// Get tickets by thread
async function getTicketsByThread(pool, threadTs, headers) {
  const query = `SELECT * FROM ${tableName} WHERE thread_ts = ? ORDER BY created_at ASC`;
  const [rows] = await pool.execute(query, [threadTs]);

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(rows),
  };
}

// Get channel names (empty since we removed channels)
async function getChannelNames(pool, headers) {
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify([]),
  };
}

// Get analytics data
async function getAnalytics(pool, headers) {
  // Total tickets
  const [totalResult] = await pool.execute(`SELECT COUNT(*) as total FROM ${tableName}`);
  const totalTickets = totalResult[0].total;

  // Average confidence score
  const [avgResult] = await pool.execute(`SELECT AVG(confidence_score) as avg_score FROM ${tableName} WHERE confidence_score IS NOT NULL`);
  const avgConfidenceScore = avgResult[0].avg_score || 0;

  // Mentions count
  const [mentionsResult] = await pool.execute(`SELECT COUNT(*) as mentions FROM ${tableName} WHERE is_mention = 1`);
  const mentionsCount = mentionsResult[0].mentions;

  // Daily stats for last 30 days
  const [dailyResult] = await pool.execute(`
    SELECT DATE(created_at) as date, COUNT(*) as count 
    FROM ${tableName} 
    WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    GROUP BY DATE(created_at) 
    ORDER BY date DESC
  `);

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      totalTickets,
      avgConfidenceScore: Math.round(avgConfidenceScore * 100) / 100,
      mentionsCount,
      channelStats: [], // Empty since we removed channels
      dailyStats: dailyResult
    }),
  };
}

// Search tickets
async function searchTickets(pool, params, headers) {
  const query = params?.q || '';
  const page = parseInt(params?.page || '1');
  const limit = parseInt(params?.limit || '50');
  const offset = (page - 1) * limit;

  if (!query || query.trim() === '') {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Search query is required' }),
    };
  }

  const searchQuery = `%${query}%`;
  
  // Get total count
  const countQuery = `
    SELECT COUNT(*) as total 
    FROM ${tableName} 
    WHERE user_message LIKE ? OR ai_response LIKE ? OR channel_name LIKE ?
  `;
  const [countResult] = await pool.execute(countQuery, [searchQuery, searchQuery, searchQuery]);
  const total = countResult[0].total;

  // Get paginated results using direct value insertion for LIMIT/OFFSET
  const dataQuery = `
    SELECT * FROM ${tableName} 
    WHERE user_message LIKE ? OR ai_response LIKE ? OR channel_name LIKE ?
    ORDER BY created_at DESC 
    LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}
  `;
  
  const [rows] = await pool.execute(dataQuery, [searchQuery, searchQuery, searchQuery]);

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      data: rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }),
  };
}

// Export tickets to CSV
async function exportTickets(pool, params, headers) {
  // This would typically generate a CSV file
  // For now, return JSON data that can be converted to CSV on the frontend
  const { tickets } = await getSlackTickets(pool, { ...params, limit: '10000' }, headers);
  
  return {
    statusCode: 200,
    headers: {
      ...headers,
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="slack-tickets.csv"'
    },
    body: convertToCSV(JSON.parse(tickets.body).data),
  };
}

// Create ticket
async function createTicket(pool, ticketData, headers) {
  const query = `
    INSERT INTO ${tableName} 
    (message_id, user_id, channel_id, channel_name, user_message, ai_response, 
     confidence_score, response_sources, thread_ts, is_mention, processed_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const [result] = await pool.execute(query, [
    ticketData.message_id,
    ticketData.user_id,
    ticketData.channel_id,
    ticketData.channel_name,
    ticketData.user_message,
    ticketData.ai_response,
    ticketData.confidence_score,
    ticketData.response_sources,
    ticketData.thread_ts,
    ticketData.is_mention ? 1 : 0,
    ticketData.processed_at
  ]);

  const newTicket = await getTicketById(pool, result.insertId, headers);
  return newTicket;
}

// Update ticket
async function updateTicket(pool, id, updates, headers) {
  const updateFields = [];
  const params = [];
  
  Object.entries(updates).forEach(([key, value]) => {
    if (key !== 'id' && key !== 'created_at' && value !== undefined) {
      updateFields.push(`${key} = ?`);
      params.push(key === 'is_mention' ? (value ? 1 : 0) : value);
    }
  });
  
  if (updateFields.length === 0) {
    return await getTicketById(pool, id, headers);
  }
  
  updateFields.push('updated_at = NOW()');
  params.push(id);
  
  const query = `UPDATE ${tableName} SET ${updateFields.join(', ')} WHERE id = ?`;
  await pool.execute(query, params);
  
  return await getTicketById(pool, id, headers);
}

// Delete ticket
async function deleteTicket(pool, id, headers) {
  const query = `DELETE FROM ${tableName} WHERE id = ?`;
  const [result] = await pool.execute(query, [id]);
  
  return {
    statusCode: result.affectedRows > 0 ? 200 : 404,
    headers,
    body: JSON.stringify({ 
      success: result.affectedRows > 0,
      message: result.affectedRows > 0 ? 'Ticket deleted' : 'Ticket not found'
    }),
  };
}

// Helper function to convert data to CSV
function convertToCSV(data) {
  if (!data.length) return '';
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape quotes and wrap in quotes if contains comma
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');
  
  return csvContent;
} 