const mysql = require('mysql2/promise');
const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'cardboard_garden',
  charset: 'utf8mb4'
};

const SCRYFALL_API_BASE = 'https://api.scryfall.com';
let connection;

// Rate limiting: Scryfall allows 50-100 requests per second
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

console.log('🃏 Starting Scryfall data import...');
console.log('📅 Fetching Magic sets from the last 2 years');

async function importScryfallData() {
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');

    // Get all sets from the last 2 years
    const sets = await getRecentSets();
    console.log(`📦 Found ${sets.length} sets to import`);

    let totalCards = 0;
    let importedCards = 0;
    let skippedCards = 0;

    for (const set of sets) {
      console.log(`\n🔄 Processing set: ${set.name} (${set.code}) - Released: ${set.released_at}`);
      
      try {
        const cards = await getSetCards(set.code);
        console.log(`   📋 Found ${cards.length} cards in set`);
        totalCards += cards.length;

        for (const card of cards) {
          try {
            const wasImported = await importCard(card);
            if (wasImported) {
              importedCards++;
            } else {
              skippedCards++;
            }
          } catch (error) {
            console.warn(`   ⚠️ Failed to import card "${card.name}":`, error.message);
            skippedCards++;
          }
        }

        console.log(`   ✅ Set ${set.code} complete`);
        
        // Rate limiting - wait between sets
        await delay(1000);
        
      } catch (error) {
        console.error(`   ❌ Failed to process set ${set.code}:`, error.message);
      }
    }

    console.log('\n🎉 Import complete!');
    console.log(`📊 Total cards processed: ${totalCards}`);
    console.log(`✅ Cards imported: ${importedCards}`);
    console.log(`⏭️ Cards skipped (already exist): ${skippedCards}`);

  } catch (error) {
    console.error('❌ Import failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function getRecentSets() {
  console.log('🔍 Fetching recent sets from Scryfall...');
  
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
  const cutoffDate = twoYearsAgo.toISOString().split('T')[0];

  try {
    const response = await axios.get(`${SCRYFALL_API_BASE}/sets`);
    const allSets = response.data.data;

    // Filter sets from the last 2 years, exclude digital-only and funny sets
    const recentSets = allSets.filter(set => {
      const releaseDate = new Date(set.released_at);
      const isRecent = releaseDate >= twoYearsAgo;
      const isPhysical = !set.digital;
      const isSerious = !['funny', 'memorabilia'].includes(set.set_type);
      
      return isRecent && isPhysical && isSerious;
    });

    // Sort by release date (newest first)
    recentSets.sort((a, b) => new Date(b.released_at) - new Date(a.released_at));

    console.log(`✅ Found ${recentSets.length} recent sets (since ${cutoffDate})`);
    recentSets.forEach(set => {
      console.log(`   📦 ${set.name} (${set.code}) - ${set.released_at} - ${set.card_count} cards`);
    });

    return recentSets;
  } catch (error) {
    console.error('❌ Failed to fetch sets:', error.message);
    throw error;
  }
}

async function getSetCards(setCode) {
  try {
    const response = await axios.get(`${SCRYFALL_API_BASE}/cards/search?q=set:${setCode}&unique=cards`);
    return response.data.data || [];
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // No cards found for this set
      return [];
    }
    throw error;
  }
}

async function importCard(card) {
  try {
    // Check if card already exists
    const [existing] = await connection.execute(
      'SELECT id FROM cards WHERE id = ?',
      [card.id]
    );

    if (existing.length > 0) {
      return false; // Card already exists, skip
    }

    // Prepare card data
    const cardData = {
      id: card.id,
      oracle_id: card.oracle_id || null,
      name: card.name,
      mana_cost: card.mana_cost || null,
      cmc: card.cmc || 0,
      type_line: card.type_line || null,
      oracle_text: card.oracle_text || null,
      power: card.power || null,
      toughness: card.toughness || null,
      colors: card.colors ? JSON.stringify(card.colors) : null,
      color_identity: card.color_identity ? JSON.stringify(card.color_identity) : null,
      set_code: card.set,
      set_name: card.set_name,
      collector_number: card.collector_number,
      rarity: card.rarity,
      image_uri_small: card.image_uris?.small || null,
      image_uri_normal: card.image_uris?.normal || null,
      image_uri_large: card.image_uris?.large || null,
      scryfall_uri: card.scryfall_uri,
      released_at: card.released_at || null
    };

    // Insert card into database
    await connection.execute(`
      INSERT INTO cards (
        id, oracle_id, name, mana_cost, cmc, type_line, oracle_text,
        power, toughness, colors, color_identity, set_code, set_name,
        collector_number, rarity, image_uri_small, image_uri_normal,
        image_uri_large, scryfall_uri, released_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      cardData.id, cardData.oracle_id, cardData.name, cardData.mana_cost,
      cardData.cmc, cardData.type_line, cardData.oracle_text, cardData.power,
      cardData.toughness, cardData.colors, cardData.color_identity,
      cardData.set_code, cardData.set_name, cardData.collector_number,
      cardData.rarity, cardData.image_uri_small, cardData.image_uri_normal,
      cardData.image_uri_large, cardData.scryfall_uri, cardData.released_at
    ]);

    return true; // Card imported successfully
  } catch (error) {
    console.error(`Failed to import card ${card.name}:`, error.message);
    throw error;
  }
}

// Run the import
importScryfallData();
