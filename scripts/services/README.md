# Service Management Scripts

This folder contains PowerShell scripts for managing the Cardboard Garden development services.

## Scripts

- **`start-services.ps1`** - Start API and frontend servers as background jobs
- **`stop-services.ps1`** - Stop all running services and clean up background jobs
- **`status-services.ps1`** - Check the status of running services and ports

## Usage

From the project root directory:

```powershell
# Start services
.\scripts\services\start-services.ps1

# Stop services  
.\scripts\services\stop-services.ps1

# Check status
.\scripts\services\status-services.ps1

# Or use the convenience script
.\scripts\restart-services.ps1
```

## Parameters

- **`start-services.ps1 -WaitForStartup`** - Wait for services to fully start and test API health
- **`restart-services.ps1 -QuickStart`** - Skip startup wait time
- **`restart-services.ps1 -OpenBrowser`** - Automatically open browser after restart

All scripts use PowerShell background jobs to run services independently.
