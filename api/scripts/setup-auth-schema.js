const path = require('path');
const fs = require('fs');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Database configuration (same as server.js)
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'cardboard_garden',
  charset: 'utf8mb4'
};

async function runSchema() {
  let db;
  
  try {
    console.log('🗄️  Setting up user authentication schema...');
    
    // Create database connection
    db = await mysql.createConnection(dbConfig);
    console.log('📡 Connected to database');
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, '..', '..', 'sql', '11_user_authentication_enhanced.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Split into individual statements (simple approach)
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
      .filter(stmt => !stmt.match(/^(DELIMITER|CREATE PROCEDURE|BEGIN|END)$/i));
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.length > 10) { // Skip very short statements
        try {
          console.log(`   ${i + 1}/${statements.length}: ${statement.substring(0, 50)}...`);
          await db.execute(statement);
        } catch (error) {
          if (error.code === 'ER_TABLE_EXISTS_ERROR' || error.message.includes('already exists')) {
            console.log(`   ✅ Already exists (skipping)`);
          } else {
            console.warn(`   ⚠️  Warning: ${error.message}`);
          }
        }
      }
    }
    
    // Test the setup by querying the users table
    console.log('\n🔍 Verifying setup...');
    const [users] = await db.execute('SELECT COUNT(*) as count FROM users');
    const [tables] = await db.execute(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'cardboard_garden' 
        AND table_name IN ('users', 'user_preferences', 'user_collections', 'password_reset_tokens', 'user_sessions')
      ORDER BY table_name
    `);
    
    console.log(`\n✅ User authentication setup complete!`);
    console.log(`   📊 Tables created: ${tables.map(t => t.table_name).join(', ')}`);
    console.log(`   👥 Users in database: ${users[0].count}`);
    
    if (users[0].count > 0) {
      const [adminUser] = await db.execute('SELECT username, email, email_verified FROM users WHERE id = 1');
      if (adminUser.length > 0) {
        console.log(`   🔑 Admin user: ${adminUser[0].username} (${adminUser[0].email}) - Verified: ${adminUser[0].email_verified}`);
      }
    }
    
    console.log('\n🚀 Next steps:');
    console.log('   1. Add auth routes to Express app');
    console.log('   2. Get SendGrid API key for production emails');
    console.log('   3. Test user registration flow');
    
  } catch (error) {
    console.error('❌ Schema setup failed:', error.message);
    process.exit(1);
  } finally {
    if (db?.end) {
      await db.end();
    }
    process.exit(0);
  }
}

runSchema();
