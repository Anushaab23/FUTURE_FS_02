require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Database Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'minicrm',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Initialize Database Table
async function initializeDB() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });

    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'minicrm'}\``);
    await connection.end();

    // Create table if it doesn't exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS leads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        source VARCHAR(255) DEFAULT 'Website Contact Form',
        status ENUM('New', 'Contacted', 'Converted') DEFAULT 'New',
        notes TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await pool.query(createTableQuery);
    console.log('MySQL Database initialized successfully');
  } catch (err) {
    console.error('MySQL initialization error:', err.message || err);
  }
}

// Run DB initialization
initializeDB();


// --- Routes ---

// 1. Admin Login Route
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  // Demo credentials
  if (username === 'admin' && password === 'admin123') {
    res.json({ success: true, token: 'admin-mock-token-123' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// 2. Create Lead (Public - triggered from website contact form)
app.post('/api/leads', async (req, res) => {
  try {
    const { name, email, source, notes } = req.body;

    const [result] = await pool.query(
      'INSERT INTO leads (name, email, source, notes) VALUES (?, ?, ?, ?)',
      [name, email, source || 'Website Contact Form', notes || '']
    );

    res.status(201).json({
      success: true,
      lead: { id: result.insertId, name, email, source, status: 'New', notes }
    });
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Simple Authentication Middleware to protect Admin routes
const requireAuth = (req, res, next) => {
  const token = req.headers.authorization;
  if (token === 'Bearer admin-mock-token-123') {
    next();
  } else {
    res.status(401).json({ success: false, message: 'Unauthorized access' });
  }
};

// 2b. Create Lead (Admin - manual entry)
app.post('/api/admin/leads', requireAuth, async (req, res) => {
  try {
    const { name, email, source, notes } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and Email are required' });
    }

    const [result] = await pool.query(
      'INSERT INTO leads (name, email, source, notes, status) VALUES (?, ?, ?, ?, ?)',
      [name, email, source || 'Manual Entry', notes || '', 'New']
    );

    res.status(201).json({
      success: true,
      lead: { id: result.insertId, name, email, source: source || 'Manual Entry', status: 'New', notes }
    });
  } catch (error) {
    console.error('Error creating admin lead:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});


// 3. Get All Leads (Admin only)
app.get('/api/leads', requireAuth, async (req, res) => {
  try {
    const [leads] = await pool.query('SELECT * FROM leads ORDER BY createdAt DESC');
    res.json({ success: true, leads });
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// 4. Update Lead Status & Notes (Admin only)
app.put('/api/leads/:id', requireAuth, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const { id } = req.params;

    // Check if lead exists
    const [leads] = await pool.query('SELECT * FROM leads WHERE id = ?', [id]);
    if (leads.length === 0) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    // Update query dynamically based on inputs
    const setClauses = [];
    const values = [];

    if (status) {
      setClauses.push('status = ?');
      values.push(status);
    }
    if (typeof notes !== 'undefined') {
      setClauses.push('notes = ?');
      values.push(notes);
    }

    if (setClauses.length > 0) {
      values.push(id);
      await pool.query(
        `UPDATE leads SET ${setClauses.join(', ')} WHERE id = ?`,
        values
      );
    }

    // Fetch updated lead to return
    const [updatedLead] = await pool.query('SELECT * FROM leads WHERE id = ?', [id]);
    res.json({ success: true, lead: updatedLead[0] });
  } catch (error) {
    console.error('Error updating lead:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// 5. Analytics/Dashboard summary (Admin only)
app.get('/api/analytics', requireAuth, async (req, res) => {
  try {
    const [totalRows] = await pool.query('SELECT COUNT(*) as count FROM leads');
    const [statusRows] = await pool.query('SELECT status, COUNT(*) as count FROM leads GROUP BY status');

    const totalLeads = totalRows[0].count;

    let newLeads = 0;
    let contactedLeads = 0;
    let convertedLeads = 0;

    statusRows.forEach(row => {
      if (row.status === 'New') newLeads = row.count;
      if (row.status === 'Contacted') contactedLeads = row.count;
      if (row.status === 'Converted') convertedLeads = row.count;
    });

    res.json({
      success: true,
      data: {
        totalLeads,
        newLeads,
        contactedLeads,
        convertedLeads
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Server Start
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Connected to MySQL Database via WAMP');
});
