const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const PORT = 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection configuration
const dbConfig = {
  host: '34.170.113.11',
  port: 3306,
  user: 'alina',
  password: '{z"B=8aM;0DNOHO_',
  database: 'dev',
  connectTimeout: 10000,
  acquireTimeout: 10000,
  timeout: 10000
};

// Create connection pool
const pool = mysql.createPool({
  ...dbConfig,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
}



// Get all slack tickets with filtering
app.get('/api/slack-tickets', async (req, res) => {
  try {
    const { page = 1, limit = 50, channel_name, user_id, search, confidence_min } = req.query;
    const offset = (page - 1) * limit;
    
    let query = 'SELECT * FROM slack_tickets_and_suggestions WHERE 1=1';
    const params = [];
    
    if (channel_name) {
      query += ' AND channel_name = ?';
      params.push(channel_name);
    }
    
    if (user_id) {
      query += ' AND user_id = ?';
      params.push(user_id);
    }
    
    if (search) {
      query += ' AND (user_message LIKE ? OR ai_response LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    if (confidence_min) {
      query += ' AND confidence_score >= ?';
      params.push(parseFloat(confidence_min));
    }
    
    query += ` ORDER BY created_at DESC LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;
    
    const [rows] = await pool.execute(query, params);
    
    // Get total count for pagination - rebuild query without limit/offset
    let countQuery = 'SELECT COUNT(*) as total FROM slack_tickets_and_suggestions WHERE 1=1';
    const countParams = [];
    
    if (channel_name) {
      countQuery += ' AND channel_name = ?';
      countParams.push(channel_name);
    }
    
    if (user_id) {
      countQuery += ' AND user_id = ?';
      countParams.push(user_id);
    }
    
    if (search) {
      countQuery += ' AND (user_message LIKE ? OR ai_response LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`);
    }
    
    if (confidence_min) {
      countQuery += ' AND confidence_score >= ?';
      countParams.push(parseFloat(confidence_min));
    }
    
    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;
    
    res.json({
      data: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching slack tickets:', error);
    res.status(500).json({ error: 'Failed to fetch slack tickets' });
  }
});

// Get unique channel names (not needed for single channel, but keeping for compatibility)
app.get('/api/slack-tickets/channels', async (req, res) => {
  try {
    res.json([]);
  } catch (error) {
    console.error('Error fetching channels:', error);
    res.status(500).json({ error: 'Failed to fetch channels' });
  }
});

// Get analytics data
app.get('/api/slack-tickets/analytics', async (req, res) => {
  try {
    // Total tickets
    const [totalResult] = await pool.execute('SELECT COUNT(*) as total FROM slack_tickets_and_suggestions');
    const totalTickets = totalResult[0].total;
    
    // Average confidence score
    const [avgResult] = await pool.execute('SELECT AVG(confidence_score) as avg_score FROM slack_tickets_and_suggestions WHERE confidence_score IS NOT NULL');
    const avgConfidenceScore = avgResult[0].avg_score || 0;
    
    // Mentions count
    const [mentionsResult] = await pool.execute('SELECT COUNT(*) as mentions FROM slack_tickets_and_suggestions WHERE is_mention = 1');
    const mentionsCount = mentionsResult[0].mentions;
    
    // Daily stats for last 30 days
    const [dailyStats] = await pool.execute(`
      SELECT 
        DATE(created_at) as date, 
        COUNT(*) as count 
      FROM slack_tickets_and_suggestions 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(created_at) 
      ORDER BY date DESC
    `);
    
    res.json({
      totalTickets,
      avgConfidenceScore: Math.round(avgConfidenceScore * 100) / 100,
      mentionsCount,
      channelStats: [],
      dailyStats
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Search tickets (MUST be before /:id route!)
app.get('/api/slack-tickets/search', async (req, res) => {
  try {
    const { q, page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;
    
    if (!q || q.trim() === '') {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const query = `
      SELECT * FROM slack_tickets_and_suggestions 
      WHERE user_message LIKE ? OR ai_response LIKE ? OR channel_name LIKE ?
      ORDER BY created_at DESC 
      LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}
    `;
    
    const searchTerm = `%${q}%`;
    const [rows] = await pool.execute(query, [searchTerm, searchTerm, searchTerm]);
    
    // Get total count
    const [countResult] = await pool.execute(
      'SELECT COUNT(*) as total FROM slack_tickets_and_suggestions WHERE user_message LIKE ? OR ai_response LIKE ? OR channel_name LIKE ?',
      [searchTerm, searchTerm, searchTerm]
    );
    
    const total = countResult[0].total;
    
    res.json({
      data: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error searching tickets:', error);
    res.status(500).json({ error: 'Failed to search tickets' });
  }
});

// Get tickets by thread
app.get('/api/slack-tickets/thread/:threadTs', async (req, res) => {
  try {
    const { threadTs } = req.params;
    const [rows] = await pool.execute(
      'SELECT * FROM slack_tickets_and_suggestions WHERE thread_ts = ? ORDER BY created_at ASC',
      [threadTs]
    );
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching thread tickets:', error);
    res.status(500).json({ error: 'Failed to fetch thread tickets' });
  }
});

// Get ticket by ID (MUST be after specific routes like /search!)
app.get('/api/slack-tickets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute('SELECT * FROM slack_tickets_and_suggestions WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({ error: 'Failed to fetch ticket' });
  }
});

// Create new ticket
app.post('/api/slack-tickets', async (req, res) => {
  try {
    const {
      message_id, user_id, channel_id, channel_name, user_message,
      ai_response, confidence_score, response_sources, thread_ts, is_mention
    } = req.body;
    
    const query = `
      INSERT INTO slack_tickets_and_suggestions 
      (message_id, user_id, channel_id, channel_name, user_message, ai_response, 
       confidence_score, response_sources, thread_ts, is_mention, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
    
    const [result] = await pool.execute(query, [
      message_id, user_id, channel_id, channel_name, user_message,
      ai_response, confidence_score, response_sources, thread_ts, is_mention || false
    ]);
    
    // Get the created ticket
    const [newTicket] = await pool.execute('SELECT * FROM slack_tickets_and_suggestions WHERE id = ?', [result.insertId]);
    
    res.status(201).json(newTicket[0]);
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ error: 'Failed to create ticket' });
  }
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Local API server running on http://localhost:${PORT}`);
  await testConnection();
}); 