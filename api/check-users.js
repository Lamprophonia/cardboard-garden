const mysql = require('mysql2/promise');

async function checkUsers() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'password',
      database: 'cardboard_garden'
    });

    const [rows] = await connection.execute('SELECT id, username, email, created_at, is_active, email_verified FROM users');
    
    console.log('=== EXISTING USERS ===');
    if (rows.length === 0) {
      console.log('No users found in database');
    } else {
      rows.forEach(user => {
        console.log(`ID: ${user.id}, Username: ${user.username}, Email: ${user.email}, Active: ${user.is_active}, Verified: ${user.email_verified}, Created: ${user.created_at}`);
      });
    }
    
    await connection.end();
  } catch (error) {
    console.error('Database error:', error.message);
  }
}

checkUsers();
