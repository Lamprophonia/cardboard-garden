const mysql = require('mysql2/promise');
require('dotenv').config();

async function runMigration() {
  let connection;
  
  try {
    console.log('🔗 Connecting to database...');
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'password',
      database: 'cardboard_garden'
    });
    
    console.log('📊 Adding layout column...');
    try {
      await connection.execute('ALTER TABLE cards ADD COLUMN layout VARCHAR(50) DEFAULT "normal" AFTER type_line');
      console.log('✅ Layout column added');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️  Layout column already exists');
      } else {
        throw error;
      }
    }
    
    console.log('📊 Adding card_faces column...');
    try {
      await connection.execute('ALTER TABLE cards ADD COLUMN card_faces JSON AFTER layout');
      console.log('✅ Card_faces column added');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️  Card_faces column already exists');
      } else {
        throw error;
      }
    }
    
    console.log('📊 Updating double-faced cards layout...');
    const [result] = await connection.execute(`
      UPDATE cards 
      SET layout = 'double_faced_token' 
      WHERE name LIKE '%//%' AND layout = 'normal'
    `);
    console.log(`✅ Updated ${result.affectedRows} double-faced cards`);
    
    console.log('📊 Creating indexes...');
    try {
      await connection.execute('CREATE INDEX idx_layout ON cards (layout)');
      console.log('✅ Layout index created');
    } catch (error) {
      if (error.code === 'ER_DUP_KEYNAME') {
        console.log('ℹ️  Layout index already exists');
      } else {
        throw error;
      }
    }
    
    // Show sample results
    const [sampleCards] = await connection.execute(`
      SELECT name, layout, 
        CASE 
          WHEN card_faces IS NOT NULL THEN 'Has face data'
          ELSE 'No face data'
        END as face_status
      FROM cards 
      WHERE name LIKE '%//%' 
      LIMIT 5
    `);
    
    console.log('\n🎭 Sample Double-Faced Cards:');
    console.table(sampleCards);
    
    console.log('\n✅ Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

runMigration();
