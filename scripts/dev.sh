#!/bin/bash

# Cardboard Garden - Docker Development Script
# Provides convenient commands for Docker-based development

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Helper function for colored output
print_status() {
    echo -e "${GREEN}[TCG]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[TCG WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[TCG ERROR]${NC} $1"
}

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker Desktop and try again."
        exit 1
    fi
}

# Start database services
start_db() {
    print_status "Starting MySQL and phpMyAdmin services..."
    check_docker
    docker-compose up -d mysql phpmyadmin
    
    print_status "Waiting for MySQL to be ready..."
    timeout=60
    while ! docker exec tcg_mysql mysqladmin ping -h localhost -u root -ptcg_root_password_2024 --silent > /dev/null 2>&1; do
        timeout=$((timeout - 1))
        if [ $timeout -eq 0 ]; then
            print_error "MySQL failed to start within 60 seconds"
            exit 1
        fi
        sleep 1
    done
    
    print_status "Database services are ready!"
    print_status "phpMyAdmin: http://localhost:8080"
    print_status "MySQL: localhost:3306"
}

# Start all services
start_all() {
    print_status "Starting all services..."
    check_docker
    docker-compose up -d
    print_status "All services started!"
}

# Stop all services
stop() {
    print_status "Stopping all services..."
    docker-compose down
    print_status "All services stopped."
}

# Reset database (DELETE ALL DATA)
reset_db() {
    print_warning "This will DELETE ALL DATABASE DATA!"
    read -p "Are you sure? Type 'yes' to continue: " confirm
    if [ "$confirm" = "yes" ]; then
        print_status "Stopping services and removing volumes..."
        docker-compose down -v
        print_status "Starting fresh database..."
        start_db
        print_status "Database reset complete!"
    else
        print_status "Reset cancelled."
    fi
}

# Show service status
status() {
    print_status "Service status:"
    docker-compose ps
}

# Show logs
logs() {
    service=${1:-mysql}
    print_status "Showing logs for $service (Ctrl+C to exit)..."
    docker-compose logs -f "$service"
}

# Database backup
backup() {
    backup_name="tcg_backup_$(date +%Y%m%d_%H%M%S).sql"
    print_status "Creating database backup: $backup_name"
    docker exec tcg_mysql mysqldump -u tcg_app -ptcg_app_password_2024 --all-databases > "backups/$backup_name"
    print_status "Backup created: backups/$backup_name"
}

# Database restore
restore() {
    backup_file=$1
    if [ -z "$backup_file" ]; then
        print_error "Usage: ./dev.sh restore <backup_file>"
        exit 1
    fi
    
    if [ ! -f "$backup_file" ]; then
        print_error "Backup file not found: $backup_file"
        exit 1
    fi
    
    print_warning "This will REPLACE ALL DATABASE DATA!"
    read -p "Are you sure? Type 'yes' to continue: " confirm
    if [ "$confirm" = "yes" ]; then
        print_status "Restoring database from $backup_file..."
        docker exec -i tcg_mysql mysql -u tcg_app -ptcg_app_password_2024 < "$backup_file"
        print_status "Database restored successfully!"
    else
        print_status "Restore cancelled."
    fi
}

# Connect to MySQL
mysql() {
    print_status "Connecting to MySQL (password: tcg_app_password_2024)..."
    docker exec -it tcg_mysql mysql -u tcg_app -p
}

# Show help
help() {
    echo "Cardboard Garden - Docker Commands"
    echo ""
    echo "Usage: ./dev.sh <command>"
    echo ""
    echo "Commands:"
    echo "  start-db    Start MySQL and phpMyAdmin only"
    echo "  start-all   Start all services (database + API + frontend when available)"
    echo "  stop        Stop all services"
    echo "  reset-db    Reset database (DELETE ALL DATA)"
    echo "  status      Show service status"
    echo "  logs        Show MySQL logs (or specify service: logs phpmyadmin)"
    echo "  backup      Create database backup"
    echo "  restore     Restore from backup file"
    echo "  mysql       Connect to MySQL command line"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./dev.sh start-db"
    echo "  ./dev.sh logs mysql"
    echo "  ./dev.sh backup"
    echo "  ./dev.sh restore backups/tcg_backup_20240730_120000.sql"
}

# Create backups directory if it doesn't exist
mkdir -p backups

# Main command routing
case "${1:-help}" in
    "start-db")
        start_db
        ;;
    "start-all")
        start_all
        ;;
    "stop")
        stop
        ;;
    "reset-db")
        reset_db
        ;;
    "status")
        status
        ;;
    "logs")
        logs $2
        ;;
    "backup")
        backup
        ;;
    "restore")
        restore $2
        ;;
    "mysql")
        mysql
        ;;
    "help"|*)
        help
        ;;
esac
