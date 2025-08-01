const mysql = require('mysql2/promise');
const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'cardboard_garden',
  charset: 'utf8mb4'
};

const SCRYFALL_API_BASE = 'https://api.scryfall.com';

console.log('🃏 Complete Scryfall Database Import');
console.log('📥 This will download ALL Magic: The Gathering cards');
console.log('⏱️  Estimated time: 30-60 minutes');
console.log('💾 Expected size: ~27,000+ cards');

async function importCompleteDatabase() {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Database connected');

    // Get bulk data from Scryfall (most efficient method)
    console.log('\n🔍 Fetching bulk data information...');
    const bulkResponse = await axios.get(`${SCRYFALL_API_BASE}/bulk-data`);
    const defaultCards = bulkResponse.data.data.find(item => item.type === 'default_cards');
    
    if (!defaultCards) {
      throw new Error('Could not find default_cards bulk data');
    }

    console.log(`📊 Bulk data: ${(defaultCards.size / 1024 / 1024).toFixed(1)} MB`);
    console.log(`   Updated: ${defaultCards.updated_at}`);
    console.log(`   Starting download...`);

    // Download and process bulk data
    const downloadResponse = await axios.get(defaultCards.download_uri, {
      responseType: 'stream',
      timeout: 600000 // 10 minute timeout
    });

    let cardData = '';
    let totalSize = 0;
    const startTime = Date.now();

    downloadResponse.data.on('data', (chunk) => {
      cardData += chunk;
      totalSize += chunk.length;
      
      if (totalSize % (20 * 1024 * 1024) < chunk.length) {
        const downloadedMB = (totalSize / 1024 / 1024).toFixed(1);
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`   📥 ${downloadedMB} MB downloaded (${elapsed}s)`);
      }
    });

    await new Promise((resolve, reject) => {
      downloadResponse.data.on('end', resolve);
      downloadResponse.data.on('error', reject);
    });

    console.log(`✅ Download complete: ${(totalSize / 1024 / 1024).toFixed(1)} MB`);

    // Parse and import
    console.log('🔄 Parsing JSON data...');
    const allCards = JSON.parse(cardData);
    console.log(`📋 ${allCards.length.toLocaleString()} cards to process`);

    // Clear existing data (optional - comment out to append instead)
    console.log('🗑️  Clearing existing card data...');
    await connection.execute('DELETE FROM cards');
    console.log('✅ Existing data cleared');

    // Import in batches
    const batchSize = 1000;
    let imported = 0;
    let errors = 0;

    for (let i = 0; i < allCards.length; i += batchSize) {
      const batch = allCards.slice(i, i + batchSize);
      const batchResult = await processBatch(connection, batch);
      
      imported += batchResult.imported;
      errors += batchResult.errors;

      const progress = ((i + batchSize) / allCards.length * 100).toFixed(1);
      console.log(`   📊 ${progress}% | ${imported.toLocaleString()} imported | ${errors} errors`);
    }

    console.log('\n🎉 Import complete!');
    console.log(`   ✅ Cards imported: ${imported.toLocaleString()}`);
    console.log(`   ❌ Errors: ${errors}`);

    // Final verification
    const [stats] = await connection.execute(`
      SELECT 
        COUNT(*) as total,
        COUNT(DISTINCT set_code) as sets,
        COUNT(DISTINCT oracle_id) as unique_cards
      FROM cards
    `);

    console.log('\n📊 Database statistics:');
    console.log(`   Total cards: ${stats[0].total.toLocaleString()}`);
    console.log(`   Unique sets: ${stats[0].sets}`);
    console.log(`   Unique cards: ${stats[0].unique_cards.toLocaleString()}`);

  } catch (error) {
    console.error('❌ Import failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function processBatch(connection, cards) {
  let imported = 0;
  let errors = 0;

  for (const card of cards) {
    try {
      // Handle card faces for double-sided cards
      let cardFaces = null;
      if (card.card_faces && Array.isArray(card.card_faces)) {
        cardFaces = JSON.stringify(card.card_faces);
      }

      // Handle images (primary or from first face)
      let imageSmall = card.image_uris?.small;
      let imageNormal = card.image_uris?.normal;
      let imageLarge = card.image_uris?.large;

      if (!imageSmall && card.card_faces?.[0]?.image_uris) {
        imageSmall = card.card_faces[0].image_uris.small;
        imageNormal = card.card_faces[0].image_uris.normal;
        imageLarge = card.card_faces[0].image_uris.large;
      }

      // Insert card
      await connection.execute(`
        INSERT INTO cards (
          id, oracle_id, name, mana_cost, cmc, type_line, layout, card_faces,
          oracle_text, power, toughness, colors, color_identity, set_code, 
          set_name, collector_number, rarity, image_uri_small, image_uri_normal,
          image_uri_large, scryfall_uri, released_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        card.id,
        card.oracle_id || null,
        card.name,
        card.mana_cost || null,
        card.cmc || 0,
        card.type_line || null,
        card.layout || 'normal',
        cardFaces,
        card.oracle_text || null,
        card.power || null,
        card.toughness || null,
        card.colors ? JSON.stringify(card.colors) : null,
        card.color_identity ? JSON.stringify(card.color_identity) : null,
        card.set,
        card.set_name,
        card.collector_number,
        card.rarity,
        imageSmall || null,
        imageNormal || null,
        imageLarge || null,
        card.scryfall_uri,
        card.released_at || null
      ]);

      imported++;
    } catch (error) {
      errors++;
      if (errors <= 5) {
        console.warn(`   ⚠️  ${card.name}: ${error.message}`);
      }
    }
  }

  return { imported, errors };
}

// Run the import
importCompleteDatabase();
