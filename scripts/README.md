# Development Scripts Usage Guide

## 🚀 **Quick Commands**

### **Windows Users**
```cmd
# Start database services
scripts\dev.bat start-db

# Start all services including SonarQube
scripts\dev.bat start-all

# Start SonarQube for code analysis
scripts\dev.bat sonar

# Connect to MySQL command line
scripts\dev.bat mysql

# Create database backup
scripts\dev.bat backup

# Show service status
scripts\dev.bat status

# Stop all services
scripts\dev.bat stop
```

### **Unix/Linux/macOS Users**
```bash
# Start database services
scripts/dev.sh start-db

# Start all services including SonarQube
scripts/dev.sh start-all

# Start SonarQube for code analysis
scripts/dev.sh sonar

# Connect to MySQL command line
scripts/dev.sh mysql

# Create database backup
scripts/dev.sh backup

# Show service status
scripts/dev.sh status

# Stop all services
scripts/dev.sh stop
```

## 🔧 **Advanced Commands**

### **Database Management**
```bash
# Reset database (⚠️ DELETES ALL DATA)
scripts/dev.sh reset-db

# Restore from backup
scripts/dev.sh restore backups/tcg_backup_20240730_120000.sql

# View logs
scripts/dev.sh logs mysql
scripts/dev.sh logs sonarqube
```

### **Development Workflow**
```bash
# 1. Start development environment
scripts/dev.sh start-all

# 2. Verify services are running
scripts/dev.sh status

# 3. Open web interfaces
# Database: http://localhost:8080
# Code Quality: http://localhost:9000

# 4. When done, stop services
scripts/dev.sh stop
```

## 📝 **Script Locations**

- **Windows**: `scripts/dev.bat`
- **Unix/Linux**: `scripts/dev.sh`
- **Configuration**: `config/` folder
- **Docker Setup**: `docker/` folder

The scripts automatically handle Docker containers, wait for services to be ready, and provide helpful status messages! 🎉
