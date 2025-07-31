# Cardboard Garden - Docker Setup

## 🐳 **Quick Start with Docker**

### **Prerequisites**
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- Git repository cloned locally

### **1. Start the Database**
```bash
# From the project root directory
docker-compose up -d mysql phpmyadmin

# To include SonarQube for code analysis
docker-compose up -d mysql phpmyadmin sonarqube

# Check container status
docker-compose ps
```

### **2. Access Web Interfaces**
- **phpMyAdmin**: http://localhost:8080 (Username: `tcg_app`, Password: `tcg_app_password_2024`)
- **SonarQube**: http://localhost:9000 (Username: `admin`, Password: `admin` - change on first login)

### **3. Database Initialization**
The database will automatically initialize with all your TCG schemas when the MySQL container starts for the first time. All SQL files in the `/sql` directory are executed in alphabetical order.

---

## 🏗️ **Architecture Overview**

### **Current Services (Phase 1)**
- **MySQL 8.0**: Primary database with all TCG schemas
- **phpMyAdmin**: Web-based database management interface
- **SonarQube**: Code quality and security analysis platform

### **Future Services (Commented Out)**
- **Node.js API**: RESTful API service (uncomment when ready for Phase 2)
- **React Frontend**: Web application interface (uncomment when ready for Phase 3)

---

## 🔧 **Docker Commands**

### **Basic Operations**
```bash
# Start all services
docker-compose up -d

# Start specific services
docker-compose up -d mysql phpmyadmin sonarqube

# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ DELETES ALL DATA)
docker-compose down -v

# View logs
docker-compose logs mysql
docker-compose logs phpmyadmin

# Follow logs in real-time
docker-compose logs -f mysql
```

### **Database Management**
```bash
# Connect to MySQL container
docker exec -it tcg_mysql mysql -u tcg_app -p

# Run SQL file directly
docker exec -i tcg_mysql mysql -u tcg_app -p tcg_shared < sql/additional_script.sql

# Create database backup
docker exec tcg_mysql mysqldump -u tcg_app -p --all-databases > backup.sql

# Restore from backup
docker exec -i tcg_mysql mysql -u tcg_app -p < backup.sql
```

### **Development Workflow**
```bash
# Restart services after configuration changes
docker-compose restart mysql

# Rebuild containers (if Dockerfiles change)
docker-compose up --build

# Remove old containers and start fresh
docker-compose down
docker-compose up -d
```

---

## 📊 **Service Details**

### **MySQL Container**
- **Image**: mysql:8.0 (official MySQL image)
- **Port**: 3306 (mapped to host)
- **Databases**: Auto-created from `/sql` directory
- **Persistent Storage**: `mysql_data` volume
- **Configuration**: Custom `/docker/mysql/my.cnf` for TCG optimization

### **phpMyAdmin Container**
- **Image**: phpmyadmin/phpmyadmin (official phpMyAdmin image)
- **Port**: 8080 (web interface)
- **Auto-login**: Configured for `tcg_app` user
- **Features**: Full database management, query execution, import/export

### **SonarQube Container**
- **Image**: sonarqube:10.3-community (official SonarQube Community image)
- **Port**: 9000 (web interface)
- **Database**: Uses MySQL for SonarQube data storage
- **Features**: Code quality analysis, security scanning, technical debt tracking

---

## 🔐 **Security Configuration**

### **Database Users (Auto-Created)**
- **Root User**: `root` / `tcg_root_password_2024`
- **Application User**: `tcg_app` / `tcg_app_password_2024` (full CRUD access)
- **Read-Only User**: `tcg_readonly` / `tcg_readonly_password_2024` (SELECT only)
- **Backup User**: `tcg_backup` / `tcg_backup_password_2024` (backup operations)
- **SonarQube User**: `sonar_user` / `sonar_password_2024` (SonarQube database access)

### **Production Security Recommendations**
```bash
# Generate secure passwords for production
# Update docker-compose.yml with:
MYSQL_ROOT_PASSWORD: $(openssl rand -base64 32)
MYSQL_PASSWORD: $(openssl rand -base64 32)

# Use Docker secrets for production
# Create .env file for sensitive data
echo "MYSQL_ROOT_PASSWORD=your_secure_password" > .env
echo "MYSQL_PASSWORD=your_secure_password" >> .env
```

---

## 🎯 **Phase 2 Preparation**

When you're ready to add the Node.js API service:

### **1. Uncomment API Service**
Edit `docker-compose.yml` and uncomment the `api` service section.

### **2. Create API Dockerfile**
```bash
# Create API Dockerfile directory
mkdir -p docker/api
```

### **3. Start API Development**
```bash
# Start API service
docker-compose up -d api

# API will be available at: http://localhost:3000
```

---

## 🚀 **Advantages of Docker Approach**

### **✅ Environment Consistency**
- Same MySQL version across all development machines
- Consistent configuration and optimization settings
- No "works on my machine" issues

### **✅ Easy Setup**
- Single command to start entire database infrastructure
- No manual MySQL installation or configuration required
- Automatic database initialization with all schemas

### **✅ Isolation**
- Database runs in isolated container
- No conflicts with existing MySQL installations
- Easy to start fresh or switch versions

### **✅ Development Productivity**
- phpMyAdmin provides excellent database management interface
- Easy to reset database state for testing
- Simple backup and restore operations

### **✅ Production Ready**
- Same containers can be used in production
- Volume mounting for persistent data
- Health checks and restart policies configured

---

## 🔧 **Troubleshooting**

### **Container Won't Start**
```bash
# Check Docker Desktop is running
docker --version

# Check container logs
docker-compose logs mysql

# Check port conflicts
netstat -an | findstr 3306  # Windows
lsof -i :3306              # macOS/Linux
```

### **Database Connection Issues**
```bash
# Test MySQL connectivity
docker exec tcg_mysql mysqladmin ping -h localhost -u tcg_app -p

# Check if databases were created
docker exec -it tcg_mysql mysql -u tcg_app -p -e "SHOW DATABASES;"
```

### **Reset Everything**
```bash
# Nuclear option: Delete all data and start fresh
docker-compose down -v
docker-compose up -d
```

---

## 📝 **Next Steps**

1. **Start Services**: `docker-compose up -d mysql phpmyadmin sonarqube`
2. **Verify Database**: Check http://localhost:8080 (phpMyAdmin)
3. **Setup Code Analysis**: Check http://localhost:9000 (SonarQube)
4. **Explore Data**: Browse the auto-created databases and sample data
5. **Run Analysis**: Follow [SonarQube Setup Guide](SONARQUBE_SETUP.md)
6. **Plan Phase 2**: When ready, uncomment API service and begin backend development

Your Docker setup with code quality analysis is ready for professional development! 🐳✨
