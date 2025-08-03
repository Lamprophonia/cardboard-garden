require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs').promises;
const net = require('net');
const authService = require('./services/authService');
const { authenticateToken, optionalAuth } = require('./middleware/auth');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
let PORT = parseInt(process.env.PORT, 10) || 3000;

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'cardboard_garden',
  charset: 'utf8mb4'
};

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Database connection test
let db;
async function connectDatabase() {
  try {
    db = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to MySQL database');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

// Health check route
app.get('/api/health', async (req, res) => {
  try {
    // Test database connection
    await db.execute('SELECT 1');
    res.json({ 
      status: 'healthy', 
      message: 'Cardboard Garden API is running',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Database setup endpoint (development only)
app.post('/api/setup/user-tables', async (req, res) => {
  try {
    // Create users table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        last_login TIMESTAMP NULL,
        is_active BOOLEAN DEFAULT FALSE,
        email_verified BOOLEAN DEFAULT FALSE,
        email_verification_token VARCHAR(255) NULL,
        email_verification_expires TIMESTAMP NULL,
        password_reset_token VARCHAR(255) NULL,
        password_reset_expires TIMESTAMP NULL,
        
        INDEX idx_username (username),
        INDEX idx_email (email),
        INDEX idx_created_at (created_at),
        INDEX idx_email_verification_token (email_verification_token),
        INDEX idx_password_reset_token (password_reset_token)
      )
    `);

    // Create user_sessions table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        session_token VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NOT NULL,
        ip_address VARCHAR(45) NULL,
        user_agent TEXT NULL,
        
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_session_token (session_token),
        INDEX idx_user_id (user_id),
        INDEX idx_expires_at (expires_at)
      )
    `);

    // Create user_collections table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS user_collections (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        card_id VARCHAR(50) NOT NULL,
        quantity INT DEFAULT 1 NOT NULL,
        condition_grade ENUM('mint', 'near_mint', 'excellent', 'good', 'light_played', 'played', 'poor') DEFAULT 'near_mint',
        foil BOOLEAN DEFAULT FALSE,
        language VARCHAR(10) DEFAULT 'en',
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        notes TEXT NULL,
        
        UNIQUE KEY unique_user_card (user_id, card_id, condition_grade, foil, language),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_card_id (card_id),
        INDEX idx_added_at (added_at)
      )
    `);

    res.json({
      success: true,
      message: 'User authentication tables created successfully',
      tables: ['users', 'user_sessions', 'user_collections']
    });
  } catch (error) {
    console.error('Database setup error:', error);
    res.status(500).json({
      error: 'Failed to create user tables',
      message: error.message
    });
  }
});

// Authentication routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    const result = await authService.registerUser(username, email, password);
    
    if (result.success) {
      res.status(201).json({
        success: true,
        message: result.message,
        emailSent: result.emailSent,
        previewUrl: result.previewUrl // For development
      });
    } else {
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('Registration endpoint error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
      return res.status(400).json({ error: 'Username/email and password are required' });
    }

    const result = await authService.loginUser(usernameOrEmail, password);
    
    if (result.success) {
      res.json({
        success: true,
        token: result.token,
        user: result.user
      });
    } else {
      res.status(401).json({ 
        error: result.error,
        needsVerification: result.needsVerification 
      });
    }
  } catch (error) {
    console.error('Login endpoint error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/auth/verify-email', async (req, res) => {
  try {
    const { token } = req.query;

    // Debug: log the raw token from the request
    console.log('[verify-email endpoint] Token from req.query:', token);

    if (!token) {
      return res.status(400).json({ error: 'Verification token is required' });
    }

    if (token === 'YOURTOKEN') {
      console.error('[verify-email endpoint] ERROR: Token is the literal string "YOURTOKEN". This should never happen.');
    }

    const result = await authService.verifyEmail(token);

    if (result.success) {
      res.json({
        success: true,
        message: result.message,
        user: result.user
      });
    } else {
      res.status(400).json({ 
        error: result.error,
        expired: result.expired 
      });
    }
  } catch (error) {
    console.error('Email verification endpoint error:', error);
    res.status(500).json({ error: 'Email verification failed' });
  }
});

app.post('/api/auth/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const result = await authService.resendVerificationEmail(email);
    
    if (result.success) {
      res.json({
        success: true,
        message: result.message,
        previewUrl: result.previewUrl // For development
      });
    } else {
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('Resend verification endpoint error:', error);
    res.status(500).json({ error: 'Failed to resend verification email' });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        created_at: req.user.created_at,
        last_login: req.user.last_login
      }
    });
  } catch (error) {
    console.error('Get user endpoint error:', error);
    res.status(500).json({ error: 'Failed to get user information' });
  }
});

// Account deletion - Soft delete (user-facing)
app.delete('/api/auth/account', authenticateToken, async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ error: 'Password confirmation required for account deletion' });
    }

    const result = await authService.deleteAccount(req.user.id, password);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Account deleted successfully'
      });
    } else {
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('Account deletion endpoint error:', error);
    res.status(500).json({ error: 'Account deletion failed' });
  }
});

// Hard delete for test cleanup (development only)
app.delete('/api/test/cleanup-user', async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ error: 'Test cleanup not available in production' });
    }

    const { email, username } = req.body;
    
    if (!email && !username) {
      return res.status(400).json({ error: 'Email or username required for cleanup' });
    }

    // Create fresh database connection for this operation
    const connection = await mysql.createConnection(dbConfig);

    try {
      let whereClause = '';
      let params = [];
      
      if (email) {
        whereClause = 'email = ?';
        params.push(email);
      } else {
        whereClause = 'username = ?';
        params.push(username);
      }

      // Hard delete user and all related data (CASCADE will handle related tables)
      const [result] = await connection.execute(`DELETE FROM users WHERE ${whereClause}`, params);
      
      res.json({
        success: true,
        message: `User cleaned up successfully`,
        deletedRows: result.affectedRows
      });
    } finally {
      await connection.end();
    }
  } catch (error) {
    console.error('Test cleanup endpoint error:', error);
    res.status(500).json({ error: 'Test cleanup failed' });
  }
});

// Magic: The Gathering routes
app.get('/api/cards/search', async (req, res) => {
  try {
    const { name, includeAlternatives = 'true' } = req.query;
    let allCards = [];
    
    if (name) {
      // First, search by name
      const nameQuery = 'SELECT * FROM cards WHERE name LIKE ? LIMIT 20';
      const [nameResults] = await db.execute(nameQuery, [`%${name}%`]);
      allCards = [...nameResults];
      
      // If includeAlternatives is true, also search for cards with same Oracle IDs
      if (includeAlternatives === 'true') {
        // Get Oracle IDs from name results
        let oracleIds = [...new Set(nameResults.map(card => card.oracle_id).filter(Boolean))];
        
        // Also find Oracle IDs of cards that match the search term (for reverse lookup)
        if (nameResults.length > 0) {
          const reverseOracleQuery = 'SELECT DISTINCT oracle_id FROM cards WHERE name LIKE ? AND oracle_id IS NOT NULL';
          const [reverseOracleResults] = await db.execute(reverseOracleQuery, [`%${name}%`]);
          const reverseOracleIds = reverseOracleResults.map(row => row.oracle_id);
          oracleIds = [...new Set([...oracleIds, ...reverseOracleIds])];
        }
        
        if (oracleIds.length > 0) {
          const placeholders = oracleIds.map(() => '?').join(',');
          const oracleQuery = `
            SELECT DISTINCT * FROM cards 
            WHERE oracle_id IN (${placeholders}) 
            AND name NOT LIKE ?
            LIMIT 30
          `;
          const [oracleResults] = await db.execute(oracleQuery, [...oracleIds, `%${name}%`]);
          
          // Add oracle results with a flag to indicate they're alternatives
          const alternativeCards = oracleResults.map(card => ({
            ...card,
            is_alternative: true
          }));
          
          allCards = [...allCards, ...alternativeCards];
        }
      }
    } else {
      // No search term, return recent cards
      const query = 'SELECT * FROM cards ORDER BY created_at DESC LIMIT 20';
      const [rows] = await db.execute(query);
      allCards = rows;
    }
    
    // Remove duplicates based on card ID
    const uniqueCards = allCards.filter((card, index, self) => 
      index === self.findIndex(c => c.id === card.id)
    );
    
    // Process card_faces for double-faced cards
    const processedCards = uniqueCards.map(card => {
      const processedCard = { ...card };
      
      // Parse card_faces JSON if it exists
      if (card.card_faces && typeof card.card_faces === 'string') {
        try {
          processedCard.card_faces = JSON.parse(card.card_faces);
        } catch (e) {
          console.warn('Failed to parse card_faces for card:', card.name);
        }
      }
      
      return processedCard;
    });
    
    res.json({ 
      cards: processedCards,
      count: processedCards.length,
      hasAlternatives: processedCards.some(card => card.is_alternative)
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to search cards',
      message: error.message
    });
  }
});

// Find alternative card names (same Oracle ID)
app.get('/api/cards/:cardId/alternatives', async (req, res) => {
  try {
    const { cardId } = req.params;
    
    // First get the Oracle ID of the requested card
    const [cardResult] = await db.execute('SELECT oracle_id, name FROM cards WHERE id = ?', [cardId]);
    
    if (cardResult.length === 0) {
      return res.status(404).json({ error: 'Card not found' });
    }
    
    const { oracle_id, name: originalName } = cardResult[0];
    
    if (!oracle_id) {
      return res.json({ alternatives: [], originalName, message: 'No Oracle ID available' });
    }
    
    // Find all other cards with the same Oracle ID
    const [alternatives] = await db.execute(
      'SELECT * FROM cards WHERE oracle_id = ? AND id != ? ORDER BY name',
      [oracle_id, cardId]
    );
    
    res.json({
      alternatives,
      originalName,
      oracleId: oracle_id,
      count: alternatives.length
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to find alternatives',
      message: error.message
    });
  }
});

// Collection routes
app.get('/api/collection', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT c.*, cards.name, cards.mana_cost, cards.type_line, cards.set_code, cards.image_uri_small
      FROM collection c
      JOIN cards ON c.card_id = cards.id
      ORDER BY c.created_at DESC
    `);
    res.json({ 
      collection: rows,
      count: rows.length
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch collection',
      message: error.message
    });
  }
});

// Port availability checker
async function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.once('close', () => resolve(true));
      server.close();
    });
    server.on('error', () => resolve(false));
  });
}

// Find available port starting from preferred port
async function findAvailablePort(startPort = 3000, maxAttempts = 5) {
  for (let i = 0; i < maxAttempts; i++) {
    const port = startPort + i;
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found in range ${startPort}-${startPort + maxAttempts - 1}`);
}

// Write port info for frontend to discover
async function writePortInfo(port) {
  const portInfo = {
    port: parseInt(port, 10),
    url: `http://localhost:${port}`,
    timestamp: new Date().toISOString()
  };
  
  try {
    await fs.writeFile(
      path.join(__dirname, '..', '.api-port'), 
      JSON.stringify(portInfo, null, 2)
    );
  } catch (error) {
    console.warn('Could not write port info file:', error.message);
  }
}

// Start server
connectDatabase().then(async () => {
  try {
    // Find available port
    PORT = await findAvailablePort(PORT);
    
    // Write port info for frontend
    await writePortInfo(PORT);
    
    app.listen(PORT, () => {
      console.log(`🃏 Cardboard Garden API running on port ${PORT}`);
      if (PORT !== 3000) {
        console.log(`⚠️  Note: Using port ${PORT} instead of default 3000`);
      }
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🔍 Card search: http://localhost:${PORT}/api/cards/search`);
      console.log(`📚 Collection: http://localhost:${PORT}/api/collection`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
});
