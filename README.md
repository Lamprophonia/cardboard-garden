# � Cardboard Garden

> **Cultivate and nurture your trading card collections across multiple TCG universes**

[![Database](https://img.shields.io/badge/Database-MySQL%2FMariaDB-blue)](https://dev.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](DOCKER_README.md)
[![Code Quality](https://img.shields.io/badge/SonarQube-Integrated-green)](SONARQUBE_SETUP.md)
[![Architecture](https://img.shields.io/badge/Architecture-Hybrid-green)](docs/FUTURE_PROOFING_ANALYSIS.md)
[![Games](https://img.shields.io/badge/Games-4%20Supported-orange)](#supported-games)
[![Security](https://img.shields.io/badge/Security-Production%20Ready-red)](sql/SECURITY_BEST_PRACTICES.md)

---

## 🚀 **Quick Start**

### **🐳 Docker (Recommended)**
```bash
# 1. Clone the project
git clone <repository-url>
cd cardboard-garden

# 2. Start services with Docker
docker-compose up -d mysql phpmyadmin sonarqube

# 3. Access web interfaces:
# Database: http://localhost:8080 (tcg_app / tcg_app_password_2024)
# Code Quality: http://localhost:9000 (admin / admin)

# 4. Use development scripts
scripts/dev.bat start-db     # Windows
scripts/dev.sh start-db      # Unix/Linux
```

### **💻 Manual Setup**
```bash
# 1. Install MySQL/MariaDB manually
# 2. Set up database (IMPORTANT: Change default passwords first!)
cd sql
nano 00_security_setup.sql  # Update passwords!
mysql -u root -p < setup.sql

# 3. Verify setup
mysql -u tcg_app -p
```

**🎯 Ready to cultivate your card collection garden across multiple TCG universes!**

️ [**Manual Setup**](sql/GETTING_STARTED.md) | 🎨 [**Brand Assets**](docs/project/BRAND_ASSETS.md) | � [**Documentation**](docs/README.md)

---

## 🎮 **Supported Games**

| Game | Features | Unique Attributes |
|------|----------|-------------------|
| **Pokémon TCG** | HP, Types, Evolution | Energy requirements, evolution chains |
| **Magic: The Gathering** | Power/Toughness, Mana | Color identity, card types, subtypes |
| **Yu-Gi-Oh!** | ATK/DEF, Levels | Monster types, spell/trap cards, archetypes |
| **Disney Lorcana** | Ink Costs, Lore | Character franchises, quest cards |

**➕ Easily extensible** - Add new games like One Piece, Gundam, Dragon Ball Super with minimal effort!

---

## 🏗️ **Architecture Overview**

### **🔄 Hybrid Database Design**
- **Shared Infrastructure** (`tcg_shared`) - Users, collections, wishlists
- **Game-Specific Databases** - Optimized for each TCG's unique mechanics
- **Cross-Database Queries** - Seamless multi-game collection management

### **✅ Key Benefits**
- **⚡ Performance** - Game-specific optimization with focused indexes
- **📈 Scalability** - Independent scaling per game
- **🔧 Flexibility** - Add new games without affecting existing ones
- **👥 Team-Friendly** - Specialized development per game
- **🔒 Secure** - Production-ready 3-tier security model

---

## 📁 **Project Structure**

```
cardboard-garden/
├── 📱 app/                        # Application layer (future development)
├── 📊 data/                       # Data files and imports (future use)  
├── 📚 docs/                       # Project documentation
│   ├── PROJECT_JOURNAL.md         # Complete project evolution history
│   └── FUTURE_PROOFING_ANALYSIS.md # Architecture scalability analysis
├── 🗃️  sql/                        # Database implementation
│   ├── setup.sql                  # 🎯 Master setup script (START HERE)
│   ├── 00-09_*.sql               # Database components
│   └── *.md                      # Database documentation
└── 📋 README.md                   # This file
```

---

## 🛠️ **Setup & Installation**

### **Prerequisites**
- **MySQL 5.7+** or **MariaDB 10.2+**
- **UTF8MB4** character set support
- **Administrative privileges** for user creation

### **⚠️ Security First**
**CRITICAL**: Before installation, update default passwords in `sql/00_security_setup.sql`:

```sql
-- Change these to strong, unique passwords:
'your_secure_password'    → Your strong app password  
'readonly_password'       → Your strong readonly password
'backup_password'         → Your strong backup password
```

### **Installation Steps**
1. **📥 Download/Clone** the project
2. **🔐 Update passwords** in `sql/00_security_setup.sql`
3. **🚀 Run setup**: `mysql -u root -p < sql/setup.sql`
4. **✅ Test**: Connect with `mysql -u tcg_app -p`

**Result**: 5 databases created with security hardening and sample data!

---

## 📖 **Documentation**

### **🚀 Getting Started**
- **[SQL Database Setup](sql/README.md)** - Complete database setup guide
- **[Usage Examples](sql/GETTING_STARTED.md)** - Query examples and tutorials
- **[Security Guide](sql/SECURITY_BEST_PRACTICES.md)** - Production security setup

### **🏗️ Technical Details** 
- **[Architecture Details](sql/HYBRID_README.md)** - Deep dive into hybrid design
- **[Future-Proofing Analysis](docs/FUTURE_PROOFING_ANALYSIS.md)** - Scalability and new game integration
- **[Project Journal](docs/PROJECT_JOURNAL.md)** - Complete evolution history and decisions

---

## 🎯 **What's Included**

### **✅ Production-Ready Database**
- **5 databases** (1 shared + 4 game-specific)
- **~30 tables** with optimized schemas
- **Security hardening** with 3-tier user system
- **Performance optimization** with composite indexes
- **Backup & monitoring** procedures

### **✅ Sample Data & Testing**
- **Test users** with different collection preferences
- **Sample cards** from each game with proper attributes
- **Cross-database collections** demonstrating relationships
- **Comprehensive test queries** for validation

### **✅ Comprehensive Documentation**
- **Setup guides** for different audiences
- **Architecture explanations** with rationale
- **Security best practices** for production
- **Project evolution history** with decision rationale

---

## 🔮 **Roadmap & Future Development**

### **Phase 2: Application Layer**
- [ ] **REST API** development
- [ ] **Authentication system** integration
- [ ] **Business logic** implementation
- [ ] **Market data integration** (TCGPlayer, etc.)

### **Phase 3: User Interface**
- [ ] **Web application** with modern UI/UX
- [ ] **Mobile applications** (iOS/Android)
- [ ] **Advanced features** (deck building, trading, analytics)

### **Phase 4: Advanced Features**
- [ ] **Machine learning** for price prediction
- [ ] **Social features** and community
- [ ] **Marketplace integration** and trading
- [ ] **Tournament tracking** and meta analysis

---

## 🎮 **Adding New Games**

The hybrid architecture makes adding new TCGs incredibly easy:

1. **Create game database** (copy existing template)
2. **Register in shared database** (1 INSERT statement)
3. **Test integration** (existing queries work automatically)

**Example**: Adding One Piece Card Game takes ~30 minutes with full optimization!

See **[Future-Proofing Analysis](docs/FUTURE_PROOFING_ANALYSIS.md)** for detailed examples.

---

## 🤝 **Contributing**

### **Development Areas**
- **🗃️ Database** - Schema optimization, new game support
- **🔒 Security** - Security enhancements and auditing
- **📊 Performance** - Query optimization and caching
- **📱 Applications** - API and UI development
- **📚 Documentation** - Guides and tutorials

### **Getting Started with Development**
1. **📖 Read** the [Project Journal](docs/PROJECT_JOURNAL.md) for context
2. **🏗️ Understand** the [Architecture](sql/HYBRID_README.md)
3. **🔧 Set up** the database following [Setup Guide](sql/README.md)
4. **🧪 Test** your changes with sample data

---

## 📊 **Project Stats**

| Metric | Value |
|--------|--------|
| **Databases** | 5 (1 shared + 4 games) |
| **Tables** | ~30 across all databases |
| **Games Supported** | 4 (Pokemon, Magic, Yu-Gi-Oh, Lorcana) |
| **Security Users** | 3 (app, readonly, backup) |
| **Documentation Files** | 6 comprehensive guides |
| **SQL Files** | 10 organized components |

---

## 🏷️ **Keywords**

`Trading Card Games` • `Database Design` • `MySQL` • `Hybrid Architecture` • `Collection Management` • `Pokemon TCG` • `Magic The Gathering` • `Yu-Gi-Oh` • `Disney Lorcana` • `Security` • `Performance` • `Scalability`

---

## 📄 **License**

This project is available under the MIT License. See LICENSE file for details.

---

## 📞 **Support**

- **📚 Documentation**: Start with [SQL README](sql/README.md)
- **🏗️ Architecture**: See [Technical Details](sql/HYBRID_README.md)
- **🔐 Security**: Check [Security Guide](sql/SECURITY_BEST_PRACTICES.md)
- **📈 Scalability**: Review [Future-Proofing Analysis](docs/FUTURE_PROOFING_ANALYSIS.md)

---

**🎯 Built with care for TCG collectors, by TCG collectors. Ready for production deployment and future growth!** 🚀
