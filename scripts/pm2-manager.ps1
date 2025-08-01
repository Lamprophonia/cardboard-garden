# PM2 Service Management for Cardboard Garden
# Professional-grade process management with monitoring

param(
    [ValidateSet("start", "stop", "restart", "status", "logs", "monit")]
    [string]$Action = "status"
)

$ProjectRoot = Split-Path $PSScriptRoot -Parent

Write-Host "Cardboard Garden - PM2 Service Management" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green

switch ($Action) {
    "start" {
        Write-Host "Starting services with PM2..."
        pm2 start "$ProjectRoot\ecosystem.config.js"
        pm2 save
    }
    "stop" {
        Write-Host "Stopping services..."
        pm2 stop ecosystem.config.js
    }
    "restart" {
        Write-Host "Restarting services..."
        pm2 restart ecosystem.config.js
    }
    "status" {
        Write-Host "Service Status:"
        pm2 status
        Write-Host "`nQuick Actions:" -ForegroundColor Yellow
        Write-Host "  .\scripts\pm2-manager.ps1 -Action start   # Start services"
        Write-Host "  .\scripts\pm2-manager.ps1 -Action restart # Restart services"
        Write-Host "  .\scripts\pm2-manager.ps1 -Action logs    # View logs"
        Write-Host "  .\scripts\pm2-manager.ps1 -Action monit   # Real-time monitoring"
    }
    "logs" {
        Write-Host "Opening logs (Ctrl+C to exit)..."
        pm2 logs
    }
    "monit" {
        Write-Host "Opening PM2 monitoring dashboard..."
        pm2 monit
    }
}
