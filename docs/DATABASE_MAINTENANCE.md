# Database Maintenance System

This system keeps your Magic card database synchronized with Scryfall's latest data automatically.

## 🔄 **How It Works**

### **Smart Updates**
- Checks Scryfall's bulk data timestamp daily
- Only downloads if there are actual updates (saves bandwidth)
- Performs incremental updates (new cards + changed cards)
- Maintains complete logs of all operations

### **Update Types**
- **New Cards**: Newly released cards from latest sets
- **Card Updates**: Oracle text changes, errata, image updates
- **Set Information**: New set releases, set name changes
- **Metadata**: Artist corrections, collector number fixes

## 📊 **Components**

### **Core Sync Engine** (`api/scripts/sync-database.js`)
- Compares local database timestamp with Scryfall
- Downloads only when updates are available
- Processes cards in batches for memory efficiency
- Provides detailed progress reporting and error handling
- Generates comprehensive sync reports

### **Automated Scheduler** (`scripts/sync-database-daily.ps1`)
- Runs daily checks (default: 6:00 AM)
- Validates services before sync (MySQL, connection)
- Creates Windows Scheduled Task for automation
- Generates daily log files with full audit trail
- Handles error conditions gracefully

### **Manual Sync** (`scripts/sync-database-manual.ps1`)
- One-click manual database updates
- Perfect for immediate updates when new sets release
- Same comprehensive logging as automated system

## 🚀 **Setup Instructions**

### **1. Initial Setup**
```powershell
# Navigate to project root
cd C:\Users\brian\Projects\cardboard-garden

# Run manual sync to test
.\scripts\sync-database-manual.ps1
```

### **2. Enable Daily Automation**
```powershell
# Install Windows Scheduled Task (runs daily at 6 AM)
.\scripts\sync-database-daily.ps1 -InstallTask
```

### **3. Customize Schedule** (Optional)
```powershell
# Change sync time (example: 2:30 AM)
$TaskName = "CardboardGarden-DatabaseSync"
$NewTrigger = New-ScheduledTaskTrigger -Daily -At "02:30"
Set-ScheduledTask -TaskName $TaskName -Trigger $NewTrigger
```

## 📋 **Usage Examples**

### **Manual Sync**
```powershell
# Standard manual sync
.\scripts\sync-database-manual.ps1

# Force sync (skip service checks)
.\scripts\sync-database-daily.ps1 -Force

# Test run (no actual changes)
.\scripts\sync-database-daily.ps1 -DryRun
```

### **Monitoring**
```powershell
# Check scheduled task status
Get-ScheduledTask -TaskName "CardboardGarden-DatabaseSync"

# View recent logs
Get-Content "api\logs\sync-$(Get-Date -Format 'yyyy-MM-dd').log" -Tail 20

# Check last sync timestamp
# (Stored in sync_metadata table)
```

## 📁 **Log Files**

### **Sync Logs** (`api/logs/sync-YYYY-MM-DD.log`)
```
[2025-08-01T06:00:15.123Z] [INFO] Database connected successfully
[2025-08-01T06:00:16.456Z] [INFO] Checking Scryfall bulk data for updates...
[2025-08-01T06:00:17.789Z] [INFO] Scryfall data: 485.2 MB, last updated: 2025-08-01T09:15:22.111Z
[2025-08-01T06:00:18.012Z] [INFO] Last sync: 2025-07-31T09:10:15.999Z
[2025-08-01T06:00:18.234Z] [INFO] Update needed - downloading new data...
[2025-08-01T06:05:45.567Z] [INFO] Finished processing 108,923 cards
[2025-08-01T06:06:12.890Z] [INFO] Inserting 114 new cards...
[2025-08-01T06:06:15.123Z] [INFO] Updating 27 existing cards...
```

### **Scheduler Logs** (`api/logs/sync-scheduler-YYYY-MM-DD.log`)
```
[2025-08-01 06:00:00] [INFO] === Cardboard Garden Database Sync ===
[2025-08-01 06:00:01] [INFO] Checking required services...
[2025-08-01 06:00:02] [INFO] MySQL service started successfully
[2025-08-01 06:00:03] [INFO] Database connection successful
[2025-08-01 06:06:20] [INFO] Database sync completed successfully
```

## 🎯 **Best Practices**

### **Monitoring Schedule**
- **Daily**: Automated sync handles routine updates
- **Weekly**: Review logs for any recurring issues
- **Monthly**: Check disk space in logs directory
- **Set Releases**: Manual sync on major set release days

### **Maintenance**
- **Log Rotation**: Old logs can be archived/deleted after 30 days
- **Error Handling**: Failed syncs retry automatically next day
- **Bandwidth**: Sync only downloads when changes exist (efficient)
- **Backup**: Database changes are logged for rollback if needed

### **Performance Notes**
- **Full sync**: ~5-10 minutes for complete update
- **No-change check**: ~30 seconds when current
- **Memory usage**: ~500MB during large updates
- **Disk space**: ~50MB per month for logs

## 🔧 **Troubleshooting**

### **Common Issues**
- **MySQL not running**: Script auto-starts service
- **Network timeout**: Automatic retry with exponential backoff
- **Disk space**: Logs include size warnings
- **Permission errors**: Run PowerShell as Administrator

### **Manual Recovery**
```powershell
# Reset sync metadata (forces full re-sync)
# Connect to MySQL and run:
# DELETE FROM sync_metadata WHERE key_name = 'last_bulk_sync';

# Check sync status
.\scripts\sync-database-manual.ps1
```

---

This system ensures your Magic card database stays current with minimal maintenance while providing complete audit trails and error handling.
