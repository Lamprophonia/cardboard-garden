const mysql = require('mysql2');
require('dotenv').config({ path: '.env' });

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASSWORD || '',
  database: 'cardboard_garden'
});

// Look for cards with same Oracle ID but DIFFERENT names
db.query(`
  SELECT oracle_id, 
         COUNT(DISTINCT name) as unique_names,
         GROUP_CONCAT(DISTINCT name SEPARATOR ' | ') as names,
         GROUP_CONCAT(DISTINCT set_code SEPARATOR ', ') as sets
  FROM cards 
  GROUP BY oracle_id 
  HAVING unique_names > 1
  ORDER BY unique_names DESC 
  LIMIT 20
`, (err, results) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('🃏 Cards with DIFFERENT names but same Oracle ID:');
    console.log('='.repeat(80));
    if (results.length === 0) {
      console.log('No cards found with different names for same Oracle ID.');
      console.log('This means our current dataset doesn\'t have alternate name reprints.');
    } else {
      results.forEach(row => {
        console.log(`Oracle ID: ${row.oracle_id}`);
        console.log(`Different Names (${row.unique_names}): ${row.names}`);
        console.log(`Found in sets: ${row.sets}`);
        console.log('-'.repeat(60));
      });
    }
  }
  db.end();
});
