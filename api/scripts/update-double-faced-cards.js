const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'cardboard_garden',
  charset: 'utf8mb4'
};

async function updateDoubleFacedCards() {
  let connection;
  
  try {
    console.log('🔗 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    
    // Find all double-faced cards that need updating
    console.log('🔍 Finding double-faced cards...');
    const [doubleFacedCards] = await connection.execute(`
      SELECT id, name, scryfall_uri 
      FROM cards 
      WHERE name LIKE '%//%' 
      AND card_faces IS NULL
    `);
    
    console.log(`📊 Found ${doubleFacedCards.length} double-faced cards to update`);
    
    let updated = 0;
    let failed = 0;
    
    for (const card of doubleFacedCards) {
      try {
        console.log(`⚡ Updating: ${card.name}`);
        
        // Extract card ID from Scryfall URI
        const cardIdMatch = card.scryfall_uri.match(/\/card\/([^\/]+)\/([^\/]+)\/([^?]+)/);
        if (!cardIdMatch) {
          console.log(`⚠️  Could not parse Scryfall URI: ${card.scryfall_uri}`);
          failed++;
          continue;
        }
        
        const [, setCode, cardNumber] = cardIdMatch;
        const apiUrl = `https://api.scryfall.com/cards/${setCode}/${cardNumber}`;
        
        // Fetch fresh data from Scryfall
        const response = await fetch(apiUrl);
        if (!response.ok) {
          console.log(`⚠️  Failed to fetch from Scryfall: ${response.status}`);
          failed++;
          continue;
        }
        
        const scryfallData = await response.json();
        
        // Update the card with proper data
        await connection.execute(`
          UPDATE cards SET
            layout = ?,
            card_faces = ?,
            oracle_id = ?,
            type_line = ?,
            oracle_text = ?,
            mana_cost = ?,
            image_uri_small = ?,
            image_uri_normal = ?,
            image_uri_large = ?
          WHERE id = ?
        `, [
          scryfallData.layout || 'double_faced_token',
          scryfallData.card_faces ? JSON.stringify(scryfallData.card_faces) : null,
          scryfallData.oracle_id || null,
          scryfallData.type_line || null,
          scryfallData.oracle_text || null,
          scryfallData.mana_cost || null,
          scryfallData.card_faces?.[0]?.image_uris?.small || null,
          scryfallData.card_faces?.[0]?.image_uris?.normal || null,
          scryfallData.card_faces?.[0]?.image_uris?.large || null,
          card.id
        ]);
        
        updated++;
        console.log(`✅ Updated: ${card.name}`);
        
        // Rate limiting - Scryfall allows 10 requests per second
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`❌ Error updating ${card.name}:`, error.message);
        failed++;
      }
    }
    
    console.log(`\\n📊 Update Summary:`);
    console.log(`✅ Successfully updated: ${updated} cards`);
    console.log(`❌ Failed to update: ${failed} cards`);
    
    // Show sample of updated cards
    const [sampleResults] = await connection.execute(`
      SELECT name, layout, 
        CASE 
          WHEN card_faces IS NOT NULL THEN 'Has face data'
          ELSE 'No face data'
        END as face_status,
        CASE
          WHEN image_uri_normal IS NOT NULL THEN 'Has image'
          ELSE 'No image'
        END as image_status
      FROM cards 
      WHERE name LIKE '%//%' 
      LIMIT 5
    `);
    
    console.log('\\n🎭 Sample Updated Cards:');
    console.table(sampleResults);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the migration
console.log('🎭 Starting Double-Faced Card Migration...');
updateDoubleFacedCards();
