# Check Development Services Status
# Shows status of API and Frontend services

Write-Host "Service Status Check" -ForegroundColor Cyan
Write-Host "====================" -ForegroundColor Cyan

$overallHealthy = $true

# Check PowerShell background jobs
Write-Host "`nPowerShell Jobs:"
$jobs = Get-Job -Name "CardboardAPI", "CardboardFrontend" -ErrorAction SilentlyContinue

if ($jobs) {
    $jobs | ForEach-Object {
        $status = switch ($_.State) {
            "Running" { "Running" }
            "Completed" { "Completed" }
            "Failed" { "Failed" }
            "Stopped" { "Stopped" }
            default { "$($_.State)" }
        }
        $color = if ($_.State -eq "Running") { "Green" } else { "Red" }
        Write-Host "   - $($_.Name): $status" -ForegroundColor $color
        
        if ($_.State -ne "Running") {
            $overallHealthy = $false
        }
    }
} else {
    Write-Host "   No background jobs found" -ForegroundColor Yellow
    $overallHealthy = $false
}

# Check Node.js processes
Write-Host "`nNode.js Processes:"
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    $nodeProcesses | ForEach-Object {
        Write-Host "   - PID $($_.Id): $($_.ProcessName)" -ForegroundColor Green
    }
} else {
    Write-Host "   No Node.js processes found" -ForegroundColor Yellow
}

# Check ports dynamically
Write-Host "`nPort Status:"

# Try to read actual API port from file
$apiPort = 3000
try {
    $portInfoPath = Join-Path $PSScriptRoot "../../.api-port"
    if (Test-Path $portInfoPath) {
        $portInfo = Get-Content $portInfoPath | ConvertFrom-Json
        $apiPort = $portInfo.port
        Write-Host "   Using discovered API port: $apiPort" -ForegroundColor Cyan
    }
} catch {
    Write-Host "   Using default API port: $apiPort" -ForegroundColor Yellow
}

$portCheck = netstat -ano | findstr ":$apiPort"
$port5173 = netstat -ano | findstr ":5173"

if ($portCheck) {
    Write-Host "   - Port $apiPort (API): In Use" -ForegroundColor Green
} else {
    Write-Host "   - Port $apiPort (API): Free" -ForegroundColor Red
    $overallHealthy = $false
}

if ($port5173) {
    Write-Host "   - Port 5173 (Frontend): In Use" -ForegroundColor Green
} else {
    Write-Host "   - Port 5173 (Frontend): Free" -ForegroundColor Red
    $overallHealthy = $false
}

# Test API if running
if ($portCheck) {
    Write-Host "`nAPI Health Check:"
    try {
        $health = Invoke-RestMethod -Uri "http://localhost:$apiPort/api/health" -TimeoutSec 3
        Write-Host "   API responded: $($health.status)" -ForegroundColor Green
        
        # Quick database check
        try {
            $dbTest = Invoke-RestMethod -Uri "http://localhost:$apiPort/api/cards/search?q=test&limit=1" -TimeoutSec 3
            if ($dbTest.cards -and $dbTest.cards.length -gt 0) {
                Write-Host "   Database accessible with $($dbTest.count) cards found" -ForegroundColor Green
            } else {
                Write-Host "   Database accessible but no results" -ForegroundColor Yellow
            }
        } catch {
            Write-Host "   Database check failed" -ForegroundColor Red
            $overallHealthy = $false
        }
    } catch {
        Write-Host "   API health check failed" -ForegroundColor Red
        $overallHealthy = $false
    }
}

# Overall status
Write-Host "`nOverall Status:"
if ($overallHealthy) {
    Write-Host "All services are running and healthy!" -ForegroundColor Green
} else {
    Write-Host "Some services are not running or unhealthy!" -ForegroundColor Red
    Write-Host "Try restarting services with: .\scripts\restart-services.ps1" -ForegroundColor Yellow
}

Write-Host "`nQuick Actions:" -ForegroundColor White
Write-Host "   - Start services: .\scripts\services\start-services.ps1" -ForegroundColor Cyan
Write-Host "   - Stop services:  .\scripts\services\stop-services.ps1" -ForegroundColor Cyan
Write-Host "   - View job logs:  Get-Job | Receive-Job" -ForegroundColor Cyan
