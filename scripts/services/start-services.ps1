# Start Development Services
# Starts API and Frontend servers as PowerShell background jobs

param(
    [switch]$WaitForStartup
)

Write-Host "Starting Cardboard Garden Services" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

$ProjectRoot = $PSScriptRoot | Split-Path -Parent | Split-Path -Parent
$overallSuccess = $true

# Check if services are already running
$existingJobs = Get-Job -Name "CardboardAPI", "CardboardFrontend" -ErrorAction SilentlyContinue
if ($existingJobs) {
    Write-Host "Services may already be running:" -ForegroundColor Yellow
    $existingJobs | ForEach-Object {
        Write-Host "   - $($_.Name) - $($_.State)"
    }
    Write-Host "`nRun .\scripts\services\stop-services.ps1 first to clean up" -ForegroundColor Yellow
    return
}

# Start API Server
Write-Host "Starting API server (smart port detection)..."
try {
    $apiJob = Start-Job -Name "CardboardAPI" -ScriptBlock {
        param($projectPath)
        Set-Location "$projectPath\api"
        npm run dev
    } -ArgumentList $ProjectRoot
    
    if ($apiJob.State -eq "Running") {
        Write-Host "API server started as background job" -ForegroundColor Green
    } else {
        Write-Host "API server failed to start properly" -ForegroundColor Red
        $overallSuccess = $false
    }
} catch {
    Write-Host "Failed to start API server: $($_.Exception.Message)" -ForegroundColor Red
    $overallSuccess = $false
}

# Wait a moment for API to initialize
Start-Sleep 3

# Start Frontend Server  
Write-Host "Starting frontend server (port 5173)..."
try {
    $frontendJob = Start-Job -Name "CardboardFrontend" -ScriptBlock {
        param($projectPath)
        Set-Location "$projectPath\app"
        npm run dev
    } -ArgumentList $ProjectRoot
    
    if ($frontendJob.State -eq "Running") {
        Write-Host "Frontend server started as background job" -ForegroundColor Green
    } else {
        Write-Host "Frontend server failed to start properly" -ForegroundColor Red
        $overallSuccess = $false
    }
} catch {
    Write-Host "Failed to start frontend server: $($_.Exception.Message)" -ForegroundColor Red
    $overallSuccess = $false
}

# Show job status
Write-Host "`nService Status:"
$currentJobs = Get-Job -Name "CardboardAPI", "CardboardFrontend" -ErrorAction SilentlyContinue
if ($currentJobs) {
    $currentJobs | ForEach-Object {
        $color = if ($_.State -eq "Running") { "Green" } else { "Red" }
        Write-Host "   - $($_.Name): $($_.State)" -ForegroundColor $color
        if ($_.State -ne "Running") {
            $overallSuccess = $false
        }
    }
} else {
    Write-Host "   - No jobs found" -ForegroundColor Red
    $overallSuccess = $false
}

if ($WaitForStartup -and $overallSuccess) {
    Write-Host "`nWaiting for services to start..." -ForegroundColor Yellow
    
    # Wait for API port file to be created (up to 20 seconds)
    $portFileWait = 0
    $portInfoPath = Join-Path $PSScriptRoot "..\..\\.api-port"
    
    while ($portFileWait -lt 20 -and -not (Test-Path $portInfoPath)) {
        Start-Sleep 1
        $portFileWait++
        if ($portFileWait % 5 -eq 0) {
            Write-Host "Waiting for API to initialize... ($portFileWait/20 seconds)" -ForegroundColor Yellow
        }
    }
    
    if (-not (Test-Path $portInfoPath)) {
        Write-Host "API port file not found after 20 seconds, using default port 3000" -ForegroundColor Yellow
    }
    
    # Test API health with dynamic port discovery and retry logic
    $apiPort = 3000
    $maxRetries = 3
    $retryCount = 0
    $healthCheckSuccess = $false
    
    while ($retryCount -lt $maxRetries -and -not $healthCheckSuccess) {
        try {
            # Try to get the actual API port
            if (Test-Path $portInfoPath) {
                $portInfo = Get-Content $portInfoPath | ConvertFrom-Json
                $apiPort = $portInfo.port
            }
            
            $health = Invoke-RestMethod -Uri "http://localhost:$apiPort/api/health" -TimeoutSec 5
            Write-Host "API Health Check: $($health.status)" -ForegroundColor Green
            $healthCheckSuccess = $true
        } catch {
            $retryCount++
            if ($retryCount -lt $maxRetries) {
                Write-Host "API Health Check attempt $retryCount failed, retrying in 3 seconds..." -ForegroundColor Yellow
                Start-Sleep 3
            } else {
                Write-Host "API Health Check failed after $maxRetries attempts: $($_.Exception.Message)" -ForegroundColor Red
                $overallSuccess = $false
            }
        }
    }
    
    # Open frontend
    if ($overallSuccess) {
        Write-Host "Opening frontend in browser..."
        Start-Process "http://localhost:5173"
    }
}

# Final status
if ($overallSuccess) {
    # Try to discover actual API port for final message
    $apiPort = 3000
    try {
        $portInfoPath = Join-Path $PSScriptRoot "..\\.api-port"
        if (Test-Path $portInfoPath) {
            $portInfo = Get-Content $portInfoPath | ConvertFrom-Json
            $apiPort = $portInfo.port
        }
    } catch {
        # Use default port
    }
    
    Write-Host "`nServices started successfully!" -ForegroundColor Green
    Write-Host "Access your application at:" -ForegroundColor White
    Write-Host "   - Frontend: http://localhost:5173" -ForegroundColor Cyan
    Write-Host "   - API:      http://localhost:$apiPort" -ForegroundColor Cyan
    Write-Host "`nTo check logs: Get-Job | Receive-Job" -ForegroundColor White
    Write-Host "To stop: .\scripts\services\stop-services.ps1" -ForegroundColor White
} else {
    Write-Host "`nSome services failed to start!" -ForegroundColor Red
    Write-Host "Check the job logs with: Get-Job | Receive-Job" -ForegroundColor Yellow
    Write-Host "Or try stopping and restarting: .\scripts\services\stop-services.ps1" -ForegroundColor Yellow
}
