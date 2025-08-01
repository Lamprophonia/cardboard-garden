const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const dbPath = path.resolve(process.env.DB_PATH || './data/cardboard-garden.db');

console.log('🗄️ Setting up Cardboard Garden database...');
console.log('📍 Database location:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to SQLite database');
});

// Magic: The Gathering focused schema
const setupTables = () => {
  // Disable foreign key constraints during setup
  db.run('PRAGMA foreign_keys = OFF');
  
  // Cards table - stores Scryfall card data
  db.run(`
    CREATE TABLE IF NOT EXISTS cards (
      id TEXT PRIMARY KEY,
      oracle_id TEXT,
      name TEXT NOT NULL,
      mana_cost TEXT,
      cmc REAL,
      type_line TEXT,
      oracle_text TEXT,
      power TEXT,
      toughness TEXT,
      colors TEXT, -- JSON array
      color_identity TEXT, -- JSON array
      set_code TEXT,
      set_name TEXT,
      collector_number TEXT,
      rarity TEXT,
      image_uri_small TEXT,
      image_uri_normal TEXT,
      image_uri_large TEXT,
      scryfall_uri TEXT,
      released_at TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('Error creating cards table:', err);
    else console.log('✓ Cards table ready');
    
    // Create collection table after cards table
    createCollectionTable();
  });
};

const createCollectionTable = () => {
  // Collection table - tracks owned cards
  db.run(`
    CREATE TABLE IF NOT EXISTS collection (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      card_id TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      condition TEXT DEFAULT 'near_mint',
      foil BOOLEAN DEFAULT FALSE,
      language TEXT DEFAULT 'en',
      acquired_date DATE,
      acquired_price DECIMAL(10,2),
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('Error creating collection table:', err);
    else console.log('✓ Collection table ready');
    
    createDecksTable();
  });
};

const createDecksTable = () => {
  // Decks table
  db.run(`
    CREATE TABLE IF NOT EXISTS decks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      format TEXT,
      colors TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('Error creating decks table:', err);
    else console.log('✓ Decks table ready');
    
    createDeckCardsTable();
  });
};

const createDeckCardsTable = () => {
  // Deck cards table
  db.run(`
    CREATE TABLE IF NOT EXISTS deck_cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      deck_id INTEGER NOT NULL,
      card_id TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      is_sideboard BOOLEAN DEFAULT FALSE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('Error creating deck_cards table:', err);
    else console.log('✓ Deck cards table ready');
    
    createIndexes();
  });
};

const createIndexes = () => {
  // Create indexes for better performance
  db.run(`CREATE INDEX IF NOT EXISTS idx_cards_name ON cards (name)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_cards_set ON cards (set_code)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_collection_card ON collection (card_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_deck_cards_deck ON deck_cards (deck_id)`);
  
  // Re-enable foreign key constraints
  db.run('PRAGMA foreign_keys = ON');
  
  console.log('✓ Database indexes created');
  
  // Close database after everything is done
  db.close((err) => {
    if (err) {
      console.error('❌ Error closing database:', err.message);
    } else {
      console.log('🎉 Database setup complete!');
      console.log('🚀 Ready to start building your Magic collection!');
    }
  });
};

// Set up the database
setupTables();
