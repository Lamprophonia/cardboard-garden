# Getting Started with Hybrid Architecture

## Quick Start

To set up the complete hybrid system, run:

```sql
SOURCE hybrid_setup.sql;
```

This will create 5 databases:
- `tcg_shared` - User management and collections
- `tcg_pokemon` - Pokémon-specific cards and data
- `tcg_magic` - Magic: The Gathering cards and data  
- `tcg_yugioh` - Yu-Gi-Oh! cards and data
- `tcg_lorcana` - Disney Lorcana cards and data

## Database Structure

### Shared Database (`tcg_shared`)
```sql
USE tcg_shared;

-- Core tables
users              -- User accounts
games              -- Game registry 
conditions         -- Card conditions (Mint, Near Mint, etc.)
collection         -- User's owned cards (references game databases)
wishlist           -- User's wanted cards (references game databases)
```

### Game-Specific Databases
Each game has its own optimized schema:

**Pokémon (`tcg_pokemon`)**
```sql
cards.hp, cards.pokemon_type_id, cards.retreat_cost
cards.attacks (JSON), cards.evolves_from
pokemon_types, sets, rarities
```

**Magic (`tcg_magic`)**
```sql
cards.power, cards.toughness, cards.mana_cost
cards.converted_mana_cost, cards.color_identity
colors, sets, rarities
```

**Yu-Gi-Oh (`tcg_yugioh`)**
```sql
cards.attack, cards.defense, cards.level
cards.attribute_id, cards.monster_type_id
attributes, monster_types, sets, rarities
```

**Lorcana (`tcg_lorcana`)**
```sql
cards.ink_cost, cards.strength, cards.willpower, cards.lore_value
cards.ink_color_id, cards.franchise_id
ink_colors, franchises, sets, rarities
```

## Adding Cards to Collections

### Example: Add Pokémon card to user's collection
```sql
-- 1. Find the card in the Pokémon database
SELECT id, name FROM tcg_pokemon.cards WHERE name LIKE '%Charizard%';

-- 2. Add to user's collection in shared database
INSERT INTO tcg_shared.collection (user_id, game_id, external_card_id, condition_id, quantity, purchase_price)
VALUES (1, 1, 1, 2, 1, 350.00); -- user_id=1, game_id=1 (Pokémon), card_id=1, condition=Near Mint
```

### Example: Query user's Pokémon collection
```sql
SELECT 
    c.quantity,
    p.name,
    p.hp,
    pt.name as pokemon_type,
    cond.name as condition,
    c.purchase_price
FROM tcg_shared.collection c
JOIN tcg_shared.games g ON c.game_id = g.id
JOIN tcg_pokemon.cards p ON c.external_card_id = p.id
LEFT JOIN tcg_pokemon.pokemon_types pt ON p.pokemon_type_id = pt.id
LEFT JOIN tcg_shared.conditions cond ON c.condition_id = cond.id
WHERE c.user_id = 1 AND g.name = 'Pokémon Trading Card Game';
```

## Cross-Game Queries

### User's collection summary across all games
```sql
SELECT * FROM tcg_shared.user_collection_summary WHERE user_id = 1;
```

### Get card details using stored procedure
```sql
CALL tcg_shared.GetCardDetails(1, 1); -- game_id=1 (Pokémon), card_id=1
```

## Adding New Games

1. **Create game-specific database:**
```sql
CREATE DATABASE tcg_newgame;
-- Add game-specific tables: cards, sets, rarities, etc.
```

2. **Register in shared database:**
```sql
INSERT INTO tcg_shared.games (name, abbreviation, description, publisher, database_name)
VALUES ('New Game', 'NG', 'Description', 'Publisher', 'tcg_newgame');
```

3. **Update stored procedures** to handle the new game

## Performance Tips

- **Use indexes** on frequently queried fields
- **Partition large tables** by set or year if needed
- **Cache popular cards** in application layer
- **Use read replicas** for reporting queries

## Backup Strategy

```bash
# Backup all databases
mysqldump tcg_shared > backup_shared.sql
mysqldump tcg_pokemon > backup_pokemon.sql  
mysqldump tcg_magic > backup_magic.sql
mysqldump tcg_yugioh > backup_yugioh.sql
mysqldump tcg_lorcana > backup_lorcana.sql
```

## Next Steps

1. **Set up the databases** using `hybrid_setup.sql`
2. **Create sample users** and test collections
3. **Build the application layer** to handle cross-database queries
4. **Add more cards** to each game database
5. **Implement caching** for frequently accessed data

The hybrid architecture gives you the flexibility to optimize each game individually while maintaining unified user management!
