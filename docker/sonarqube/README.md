# SonarQube Setup and Usage Guide

## 🚀 **Quick Start**

### **1. Start SonarQube with Docker**
```bash
# Start database and SonarQube
docker-compose up -d mysql sonarqube

# Wait for SonarQube to initialize (takes 2-3 minutes)
docker-compose logs -f sonarqube
```

### **2. Access SonarQube Web Interface**
- **URL**: http://localhost:9000
- **Default Login**: admin / admin
- **First Login**: You'll be prompted to change the password

### **3. Install SonarQube Scanner**
```bash
# Download SonarQube Scanner
# Windows: Download from https://docs.sonarsource.com/sonarqube/latest/analyzing-source-code/scanners/sonarscanner/
# macOS: brew install sonar-scanner
# Linux: Download and extract to /opt/sonar-scanner
```

---

## 🔍 **Analysis Setup**

### **Phase 1: Current SQL Analysis**
```bash
# Run analysis on your SQL files
sonar-scanner \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login=your_token_here

# Or use the properties file
sonar-scanner
```

### **Phase 2: Future API Analysis**
When you add Node.js API:
```bash
# Install dependencies for coverage
npm install --save-dev jest nyc

# Run tests with coverage
npm run test:coverage

# Run SonarQube analysis
sonar-scanner
```

---

## 🛠️ **SonarQube Configuration**

### **Project Setup in SonarQube UI**
1. **Create Project**: Click "Create Project" → "Manually"
2. **Project Key**: `cardboard_garden`
3. **Display Name**: `Cardboard Garden`
4. **Generate Token**: For authentication

### **Quality Gate Configuration**
- **Coverage**: > 80% for new code
- **Duplicated Lines**: < 3% for new code
- **Maintainability Rating**: A on new code
- **Reliability Rating**: A on new code
- **Security Rating**: A on new code

---

## 📊 **What SonarQube Will Analyze**

### **Current SQL Files**
- **Security Issues**: SQL injection vulnerabilities
- **Code Smells**: Complex queries, naming conventions
- **Duplicated Code**: Repeated SQL patterns
- **Documentation**: Missing comments on complex procedures

### **Future Node.js API**
- **Bugs**: Runtime errors, null pointer exceptions
- **Vulnerabilities**: Security flaws, dependency issues
- **Code Smells**: Complex functions, unused variables
- **Test Coverage**: Unit test coverage percentage

### **Documentation Analysis**
- **README Quality**: Completeness, structure
- **Code Comments**: Inline documentation
- **Architecture Docs**: Technical debt indicators

---

## 🔐 **Security Analysis Features**

### **SQL Security Rules**
- **S2077**: SQL Injection prevention
- **S2068**: Hard-coded credentials detection
- **S1192**: Duplicated string literals
- **S1541**: Complex SQL query detection

### **Future API Security**
- **OWASP Top 10**: Web application vulnerabilities
- **Dependency Scanning**: Known vulnerabilities in npm packages
- **Authentication**: JWT token security
- **Input Validation**: Parameter sanitization

---

## 🎯 **TCG-Specific Analysis Rules**

### **Database Quality Rules**
```sql
-- Rule: Table names should be plural
-- Good: cards, users, collections
-- Bad: card, user, collection

-- Rule: Foreign key naming convention
-- Good: user_id, game_id, set_id
-- Bad: userid, gameid, setid

-- Rule: Index naming convention
-- Good: idx_cards_set_number, idx_users_email
-- Bad: index1, card_index
```

### **API Quality Rules (Future)**
```javascript
// Rule: Async functions should handle errors
// Good:
try {
  const cards = await getCards();
  return cards;
} catch (error) {
  logger.error('Failed to get cards:', error);
  throw error;
}

// Bad:
const cards = await getCards(); // No error handling
```

---

## 📈 **Integration Options**

### **VS Code Integration**
```bash
# Install SonarLint extension
# Provides real-time code analysis in VS Code
```

### **GitHub Integration**
```yaml
# .github/workflows/sonarqube.yml
name: SonarQube Analysis
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  sonarqube:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: SonarQube Scan
        uses: sonarqube-quality-gate-action@master
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
          SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}
```

### **Pre-commit Hooks**
```bash
# Install pre-commit with SonarQube
pip install pre-commit
echo "
repos:
  - repo: local
    hooks:
      - id: sonarqube-scanner
        name: SonarQube Scanner
        entry: sonar-scanner
        language: system
        pass_filenames: false
" > .pre-commit-config.yaml

pre-commit install
```

---

## 🚀 **Docker Commands**

### **SonarQube Management**
```bash
# Start SonarQube
docker-compose up -d sonarqube

# Check SonarQube logs
docker-compose logs -f sonarqube

# Restart SonarQube
docker-compose restart sonarqube

# Stop SonarQube
docker-compose stop sonarqube

# Access SonarQube database
docker exec -it tcg_mysql mysql -u sonar_user -p sonarqube
```

### **Analysis Commands**
```bash
# Quick analysis
docker run --rm \
  -v "$(pwd):/usr/src" \
  -w /usr/src \
  sonarsource/sonar-scanner-cli \
  -Dsonar.host.url=http://host.docker.internal:9000 \
  -Dsonar.login=your_token

# With custom properties
docker run --rm \
  -v "$(pwd):/usr/src" \
  -w /usr/src \
  sonarsource/sonar-scanner-cli \
  -Dproject.settings=sonar-project.properties
```

---

## 📊 **Expected Results**

### **Phase 1 Analysis (SQL)**
- **Lines of Code**: ~2,000+ lines across SQL files
- **Security Hotspots**: Password management, connection strings
- **Code Smells**: Complex stored procedures, naming consistency
- **Duplicated Code**: Similar table structures across games

### **Phase 2 Analysis (API)**
- **Coverage Target**: 85%+ test coverage
- **Security Focus**: Input validation, authentication
- **Performance**: Complex route handlers
- **Maintainability**: Service layer organization

---

## 🔧 **Troubleshooting**

### **SonarQube Won't Start**
```bash
# Check container logs
docker-compose logs sonarqube

# Common issue: Insufficient memory
# Add to docker-compose.yml:
environment:
  - "SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true"
```

### **Analysis Fails**
```bash
# Check scanner logs
sonar-scanner -X  # Debug mode

# Verify project properties
cat sonar-project.properties

# Test connection
curl http://localhost:9000/api/system/status
```

### **Performance Issues**
```bash
# Increase Docker memory allocation
# Docker Desktop → Settings → Resources → Memory: 4GB+

# Exclude large files
echo "sonar.exclusions=**/node_modules/**,**/vendor/**" >> sonar-project.properties
```

---

## 🎯 **Next Steps**

1. **Start SonarQube**: `docker-compose up -d sonarqube`
2. **Configure Project**: Access http://localhost:9000
3. **Run First Analysis**: `sonar-scanner`
4. **Review Results**: Check for security issues and code smells
5. **Setup CI/CD**: Integrate with GitHub Actions (optional)

Your code quality analysis is ready to go! 🎉
