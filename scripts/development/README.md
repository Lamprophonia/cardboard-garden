# Development Scripts

Primary development workflow scripts for Cardboard Garden.

## Scripts

### `start-dev.ps1` ⭐ **PRIMARY SCRIPT**
Starts both API and frontend services as PowerShell background jobs.
- ✅ Completely independent of VS Code terminals
- ✅ Auto-restart with nodemon (API) and Vite (frontend)  
- ✅ Persistent across VS Code restarts
- ✅ Proper logging and status management
- ✅ Visual feedback with emojis

**Usage:**
```powershell
# From project root
.\scripts\development\start-dev.ps1
```

### `stop-services.ps1`
Stops all development services and cleans up background jobs.

**Usage:**
```powershell
.\scripts\development\stop-services.ps1
```

## Management Commands

```powershell
# Service Status
Get-Job                                    # List all background jobs

# View Logs
Receive-Job -Name CardboardAPI -Keep       # API server logs
Receive-Job -Name CardboardFrontend -Keep  # Frontend logs

# Complete Cleanup
.\scripts\development\stop-services.ps1    # Graceful stop
taskkill /f /im node.exe                  # Force kill if needed
```
