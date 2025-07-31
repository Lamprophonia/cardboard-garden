@echo off
REM Cardboard Garden - Docker Development Script for Windows
REM Provides convenient commands for Docker-based development

setlocal enabledelayedexpansion

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo [TCG ERROR] Docker is not running. Please start Docker Desktop and try again.
    exit /b 1
)

set command=%1
if "%command%"=="" set command=help

if "%command%"=="start-db" goto start_db
if "%command%"=="start-all" goto start_all
if "%command%"=="stop" goto stop
if "%command%"=="reset-db" goto reset_db
if "%command%"=="status" goto status
if "%command%"=="logs" goto logs
if "%command%"=="backup" goto backup
if "%command%"=="restore" goto restore
if "%command%"=="mysql" goto mysql
if "%command%"=="sonar" goto sonar
goto help

:start_db
echo [TCG] Starting MySQL and phpMyAdmin services...
docker-compose up -d mysql phpmyadmin

echo [TCG] Waiting for MySQL to be ready...
:wait_mysql
timeout /t 2 /nobreak >nul
docker exec tcg_mysql mysqladmin ping -h localhost -u root -p%MYSQL_ROOT_PASSWORD% --silent >nul 2>&1
if errorlevel 1 goto wait_mysql

echo [TCG] Database services are ready!
echo [TCG] phpMyAdmin: http://localhost:8080
echo [TCG] MySQL: localhost:3306
goto end

:start_all
echo [TCG] Starting all services...
docker-compose up -d
echo [TCG] All services started!
goto end

:stop
echo [TCG] Stopping all services...
docker-compose down
echo [TCG] All services stopped.
goto end

:reset_db
echo [TCG WARNING] This will DELETE ALL DATABASE DATA!
set /p confirm="Are you sure? Type 'yes' to continue: "
if not "%confirm%"=="yes" (
    echo [TCG] Reset cancelled.
    goto end
)

echo [TCG] Stopping services and removing volumes...
docker-compose down -v
echo [TCG] Starting fresh database...
call :start_db
echo [TCG] Database reset complete!
goto end

:status
echo [TCG] Service status:
docker-compose ps
goto end

:logs
set service=%2
if "%service%"=="" set service=mysql
echo [TCG] Showing logs for %service% (Ctrl+C to exit)...
docker-compose logs -f %service%
goto end

:backup
if not exist backups mkdir backups
for /f "tokens=1-4 delims=/ " %%a in ('echo %date%') do set backup_date=%%c%%a%%b
for /f "tokens=1-3 delims=:." %%a in ('echo %time%') do set backup_time=%%a%%b%%c
set backup_time=%backup_time: =0%
set backup_name=tcg_backup_%backup_date%_%backup_time%.sql

echo [TCG] Creating database backup: %backup_name%
docker exec tcg_mysql mysqladump -u tcg_app -p%MYSQL_PASSWORD% --all-databases > backups\%backup_name%
echo [TCG] Backup created: backups\%backup_name%
goto end

:restore
set backup_file=%2
if "%backup_file%"=="" (
    echo [TCG ERROR] Usage: dev.bat restore ^<backup_file^>
    goto end
)

if not exist "%backup_file%" (
    echo [TCG ERROR] Backup file not found: %backup_file%
    goto end
)

echo [TCG WARNING] This will REPLACE ALL DATABASE DATA!
set /p confirm="Are you sure? Type 'yes' to continue: "
if not "%confirm%"=="yes" (
    echo [TCG] Restore cancelled.
    goto end
)

echo [TCG] Restoring database from %backup_file%...
docker exec -i tcg_mysql mysql -u tcg_app -p%MYSQL_PASSWORD% < "%backup_file%"
echo [TCG] Database restored successfully!
goto end

:mysql
echo [TCG] Connecting to MySQL (password will be prompted)...
docker exec -it tcg_mysql mysql -u tcg_app -p
goto end

:sonar
echo [TCG] Starting SonarQube analysis...
docker-compose up -d sonarqube
echo [TCG] Waiting for SonarQube to be ready...
:wait_sonar
timeout /t 5 /nobreak >nul
curl -s http://localhost:9000/api/system/status >nul 2>&1
if errorlevel 1 goto wait_sonar
echo [TCG] SonarQube is ready! Open http://localhost:9000
echo [TCG] Login: admin / admin (change password on first login)
goto end

:help
echo Cardboard Garden - Docker Commands
echo.
echo Usage: dev.bat ^<command^>
echo.
echo Commands:
echo   start-db    Start MySQL and phpMyAdmin only
echo   start-all   Start all services (database + API + frontend when available)
echo   stop        Stop all services
echo   reset-db    Reset database (DELETE ALL DATA)
echo   status      Show service status
echo   logs        Show MySQL logs (or specify service: logs phpmyadmin)
echo   backup      Create database backup
echo   restore     Restore from backup file
echo   mysql       Connect to MySQL command line
echo   sonar       Start SonarQube and show access information
echo   help        Show this help message
echo.
echo Examples:
echo   dev.bat start-db
echo   dev.bat logs mysql
echo   dev.bat backup
echo   dev.bat restore backups\tcg_backup_20240730_120000.sql

:end
