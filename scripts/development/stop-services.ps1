# Stop Cardboard Garden Services
Write-Host "🛑 Stopping Cardboard Garden Services..." -ForegroundColor Yellow

Get-Job -Name "CardboardAPI", "CardboardFrontend" -ErrorAction SilentlyContinue | Stop-Job
Get-Job -Name "CardboardAPI", "CardboardFrontend" -ErrorAction SilentlyContinue | Remove-Job

# Also kill any remaining node processes
taskkill /f /im node.exe 2>$null

Write-Host "✅ All services stopped" -ForegroundColor Green
