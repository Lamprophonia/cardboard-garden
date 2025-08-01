const https = require('https');
const mysql = require('mysql2/promise');

// Rate limiting
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fixMissingFaceImages() {
  const db = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'cardboard_garden'
  });

  try {
    console.log('🔍 Finding cards with card_faces but missing image URIs...');
    
    // Find cards that have card_faces but might be missing image_uris
    const [cards] = await db.execute(`
      SELECT id, name, layout, card_faces 
      FROM cards 
      WHERE card_faces IS NOT NULL 
      AND card_faces != 'null' 
      AND card_faces != ''
      AND layout IN ('adventure', 'transform', 'modal_dfc', 'double_faced_token', 'split', 'flip')
      ORDER BY name
    `);

    console.log(`Found ${cards.length} cards with card_faces data`);

    let needsUpdate = [];
    
    // Check which ones are missing image_uris
    for (const card of cards) {
      try {
        const faces = JSON.parse(card.card_faces);
        const hasImages = faces.some(face => face.image_uris && Object.keys(face.image_uris).length > 0);
        
        if (!hasImages) {
          needsUpdate.push(card);
          console.log(`❌ Missing images: ${card.name} (${card.layout})`);
        } else {
          console.log(`✅ Has images: ${card.name}`);
        }
      } catch (e) {
        console.log(`⚠️  JSON parse error for ${card.name}`);
        needsUpdate.push(card);
      }
    }

    console.log(`\n🔧 Updating ${needsUpdate.length} cards with missing face images...`);

    for (let i = 0; i < needsUpdate.length; i++) {
      const card = needsUpdate[i];
      console.log(`\nUpdating ${i + 1}/${needsUpdate.length}: ${card.name}`);
      
      try {
        // Search Scryfall by card name  
        const url = `https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(card.name)}`;
        
        const scryfallData = await new Promise((resolve, reject) => {
          https.get(url, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
              try {
                resolve(JSON.parse(body));
              } catch (e) {
                reject(e);
              }
            });
          }).on('error', reject);
        });

        if (scryfallData.card_faces && scryfallData.card_faces.length > 0) {
          // Update with fresh face data
          await db.execute(
            'UPDATE cards SET layout = ?, card_faces = ? WHERE id = ?',
            [scryfallData.layout, JSON.stringify(scryfallData.card_faces), card.id]
          );
          console.log(`✅ Updated ${card.name} with fresh face data`);
        } else {
          console.log(`❌ No card_faces in Scryfall data for ${card.name}`);
        }

      } catch (error) {
        console.error(`❌ Error updating ${card.name}:`, error.message);
      }

      // Rate limiting - wait 100ms between requests
      await delay(100);
    }

    console.log('\n🎉 Face image update completed!');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await db.end();
  }
}

fixMissingFaceImages();
