const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'cardboard_garden',
  charset: 'utf8mb4'
};

console.log('🗄️ Setting up Cardboard Garden MySQL database...');
console.log('📍 Database host:', dbConfig.host);

async function setupDatabase() {
  let connection;
  
  try {
    // First connect without database to create it
    const serverConfig = { ...dbConfig };
    delete serverConfig.database;
    
    connection = await mysql.createConnection(serverConfig);
    console.log('✅ Connected to MySQL server');
    
    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME || 'cardboard_garden';
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`✓ Database '${dbName}' ready`);
    await connection.end();
    
    // Now connect to the specific database
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to cardboard_garden database');
    
    // Create tables
    await createTables(connection);
    
    console.log('🎉 Database setup complete!');
    console.log('🚀 Ready to start building your Magic collection!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function createTables(connection) {
  // Cards table - stores Scryfall card data
  await connection.query(`
    CREATE TABLE IF NOT EXISTS cards (
      id VARCHAR(36) PRIMARY KEY,
      oracle_id VARCHAR(36),
      name VARCHAR(255) NOT NULL,
      mana_cost TEXT,
      cmc DECIMAL(4,1),
      type_line TEXT,
      oracle_text TEXT,
      power VARCHAR(10),
      toughness VARCHAR(10),
      colors JSON,
      color_identity JSON,
      set_code VARCHAR(10),
      set_name VARCHAR(255),
      collector_number VARCHAR(20),
      rarity ENUM('common', 'uncommon', 'rare', 'mythic', 'special', 'bonus'),
      image_uri_small TEXT,
      image_uri_normal TEXT,
      image_uri_large TEXT,
      scryfall_uri TEXT,
      released_at DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);
  console.log('✓ Cards table ready');

  // Create indexes for cards table
  try {
    await connection.query(`CREATE INDEX idx_name ON cards (name)`);
    await connection.query(`CREATE INDEX idx_set ON cards (set_code)`);
    await connection.query(`CREATE INDEX idx_oracle_id ON cards (oracle_id)`);
  } catch (e) {
    // Indexes may already exist, ignore errors
  }

  // Collection table - tracks owned cards
  await connection.query(`
    CREATE TABLE IF NOT EXISTS collection (
      id INT AUTO_INCREMENT PRIMARY KEY,
      card_id VARCHAR(36) NOT NULL,
      quantity INT NOT NULL DEFAULT 1,
      card_condition ENUM('mint', 'near_mint', 'lightly_played', 'moderately_played', 'heavily_played', 'damaged') DEFAULT 'near_mint',
      foil BOOLEAN DEFAULT FALSE,
      language VARCHAR(5) DEFAULT 'en',
      acquired_date DATE,
      acquired_price DECIMAL(10,2),
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);
  console.log('✓ Collection table ready');

  // Create indexes and foreign key for collection table
  try {
    await connection.query(`CREATE INDEX idx_card_id ON collection (card_id)`);
  } catch (e) {
    // Index may already exist
  }
  await connection.query(`
    ALTER TABLE collection 
    ADD CONSTRAINT fk_collection_card 
    FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE
  `).catch(() => {}); // Ignore if constraint already exists

  // Decks table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS decks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      format ENUM('standard', 'modern', 'legacy', 'vintage', 'commander', 'pioneer', 'pauper', 'historic', 'alchemy', 'brawl', 'other') DEFAULT 'standard',
      colors JSON,
      is_public BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);
  console.log('✓ Decks table ready');

  // Create indexes for decks table
  try {
    await connection.query(`CREATE INDEX idx_deck_name ON decks (name)`);
    await connection.query(`CREATE INDEX idx_format ON decks (format)`);
  } catch (e) {
    // Indexes may already exist
  }

  // Deck cards table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS deck_cards (
      id INT AUTO_INCREMENT PRIMARY KEY,
      deck_id INT NOT NULL,
      card_id VARCHAR(36) NOT NULL,
      quantity INT NOT NULL DEFAULT 1,
      is_sideboard BOOLEAN DEFAULT FALSE,
      is_commander BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);
  console.log('✓ Deck cards table ready');

  // Create indexes and foreign keys for deck_cards table
  try {
    await connection.query(`CREATE INDEX idx_deck_cards_deck ON deck_cards (deck_id)`);
    await connection.query(`CREATE INDEX idx_deck_cards_card ON deck_cards (card_id)`);
  } catch (e) {
    // Indexes may already exist
  }
  
  await connection.query(`
    ALTER TABLE deck_cards 
    ADD CONSTRAINT fk_deck_cards_deck 
    FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE
  `).catch(() => {}); // Ignore if constraint already exists
  
  await connection.query(`
    ALTER TABLE deck_cards 
    ADD CONSTRAINT fk_deck_cards_card 
    FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE
  `).catch(() => {}); // Ignore if constraint already exists

  console.log('✓ All database tables and indexes created');
}

// Run the setup
setupDatabase();
