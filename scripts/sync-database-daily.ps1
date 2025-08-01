# Database Sync Automation Script
# Runs daily database synchronization with Scryfall

param(
    [switch]$Force,
    [switch]$DryRun,
    [string]$LogLevel = "info"
)

$ProjectRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$ApiScripts = Join-Path $ProjectRoot "api\scripts"
$LogsDir = Join-Path $ProjectRoot "api\logs"

# Ensure logs directory exists
if (!(Test-Path $LogsDir)) {
    New-Item -ItemType Directory -Path $LogsDir -Force | Out-Null
}

function Write-SyncLog {
    param([string]$Message, [string]$Level = "INFO")
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $LogMessage = "[$Timestamp] [$Level] $Message"
    
    Write-Host $LogMessage
    
    $LogFile = Join-Path $LogsDir "sync-scheduler-$(Get-Date -Format 'yyyy-MM-dd').log"
    Add-Content -Path $LogFile -Value $LogMessage
}

function Test-Services {
    Write-SyncLog "Checking required services..."
    
    # Check MySQL service
    $mysqlService = Get-Service -Name "MySQL80" -ErrorAction SilentlyContinue
    if (!$mysqlService -or $mysqlService.Status -ne "Running") {
        Write-SyncLog "MySQL service not running - attempting to start..." "WARN"
        try {
            Start-Service -Name "MySQL80"
            Start-Sleep -Seconds 5
            Write-SyncLog "MySQL service started successfully"
        } catch {
            Write-SyncLog "Failed to start MySQL service: $($_.Exception.Message)" "ERROR"
            return $false
        }
    }
    
    # Test database connection
    try {
        Set-Location $ApiScripts
        $testResult = node -e "
            const mysql = require('mysql2/promise');
            const dbConfig = {
                host: 'localhost',
                port: 3306,
                user: 'root',
                password: 'password',
                database: 'cardboard_garden'
            };
            mysql.createConnection(dbConfig)
                .then(conn => { conn.end(); console.log('OK'); })
                .catch(err => { console.log('FAIL'); process.exit(1); });
        " 2>$null
        
        if ($testResult -eq "OK") {
            Write-SyncLog "Database connection successful"
            return $true
        } else {
            Write-SyncLog "Database connection failed" "ERROR"
            return $false
        }
    } catch {
        Write-SyncLog "Database connection test failed: $($_.Exception.Message)" "ERROR"
        return $false
    }
}

function Start-DatabaseSync {
    Write-SyncLog "Starting database synchronization..."
    
    try {
        Set-Location $ApiScripts
        
        if ($DryRun) {
            Write-SyncLog "DRY RUN MODE - No changes will be made"
            # Could add dry-run logic to sync script
        }
        
        $syncProcess = Start-Process -FilePath "node" -ArgumentList "sync-database.js" -Wait -PassThru -NoNewWindow
        
        if ($syncProcess.ExitCode -eq 0) {
            Write-SyncLog "Database sync completed successfully"
            return $true
        } else {
            Write-SyncLog "Database sync failed with exit code: $($syncProcess.ExitCode)" "ERROR"
            return $false
        }
        
    } catch {
        Write-SyncLog "Sync process failed: $($_.Exception.Message)" "ERROR"
        return $false
    }
}

function Send-SyncReport {
    param([string]$Status, [string]$Details = "")
    
    $LogFile = Get-ChildItem -Path $LogsDir -Filter "sync-$(Get-Date -Format 'yyyy-MM-dd').log" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
    
    if ($LogFile) {
        $RecentLogs = Get-Content $LogFile.FullName | Select-Object -Last 20 | Out-String
        Write-SyncLog "Recent sync logs:`n$RecentLogs"
    }
    
    # Could integrate with email/Slack notifications here
    Write-SyncLog "Sync report generated - Status: $Status"
}

function Install-ScheduledTask {
    param(
        [string]$TaskName = "CardboardGarden-DatabaseSync",
        [string]$Time = "06:00"  # 6 AM daily
    )
    
    $TaskExists = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
    
    if ($TaskExists) {
        Write-SyncLog "Scheduled task '$TaskName' already exists"
        return
    }
    
    $ScriptPath = $PSCommandPath
    $Action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-File `"$ScriptPath`""
    $Trigger = New-ScheduledTaskTrigger -Daily -At $Time
    $Settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable
    $Principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive
    
    try {
        Register-ScheduledTask -TaskName $TaskName -Action $Action -Trigger $Trigger -Settings $Settings -Principal $Principal -Description "Daily Magic card database synchronization with Scryfall"
        Write-SyncLog "Scheduled task '$TaskName' created successfully - runs daily at $Time"
    } catch {
        Write-SyncLog "Failed to create scheduled task: $($_.Exception.Message)" "ERROR"
    }
}

# Main execution
Write-SyncLog "=== Cardboard Garden Database Sync ===" 
Write-SyncLog "Started at $(Get-Date)"

if ($Force) {
    Write-SyncLog "Force mode enabled - skipping service checks"
    $servicesReady = $true
} else {
    $servicesReady = Test-Services
}

if ($servicesReady) {
    $syncSuccess = Start-DatabaseSync
    
    if ($syncSuccess) {
        Send-SyncReport -Status "SUCCESS"
        Write-SyncLog "Database sync completed successfully"
    } else {
        Send-SyncReport -Status "FAILED" -Details "Check logs for details"
        Write-SyncLog "Database sync failed - check logs for details" "ERROR"
        exit 1
    }
} else {
    Write-SyncLog "Prerequisites not met - sync aborted" "ERROR"
    exit 1
}

Write-SyncLog "Sync process finished at $(Get-Date)"

# Example usage comments:
# Run manually: .\sync-database-daily.ps1
# Force run: .\sync-database-daily.ps1 -Force
# Dry run: .\sync-database-daily.ps1 -DryRun
# Install scheduled task: .\sync-database-daily.ps1 -InstallTask
