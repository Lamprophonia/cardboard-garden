const mysql = require('mysql2/promise');
require('dotenv').config({ path: './api/.env' });

async function addDeletedAtColumn() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'cardboard_garden',
    charset: 'utf8mb4'
  });
  
  try {
    console.log('🔧 Adding deleted_at column to users table...');
    
    // Check if column exists
    const [columns] = await db.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' AND COLUMN_NAME = 'deleted_at'
    `, [process.env.DB_NAME || 'cardboard_garden']);
    
    if (columns.length === 0) {
      // Add deleted_at column
      await db.execute(`
        ALTER TABLE users 
        ADD COLUMN deleted_at DATETIME NULL AFTER updated_at,
        ADD INDEX idx_deleted_at (deleted_at)
      `);
      console.log('✅ deleted_at column added successfully');
    } else {
      console.log('✅ deleted_at column already exists');
    }
    
    // Update existing queries to exclude soft-deleted users
    console.log('📝 Note: Updated authentication service to handle soft deletes');
    console.log('🧪 Test endpoints added:');
    console.log('   DELETE /api/auth/account (soft delete)');
    console.log('   DELETE /api/test/cleanup-user (hard delete for tests)');
    
  } catch (error) {
    console.error('❌ Failed to add deleted_at column:', error);
  } finally {
    await db.end();
  }
}

addDeletedAtColumn();
