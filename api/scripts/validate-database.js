const mysql = require('mysql2/promise');
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

async function validateDatabase() {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('🔍 Database Validation Report');
    console.log('=====================================\n');

    // Overall Statistics
    const [stats] = await connection.execute(`
      SELECT 
        COUNT(*) as total_cards,
        COUNT(DISTINCT set_code) as total_sets,
        COUNT(DISTINCT oracle_id) as unique_cards,
        COUNT(CASE WHEN image_uri_normal IS NOT NULL THEN 1 END) as cards_with_images,
        COUNT(CASE WHEN oracle_text IS NOT NULL THEN 1 END) as cards_with_text
      FROM cards
    `);

    const s = stats[0];
    console.log('📊 Overall Statistics:');
    console.log(`   Total cards: ${s.total_cards.toLocaleString()}`);
    console.log(`   Unique sets: ${s.total_sets}`);
    console.log(`   Unique cards: ${s.unique_cards.toLocaleString()}`);
    console.log(`   Cards with images: ${s.cards_with_images.toLocaleString()} (${(s.cards_with_images/s.total_cards*100).toFixed(1)}%)`);
    console.log(`   Cards with text: ${s.cards_with_text.toLocaleString()} (${(s.cards_with_text/s.total_cards*100).toFixed(1)}%)`);

    // Set Analysis
    console.log('\n📦 Set Analysis (Top 20 by card count):');
    const [sets] = await connection.execute(`
      SELECT set_code, set_name, COUNT(*) as card_count
      FROM cards
      GROUP BY set_code, set_name
      ORDER BY card_count DESC
      LIMIT 20
    `);

    sets.forEach(set => {
      console.log(`   ${set.set_name} (${set.set_code}): ${set.card_count} cards`);
    });

    // Final Fantasy Validation
    console.log('\n🎮 Final Fantasy Sets:');
    const [ffSets] = await connection.execute(`
      SELECT set_code, set_name, COUNT(*) as card_count
      FROM cards
      WHERE set_name LIKE '%Final Fantasy%'
      GROUP BY set_code, set_name
      ORDER BY set_name
    `);

    let totalFF = 0;
    ffSets.forEach(set => {
      console.log(`   ${set.set_name} (${set.set_code}): ${set.card_count} cards`);
      totalFF += set.card_count;
    });
    console.log(`   Total Final Fantasy cards: ${totalFF}`);

    // Vincent Cards Validation
    console.log('\n👤 Vincent Cards:');
    const [vincentCards] = await connection.execute(`
      SELECT id, name, set_name, rarity
      FROM cards
      WHERE LOWER(name) LIKE '%vincent%'
      ORDER BY name
    `);

    if (vincentCards.length > 0) {
      vincentCards.forEach(card => {
        console.log(`   ✅ ${card.name} (${card.set_name}, ${card.rarity})`);
      });
    } else {
      console.log('   ❌ No Vincent cards found');
    }

    // Data Quality Checks
    console.log('\n🔍 Data Quality Checks:');
    
    // Missing data checks
    const [quality] = await connection.execute(`
      SELECT 
        COUNT(CASE WHEN name IS NULL OR name = '' THEN 1 END) as missing_names,
        COUNT(CASE WHEN set_code IS NULL OR set_code = '' THEN 1 END) as missing_sets,
        COUNT(CASE WHEN rarity IS NULL OR rarity = '' THEN 1 END) as missing_rarity,
        COUNT(CASE WHEN oracle_id IS NULL THEN 1 END) as missing_oracle_id
      FROM cards
    `);

    const q = quality[0];
    console.log(`   Missing names: ${q.missing_names}`);
    console.log(`   Missing set codes: ${q.missing_sets}`);
    console.log(`   Missing rarity: ${q.missing_rarity}`);
    console.log(`   Missing Oracle IDs: ${q.missing_oracle_id}`);

    // Duplicate checks
    const [duplicates] = await connection.execute(`
      SELECT COUNT(*) as duplicate_count
      FROM (
        SELECT id, COUNT(*) as count
        FROM cards
        GROUP BY id
        HAVING count > 1
      ) dups
    `);

    console.log(`   Duplicate card IDs: ${duplicates[0].duplicate_count}`);

    // Recent sets check
    console.log('\n📅 Recent Sets (2024+):');
    const [recentSets] = await connection.execute(`
      SELECT set_name, COUNT(*) as card_count, MIN(released_at) as release_date
      FROM cards
      WHERE released_at >= '2024-01-01'
      GROUP BY set_name
      ORDER BY release_date DESC
      LIMIT 10
    `);

    recentSets.forEach(set => {
      console.log(`   ${set.set_name}: ${set.card_count} cards (${set.release_date})`);
    });

    console.log('\n✅ Validation complete!');

  } catch (error) {
    console.error('❌ Validation failed:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run validation
validateDatabase();
