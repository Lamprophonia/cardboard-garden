# Cardboard Garden - Database Schema

This database uses a **hybrid architecture** with shared infrastructure and game-specific optimized databases.

## 🚀 **Quick Start**

```bash
mysql -u root -p < setup.sql
```

## 🏗️ **Architecture Overview**

### **Shared Infrastructure (`tcg_shared`)**
- **User Management** - Single user accounts across all games
- **Collection Tracking** - References to cards in game-specific databases  
- **Wishlist Management** - Cross-game wishlist support
- **Conditions** - Shared card condition standards

### **Game-Specific Databases**
- **`tcg_pokemon`** - Optimized for Pokémon TCG with HP, types, evolution
- **`tcg_magic`** - Optimized for Magic with power/toughness, mana costs
- **`tcg_yugioh`** - Optimized for Yu-Gi-Oh with ATK/DEF, levels
- **`tcg_lorcana`** - Optimized for Lorcana with ink costs, lore values

## 📁 **Files Structure**

### **Core Setup Files**
- `setup.sql` - **Master setup script** (run this first)
- `00_security_setup.sql` - Database users and permissions
- `01_shared_database.sql` - Shared user management & collections
- `02_pokemon_database.sql` - Pokémon-optimized schema
- `03_yugioh_database.sql` - Yu-Gi-Oh-optimized schema  
- `04_magic_database.sql` - Magic-optimized schema
- `05_lorcana_database.sql` - Lorcana-optimized schema
- `06_cross_database_queries.sql` - Cross-database utilities
- `07_sample_data_and_tests.sql` - Sample data & test queries

### **Operations & Maintenance**
- `08_performance_optimization.sql` - Indexes and performance tuning
- `09_backup_monitoring.sql` - Backup procedures and monitoring

### **Documentation**
- `README.md` - Main documentation (you are here)
- `GETTING_STARTED.md` - Usage examples and tutorials
- `HYBRID_README.md` - Technical architecture details
- `SECURITY_BEST_PRACTICES.md` - **Security hardening guide**

## ✅ **Key Benefits**

- **Performance** - Optimized schemas per game with focused indexes
- **Scalability** - Independent scaling and optimization per game
- **Flexibility** - Easy to add new games without affecting existing ones
- **Development** - Teams can specialize in different games
- **Operations** - Flexible backup and maintenance strategies

## 🛠 **Setup Instructions**

### **Requirements**
- MySQL 5.7+ or MariaDB 10.2+
- UTF8MB4 character set support
- Administrative privileges for user creation

### **Pre-Installation Security Setup**
⚠️ **IMPORTANT**: Before running setup, edit `00_security_setup.sql` and change the default passwords:

```sql
-- Change these default passwords to strong, unique passwords:
'your_secure_password'    → Your strong app password
'readonly_password'       → Your strong readonly password  
'backup_password'         → Your strong backup password
```

### **Installation**
```bash
# Clone/download the project
```bash
cd cardboard-garden/sql

# Review and update passwords first!
nano 00_security_setup.sql

# Run the complete setup (creates users, databases, security)
mysql -u root -p < setup.sql
```

This creates **5 databases** with **security hardening**:
- `tcg_shared` - User management and collections
- `tcg_pokemon` - Pokémon cards and data  
- `tcg_magic` - Magic cards and data
- `tcg_yugioh` - Yu-Gi-Oh cards and data
- `tcg_lorcana` - Lorcana cards and data

### **Database Users Created**
- **`tcg_app`** - Application user (CRUD permissions)
- **`tcg_readonly`** - Analytics user (SELECT only)
- **`tcg_backup`** - Backup user (SELECT + LOCK TABLES)

## 📚 **Documentation**

- **Getting Started:** See `GETTING_STARTED.md` for detailed usage examples
- **Architecture Details:** See `HYBRID_README.md` for technical details

## 🎯 **What's Included**

### **Sample Data**
- **Users** - 3 test users with different collection preferences
- **Cards** - Sample cards from each game with proper attributes  
- **Collections** - Example collections showing cross-database relationships
- **Wishlists** - Sample wishlist entries across different games

### **Test Queries**
The setup includes test queries that demonstrate:
- Cross-database joins for collection details
- User collection summaries across all games
- Game-specific card attributes and relationships

## � **Adding New Games**

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

3. **Update cross-database queries** as needed

---

**This hybrid architecture provides the perfect balance of performance, scalability, and maintainability for a multi-game TCG collection system.**
