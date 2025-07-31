# 🌱 Project Rename: TCG Card Collection Manager → Cardboard Garden

## 🎉 **Welcome to Cardboard Garden!**

We've given the project a beautiful new name that better captures the essence of nurturing and growing your trading card collections.

## 🔄 **For Existing Users**

If you've already cloned the project with the old name, here's how to update:

### **Option 1: Fresh Clone (Recommended)**
```bash
# Remove old directory
rm -rf tcg_card_collection_manager

# Clone with new name
git clone https://github.com/Lamprophonia/cardboard-garden.git
cd cardboard-garden
```

### **Option 2: Update Existing Clone**
```bash
# Navigate to your existing project
cd tcg_card_collection_manager

# Update remote URL
git remote set-url origin https://github.com/Lamprophonia/cardboard-garden.git

# Pull latest changes
git pull origin main

# Optional: Rename your local directory
cd ..
mv tcg_card_collection_manager cardboard-garden
cd cardboard-garden
```

## 📝 **What Changed**

### **✅ Updated**
- Project name and branding throughout documentation
- GitHub repository URL references
- SonarQube project configuration
- Docker container descriptions
- Development scripts headers

### **✅ Unchanged**
- All database schemas and structure
- Docker compose configuration
- File and folder organization
- Functionality and features

## 🚀 **Quick Verification**

After updating, verify everything works:

```bash
# Start services (Windows)
scripts\dev.bat start-db

# Start services (Unix/Linux)
scripts/dev.sh start-db

# Access web interfaces
# Database: http://localhost:8080
# Code Quality: http://localhost:9000
```

## 🌱 **Why "Cardboard Garden"?**

The new name beautifully captures the project's essence:
- **🌱 Growth** - Collections develop and flourish over time
- **🌿 Care** - Thoughtful organization and curation
- **🏡 Personal** - Your own space to cultivate collections
- **🎴 TCG-Specific** - "Cardboard" clearly references trading cards

Welcome to your new **Cardboard Garden**! 🌻
