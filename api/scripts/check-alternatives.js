const mysql = require('mysql2');
require('dotenv').config({ path: '.env' });

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASSWORD || '',
  database: 'cardboard_garden'
});

// Check for cards with same Oracle ID but different names
db.query(`
  SELECT oracle_id, COUNT(*) as count, GROUP_CONCAT(name SEPARATOR ' | ') as names
  FROM cards 
  GROUP BY oracle_id 
  HAVING count > 1 
  ORDER BY count DESC 
  LIMIT 10
`, (err, results) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Cards with multiple names (same Oracle ID):');
    console.log('='.repeat(60));
    results.forEach(row => {
      console.log(`Oracle ID: ${row.oracle_id}`);
      console.log(`Variations (${row.count}): ${row.names}`);
      console.log('-'.repeat(40));
    });
  }
  db.end();
});
