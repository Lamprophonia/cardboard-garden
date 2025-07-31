# Hybrid Architecture for TCG Card Collection Manager

This hybrid approach combines the best of both unified and separated architectures.

## Architecture Overview

### **Shared Infrastructure Database (`tcg_shared`)**
- **User Management** - Single user accounts across all games
- **Collection Tracking** - References to cards in game-specific databases
- **Wishlist Management** - Cross-game wishlist support
- **Conditions** - Shared card condition standards
- **Game Metadata** - Registry of all supported games

### **Game-Specific Databases**
- **`tcg_pokemon`** - Optimized for Pokémon TCG with HP, types, evolution
- **`tcg_magic`** - Optimized for Magic with power/toughness, mana costs
- **`tcg_lorcana`** - Optimized for Lorcana with ink costs, lore values
- **`tcg_yugioh`** - (Future) Optimized for Yu-Gi-Oh with ATK/DEF

## Key Benefits

### **✅ Best of Both Worlds**
- **Simple schemas** per game (no complex attribute tables)
- **Unified user experience** across all games
- **Game-specific optimizations** without compromising flexibility

### **✅ Performance Advantages**
- **Smaller, focused indexes** per game
- **Optimized queries** for each game's unique attributes
- **Independent scaling** per game popularity

### **✅ Development Benefits**
- **Team specialization** - different developers can own different games
- **Independent deployments** per game
- **Easy to add new games** without affecting existing ones
- **Game-specific business logic** without shared complexity

### **✅ Operational Benefits**
- **Targeted backups** - backup popular games more frequently
- **Independent maintenance** windows per game
- **Flexible hosting** - put popular games on dedicated servers

## How It Works

### **1. Card References**
Instead of storing card data in the shared database, collections store:
```sql
user_id: 123
game_id: 1 (Pokémon) 
external_card_id: 456 (ID in tcg_pokemon.cards)
quantity: 3
condition: "Near Mint"
```

### **2. Cross-Database Queries**
The system uses:
- **Stored procedures** to query across databases
- **Application-level joins** for complex reports
- **Views** in the shared database for common queries

### **3. API Layer**
The application layer:
- **Routes queries** to appropriate databases
- **Aggregates data** from multiple sources
- **Maintains consistency** across databases

## Implementation Strategy

### **Phase 1: Start Simple**
1. Use the unified approach initially
2. Get the application working end-to-end
3. Identify performance bottlenecks

### **Phase 2: Strategic Separation**  
1. Move the most popular game to its own database
2. Keep shared infrastructure
3. Measure performance improvements

### **Phase 3: Full Separation**
1. Move remaining games to separate databases
2. Optimize each schema for its specific game
3. Implement cross-database reporting

## When to Use This Approach

**✅ Use Hybrid When:**
- Supporting multiple complex TCG games
- Expecting significant scale (100K+ cards per game)
- Need game-specific optimizations
- Have dedicated teams per game
- Performance is critical

**❌ Stay Unified When:**
- Just starting out
- Supporting only 1-2 games
- Simple card structures
- Small to medium scale
- Development team is small

## Files Included

- `hybrid_01_shared_database.sql` - Shared infrastructure
- `hybrid_02_pokemon_database.sql` - Pokémon-optimized schema
- `hybrid_03_magic_database.sql` - Magic-optimized schema  
- `hybrid_04_lorcana_database.sql` - Lorcana-optimized schema
- `hybrid_05_cross_database_queries.sql` - Cross-database utilities
- `hybrid_setup.sql` - Master setup script

This hybrid approach gives you room to grow while maintaining the flexibility to optimize each game individually!
