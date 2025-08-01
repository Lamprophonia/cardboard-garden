# Configuration Management

## 📋 **Configuration Files**

### **🔐 Environment Variables**
- **`.env.example`** - Template for environment variables
- **`.env`** - Your local environment (create from example, not in git)

### **🔍 SonarQube Configuration**
- **`sonar-project.properties`** - SonarQube analysis settings

## 🚀 **Setup Instructions**

### **1. Environment Variables**
```bash
# Copy the example file
cp config/.env.example .env

# Edit with your values (IMPORTANT: Change all passwords!)
nano .env  # or edit with your preferred editor
```

### **2. SonarQube Configuration**
The `sonar-project.properties` file is pre-configured for your TCG project:
- Analyzes SQL, JavaScript, TypeScript, and Markdown files
- Excludes node_modules and build directories
- Configured for MySQL dialect
- Links to your GitHub repository

### **3. Custom MySQL Configuration**
Add custom MySQL settings:
```bash
# Create custom MySQL config
echo "[mysqld]
max_connections = 200
innodb_buffer_pool_size = 512M" > config/mysql-custom.cnf

# Reference in your MySQL server configuration
```

## 🔒 **Security Best Practices**

### **Password Management**
- Never commit real passwords to git
- Use strong, unique passwords for each service
- Consider using a password manager or secrets management system

### **Production Configuration**
```bash
# Generate secure passwords
openssl rand -base64 32  # For database passwords
openssl rand -base64 64  # For JWT secrets
```

## 🎯 **Configuration Examples**

### **Development .env**
```bash
MYSQL_ROOT_PASSWORD=dev_root_password_2024
MYSQL_PASSWORD=dev_app_password_2024
NODE_ENV=development
```

### **Production .env**
```bash
MYSQL_ROOT_PASSWORD=super_secure_random_password_here
MYSQL_PASSWORD=another_secure_random_password_here
NODE_ENV=production
JWT_SECRET=very_long_random_jwt_secret_here
```

Keep your configurations secure and organized! 🔐
