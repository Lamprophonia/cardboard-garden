# Restart Development Services
# The lazy developer's one-command solution: Stop -> Start -> Status

param(
    [switch]$QuickStart,  # Skip startup wait
    [switch]$OpenBrowser  # Open browser after start
)

Write-Host "Cardboard Garden - Full Service Restart" -ForegroundColor Magenta
Write-Host "=======================================" -ForegroundColor Magenta

$ProjectRoot = $PSScriptRoot | Split-Path
$restartSuccess = $true

# Step 1: Stop everything
Write-Host "`n[1/3] Stopping services..." -ForegroundColor Cyan
& "$ProjectRoot\scripts\services\stop-services.ps1"

# Brief pause to ensure cleanup
Start-Sleep 2

# Step 2: Start everything
Write-Host "`n[2/3] Starting services..." -ForegroundColor Cyan
if ($QuickStart) {
    & "$ProjectRoot\scripts\services\start-services.ps1"
} else {
    & "$ProjectRoot\scripts\services\start-services.ps1" -WaitForStartup
}

# Check if services actually started by testing ports
# Try to discover actual API port
$apiPort = 3000
try {
    $portInfoPath = Join-Path $PSScriptRoot ".api-port"
    if (Test-Path $portInfoPath) {
        $portInfo = Get-Content $portInfoPath | ConvertFrom-Json
        $apiPort = $portInfo.port
    }
} catch {
    # Use default port
}

$portCheck = netstat -ano | findstr ":$apiPort"
$port5173 = netstat -ano | findstr ":5173"

if (-not $portCheck -or -not $port5173) {
    $restartSuccess = $false
}

# Step 3: Show status
Write-Host "`n[3/3] Checking status..." -ForegroundColor Cyan
& "$ProjectRoot\scripts\services\status-services.ps1"

# Optional browser launch (only if services are running)
if ($OpenBrowser -and $restartSuccess) {
    Write-Host "`nOpening browser..." -ForegroundColor Green
    Start-Process "http://localhost:5173"
} elseif ($OpenBrowser -and -not $restartSuccess) {
    Write-Host "`nSkipping browser launch - services not fully running" -ForegroundColor Yellow
}

# Conditional completion message
if ($restartSuccess) {
    Write-Host "`nComplete! Your Cardboard Garden is ready with 108,809+ cards!" -ForegroundColor Green
    Write-Host "Your complete Magic: The Gathering database is ready to search!" -ForegroundColor White
} else {
    Write-Host "`nRestart completed with issues - some services may not be running properly!" -ForegroundColor Yellow
    Write-Host "Check the status above and try running individual service scripts if needed." -ForegroundColor White
}