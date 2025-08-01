const mysql = require('mysql2/promise');
const axios = require('axios');
const path = require('path');
const fs = require('fs').promises;
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'cardboard_garden',
  charset: 'utf8mb4'
};

class DatabaseSyncer {
  constructor() {
    this.connection = null;
    this.logFile = path.join(__dirname, '..', 'logs', `sync-${new Date().toISOString().split('T')[0]}.log`);
    this.stats = {
      newCards: 0,
      updatedCards: 0,
      newSets: 0,
      errors: 0,
      startTime: new Date()
    };
  }

  async log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    
    console.log(logMessage);
    
    // Ensure logs directory exists
    const logsDir = path.dirname(this.logFile);
    try {
      await fs.mkdir(logsDir, { recursive: true });
      await fs.appendFile(this.logFile, logMessage + '\n');
    } catch (err) {
      console.error('Failed to write to log file:', err.message);
    }
  }

  async connect() {
    try {
      this.connection = await mysql.createConnection(dbConfig);
      await this.log('Database connected successfully');
    } catch (error) {
      await this.log(`Database connection failed: ${error.message}`, 'error');
      throw error;
    }
  }

  async checkBulkDataUpdate() {
    try {
      await this.log('Checking Scryfall bulk data for updates...');
      
      const response = await axios.get('https://api.scryfall.com/bulk-data/default-cards');
      const bulkData = response.data;
      
      const lastUpdated = new Date(bulkData.updated_at);
      const downloadUri = bulkData.download_uri;
      const sizeInMB = (bulkData.size / (1024 * 1024)).toFixed(1);
      
      await this.log(`Scryfall data: ${sizeInMB} MB, last updated: ${lastUpdated.toISOString()}`);
      
      // Check our last sync timestamp
      const [rows] = await this.connection.execute(`
        SELECT value FROM sync_metadata WHERE key_name = 'last_bulk_sync'
      `);
      
      let lastSync = null;
      if (rows.length > 0) {
        lastSync = new Date(rows[0].value);
        await this.log(`Last sync: ${lastSync.toISOString()}`);
      } else {
        await this.log('No previous sync found');
      }
      
      if (!lastSync || lastUpdated > lastSync) {
        await this.log('Update needed - downloading new data...');
        return { needsUpdate: true, downloadUri, lastUpdated, sizeInMB };
      } else {
        await this.log('Database is up to date');
        return { needsUpdate: false };
      }
      
    } catch (error) {
      await this.log(`Error checking bulk data: ${error.message}`, 'error');
      throw error;
    }
  }

  async downloadAndProcessCards(downloadUri) {
    try {
      await this.log('Downloading bulk card data...');
      
      const response = await axios.get(downloadUri, {
        responseType: 'stream',
        timeout: 300000 // 5 minute timeout
      });
      
      let downloadedData = '';
      let downloadedMB = 0;
      
      response.data.on('data', (chunk) => {
        downloadedData += chunk;
        downloadedMB = (Buffer.byteLength(downloadedData, 'utf-8') / (1024 * 1024));
        if (downloadedMB % 20 < 1) { // Log every ~20MB
          process.stdout.write(`\r   📥 ${downloadedMB.toFixed(1)} MB downloaded`);
        }
      });
      
      await new Promise((resolve, reject) => {
        response.data.on('end', resolve);
        response.data.on('error', reject);
      });
      
      console.log(''); // New line after download progress
      await this.log(`Download complete: ${downloadedMB.toFixed(1)} MB`);
      
      const cards = JSON.parse(downloadedData);
      await this.log(`Parsed ${cards.length} cards from Scryfall`);
      
      return cards;
      
    } catch (error) {
      await this.log(`Download failed: ${error.message}`, 'error');
      throw error;
    }
  }

  async syncCards(cards) {
    await this.log('Starting card synchronization...');
    
    // Create temporary table for new data
    await this.connection.execute(`
      CREATE TEMPORARY TABLE temp_cards LIKE cards
    `);
    
    let processed = 0;
    const batchSize = 1000;
    
    for (let i = 0; i < cards.length; i += batchSize) {
      const batch = cards.slice(i, i + batchSize);
      const values = [];
      const placeholders = [];
      
      for (const card of batch) {
        if (!card.id || !card.name) continue;
        
        placeholders.push('(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        values.push(
          card.id,
          card.oracle_id || null,
          card.name,
          card.lang || 'en',
          card.released_at || null,
          card.layout || null,
          card.mana_cost || null,
          card.cmc || 0,
          card.type_line || null,
          card.oracle_text || null,
          card.power || null,
          card.toughness || null,
          card.colors ? card.colors.join(',') : null,
          card.color_identity ? card.color_identity.join(',') : null,
          card.keywords ? card.keywords.join(',') : null,
          card.legalities ? JSON.stringify(card.legalities) : null,
          card.set,
          card.set_name,
          card.collector_number || null,
          card.rarity,
          card.artist || null,
          card.image_uris ? card.image_uris.normal : null,
          card.scryfall_uri || null
        );
      }
      
      if (placeholders.length > 0) {
        const query = `
          INSERT INTO temp_cards (
            id, oracle_id, name, lang, released_at, layout, mana_cost, cmc,
            type_line, oracle_text, power, toughness, colors, color_identity,
            keywords, legalities, set_code, set_name, collector_number,
            rarity, artist, image_uri_normal, scryfall_uri
          ) VALUES ${placeholders.join(', ')}
        `;
        
        try {
          await this.connection.execute(query, values);
          processed += batch.length;
          
          if (processed % 10000 === 0) {
            await this.log(`   📊 ${processed.toLocaleString()} cards processed`);
          }
        } catch (error) {
          this.stats.errors++;
          await this.log(`Batch error: ${error.message}`, 'error');
        }
      }
    }
    
    await this.log(`Finished processing ${processed.toLocaleString()} cards`);
    
    // Find new cards
    const [newCards] = await this.connection.execute(`
      SELECT COUNT(*) as count FROM temp_cards t
      WHERE NOT EXISTS (SELECT 1 FROM cards c WHERE c.id = t.id)
    `);
    this.stats.newCards = newCards[0].count;
    
    // Find updated cards (simplified - cards with different oracle_text)
    const [updatedCards] = await this.connection.execute(`
      SELECT COUNT(*) as count FROM temp_cards t
      INNER JOIN cards c ON c.id = t.id
      WHERE t.oracle_text != c.oracle_text OR (t.oracle_text IS NULL) != (c.oracle_text IS NULL)
    `);
    this.stats.updatedCards = updatedCards[0].count;
    
    // Insert new cards
    if (this.stats.newCards > 0) {
      await this.log(`Inserting ${this.stats.newCards.toLocaleString()} new cards...`);
      await this.connection.execute(`
        INSERT INTO cards SELECT * FROM temp_cards t
        WHERE NOT EXISTS (SELECT 1 FROM cards c WHERE c.id = t.id)
      `);
    }
    
    // Update existing cards
    if (this.stats.updatedCards > 0) {
      await this.log(`Updating ${this.stats.updatedCards.toLocaleString()} existing cards...`);
      await this.connection.execute(`
        UPDATE cards c
        INNER JOIN temp_cards t ON c.id = t.id
        SET c.oracle_id = t.oracle_id,
            c.name = t.name,
            c.lang = t.lang,
            c.released_at = t.released_at,
            c.layout = t.layout,
            c.mana_cost = t.mana_cost,
            c.cmc = t.cmc,
            c.type_line = t.type_line,
            c.oracle_text = t.oracle_text,
            c.power = t.power,
            c.toughness = t.toughness,
            c.colors = t.colors,
            c.color_identity = t.color_identity,
            c.keywords = t.keywords,
            c.legalities = t.legalities,
            c.set_code = t.set_code,
            c.set_name = t.set_name,
            c.collector_number = t.collector_number,
            c.rarity = t.rarity,
            c.artist = t.artist,
            c.image_uri_normal = t.image_uri_normal,
            c.scryfall_uri = t.scryfall_uri
        WHERE t.oracle_text != c.oracle_text OR (t.oracle_text IS NULL) != (c.oracle_text IS NULL)
      `);
    }
    
    await this.connection.execute('DROP TEMPORARY TABLE temp_cards');
  }

  async updateSyncMetadata(lastUpdated) {
    // Ensure sync_metadata table exists
    await this.connection.execute(`
      CREATE TABLE IF NOT EXISTS sync_metadata (
        key_name VARCHAR(255) PRIMARY KEY,
        value TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    await this.connection.execute(`
      INSERT INTO sync_metadata (key_name, value)
      VALUES ('last_bulk_sync', ?)
      ON DUPLICATE KEY UPDATE value = VALUES(value), updated_at = CURRENT_TIMESTAMP
    `, [lastUpdated.toISOString()]);
  }

  async generateReport() {
    const duration = ((new Date() - this.stats.startTime) / 1000 / 60).toFixed(1);
    
    // Get current database stats
    const [dbStats] = await this.connection.execute(`
      SELECT 
        COUNT(*) as total_cards,
        COUNT(DISTINCT set_code) as total_sets,
        COUNT(DISTINCT oracle_id) as unique_cards
      FROM cards
    `);
    
    const report = `
🎯 Database Sync Complete
=========================
⏱️  Duration: ${duration} minutes
📊 Changes:
   • New cards: ${this.stats.newCards.toLocaleString()}
   • Updated cards: ${this.stats.updatedCards.toLocaleString()}
   • Errors: ${this.stats.errors}

📈 Current Database:
   • Total cards: ${dbStats[0].total_cards.toLocaleString()}
   • Unique sets: ${dbStats[0].total_sets}
   • Unique cards: ${dbStats[0].unique_cards.toLocaleString()}

📝 Log file: ${this.logFile}
`;
    
    await this.log(report);
    console.log(report);
  }

  async sync() {
    try {
      await this.connect();
      
      const updateCheck = await this.checkBulkDataUpdate();
      if (!updateCheck.needsUpdate) {
        await this.log('No update needed - database is current');
        return;
      }
      
      const cards = await this.downloadAndProcessCards(updateCheck.downloadUri);
      await this.syncCards(cards);
      await this.updateSyncMetadata(updateCheck.lastUpdated);
      await this.generateReport();
      
    } catch (error) {
      await this.log(`Sync failed: ${error.message}`, 'error');
      throw error;
    } finally {
      if (this.connection) {
        await this.connection.end();
        await this.log('Database connection closed');
      }
    }
  }
}

// Run sync if called directly
if (require.main === module) {
  const syncer = new DatabaseSyncer();
  syncer.sync().catch(console.error);
}

module.exports = DatabaseSyncer;
