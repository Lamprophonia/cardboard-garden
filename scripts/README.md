# Cardboard Garden Development Scripts

This folder contains all development and utility scripts for the Cardboard Garden project.

## 🚀 **Quick Start (Recommended)**

### PowerShell (Windows) - Primary Method
```powershell
# From project root - starts both API and frontend
.\scripts\development\start-dev.ps1

# Check status
Get-Job

# View logs
Receive-Job -Name CardboardAPI -Keep
Receive-Job -Name CardboardFrontend -Keep

# Stop services
.\scripts\development\stop-services.ps1
```

## 📁 **Script Organization**

### **Development Scripts** (`development/`)
- `start-dev.ps1` - ⭐ Primary development script (PowerShell background jobs)
- `stop-services.ps1` - Stop all development services

### **Database Scripts** (`database/`)
- *Future database management scripts*

### **Temporary Scripts** (`temp/`)
- Analysis scripts, debugging utilities, and one-time tools
- Automatically cleaned up after 30 days
- See `temp/README.md` for details

### **Utility Scripts** (`utilities/`)
- `cleanup-temp.py` - Clean up temporary files and analysis scripts
- *Future utility and maintenance scripts*

### **Legacy Batch Scripts** (root level)
- `start-dev.bat` & `stop-dev.bat` - Simple CMD window approach

#### `dev.bat` & `dev.sh`
Legacy development scripts for database management.

## 🌐 **Service URLs**

- **API Server:** http://localhost:3001
  - Health check: http://localhost:3001/api/health
  - Card search: http://localhost:3001/api/cards/search
  - Collection: http://localhost:3001/api/collection
- **Frontend:** http://localhost:5173

## 📋 **Requirements**

- Node.js installed
- Global packages: `nodemon` (`npm install -g nodemon`)
- MySQL database running
- Dependencies installed:
  ```bash
  cd api && npm install
  cd ../app && npm install
  ```

## 🔧 **Management Commands**

```powershell
# Service Status
Get-Job                                    # List all background jobs
Get-Job | Where-Object {$_.State -eq "Running"}  # Show only running jobs

# View Logs
Receive-Job -Name CardboardAPI -Keep       # API server logs
Receive-Job -Name CardboardFrontend -Keep  # Frontend logs

# Restart Individual Services
Get-Job -Name CardboardAPI | Stop-Job     # Stop API only
# Then run start-dev.ps1 again

# Complete Cleanup
.\scripts\stop-services.ps1               # Graceful stop
taskkill /f /im node.exe                  # Force kill if needed
```

## 📝 **Legacy Scripts Documentation**

For database setup, see the bottom section of this file.

---

## 🗃️ **Legacy Database Scripts**

### **Windows Users**
```cmd
# Start database services
scripts\dev.bat start-db
```

## 🧹 **Maintenance Commands**

### **Temporary File Cleanup**
```powershell
# List all temporary files
python scripts\cleanup-temp.py --list

# Preview what would be cleaned (dry run)
python scripts\cleanup-temp.py

# Actually clean up old temporary files
python scripts\cleanup-temp.py --execute
```

### **Linux/macOS Users**
```bash
# Start database services
./scripts/dev.sh start-db
```

For detailed legacy documentation, see the original README sections below.
