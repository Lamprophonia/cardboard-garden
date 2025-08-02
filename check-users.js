const mysql = require('mysql2/promise');
require('dotenv').config({ path: './api/.env' });

async function checkTables() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'cardboard_garden',
    charset: 'utf8mb4'
  });
  
  console.log('🔍 Checking user tables...');
  
  const [tables] = await db.execute('SHOW TABLES LIKE "user%"');
  console.log('User tables:', tables.map(t => Object.values(t)[0]));
  
  if (tables.length > 0) {
    const [users] = await db.execute('SELECT id, username, email, email_verified FROM users LIMIT 5');
    console.log('Users:', users);
  }
  
  await db.end();
}

checkTables().catch(console.error);
