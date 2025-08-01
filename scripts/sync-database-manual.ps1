# Quick Database Sync - Manual execution
# Run this when you want to manually check for updates

$ProjectRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$ApiScripts = Join-Path $ProjectRoot "api\scripts"

Write-Host "🃏 Cardboard Garden - Manual Database Sync" -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Green

# Check if we're in the right location
if (!(Test-Path (Join-Path $ApiScripts "sync-database.js"))) {
    Write-Host "❌ Sync script not found. Please run from project root." -ForegroundColor Red
    exit 1
}

Write-Host "📍 Project location: $ProjectRoot"
Write-Host "🔄 Starting manual sync..."

Set-Location $ApiScripts

try {
    # Run the sync
    node sync-database.js
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Sync completed successfully!" -ForegroundColor Green
    } else {
        Write-Host "❌ Sync failed. Check the logs for details." -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error running sync: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n📋 To set up automated daily sync, run:"
Write-Host "   .\scripts\sync-database-daily.ps1 -InstallTask" -ForegroundColor Cyan
