# Start Cardboard Garden Services as Background Jobs
Write-Host "🃏 Starting Cardboard Garden Development Services..." -ForegroundColor Green

# Stop any existing jobs
Get-Job -Name "CardboardAPI", "CardboardFrontend" -ErrorAction SilentlyContinue | Stop-Job
Get-Job -Name "CardboardAPI", "CardboardFrontend" -ErrorAction SilentlyContinue | Remove-Job

# Start API Server
$apiJob = Start-Job -Name "CardboardAPI" -ScriptBlock {
    Set-Location "C:\Users\brian\Projects\cardboard-garden\api"
    $env:PORT = "3001"
    nodemon server.js
}

# Start Frontend
$frontendJob = Start-Job -Name "CardboardFrontend" -ScriptBlock {
    Set-Location "C:\Users\brian\Projects\cardboard-garden\app"
    npm run dev
}

Write-Host "✅ API Server job started (ID: $($apiJob.Id))" -ForegroundColor Green
Write-Host "✅ Frontend job started (ID: $($frontendJob.Id))" -ForegroundColor Green
Write-Host ""
Write-Host "📊 API: http://localhost:3001" -ForegroundColor Cyan
Write-Host "⚛️  Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "To check status: Get-Job"
Write-Host "To view logs: Receive-Job -Name CardboardAPI -Keep"
Write-Host "To stop: .\scripts\development\stop-services.ps1"
