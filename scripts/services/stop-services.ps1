# Stop Development Services
# Stops API and Frontend background jobs cleanly

Write-Host "Stopping Cardboard Garden Services" -ForegroundColor Red
Write-Host "=====================================" -ForegroundColor Red

$overallSuccess = $true

# Stop PowerShell background jobs
$jobs = Get-Job -Name "CardboardAPI", "CardboardFrontend" -ErrorAction SilentlyContinue

if ($jobs) {
    Write-Host "Found running jobs:"
    $jobs | ForEach-Object {
        Write-Host "   - $($_.Name) - $($_.State)" -ForegroundColor Yellow
    }
    
    Write-Host "`nStopping jobs..."
    try {
        $jobs | Stop-Job
        $jobs | Remove-Job -Force
        Write-Host "Background jobs stopped" -ForegroundColor Green
    } catch {
        Write-Host "Failed to stop background jobs: $($_.Exception.Message)" -ForegroundColor Red
        $overallSuccess = $false
    }
} else {
    Write-Host "No PowerShell jobs found" -ForegroundColor Yellow
}

# Kill any remaining Node processes
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "`nStopping Node.js processes..."
    $nodeProcesses | ForEach-Object {
        Write-Host "   - Stopping PID $($_.Id)" -ForegroundColor Yellow
    }
    try {
        $nodeProcesses | Stop-Process -Force
        Write-Host "Node.js processes stopped" -ForegroundColor Green
    } catch {
        Write-Host "Failed to stop some Node.js processes: $($_.Exception.Message)" -ForegroundColor Red
        $overallSuccess = $false
    }
} else {
    Write-Host "No Node.js processes found" -ForegroundColor Yellow
}

# Verify ports are free
Write-Host "`nChecking ports..."
$port3000 = netstat -ano | findstr ":3000"
$port5173 = netstat -ano | findstr ":5173"

if ($port3000) {
    Write-Host "Port 3000 still in use:" -ForegroundColor Yellow
    Write-Host $port3000
    $overallSuccess = $false
} else {
    Write-Host "Port 3000 is free" -ForegroundColor Green
}

if ($port5173) {
    Write-Host "Port 5173 still in use:" -ForegroundColor Yellow
    Write-Host $port5173
    $overallSuccess = $false
} else {
    Write-Host "Port 5173 is free" -ForegroundColor Green
}

# Final status
if ($overallSuccess) {
    Write-Host "`nAll services stopped successfully!" -ForegroundColor Green
} else {
    Write-Host "`nSome services may not have stopped cleanly!" -ForegroundColor Red
    Write-Host "You may need to manually kill processes or restart your terminal." -ForegroundColor Yellow
}
