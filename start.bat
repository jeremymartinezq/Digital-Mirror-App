@echo off
REM Digital Mirror - Quick Start Script for Windows
REM This script starts all services with Docker Compose

echo 🪞 Digital Mirror - Starting Services...
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not installed. Please install Docker Desktop first.
    echo    Visit: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

REM Navigate to infra directory
cd infra
if errorlevel 1 (
    echo ❌ Could not find infra directory
    pause
    exit /b 1
)

REM Start services
echo 🚀 Starting Digital Mirror services...
echo.

docker-compose up -d
if errorlevel 1 (
    docker compose up -d
)

if errorlevel 1 (
    echo.
    echo ❌ Failed to start services. Please check Docker logs:
    echo    docker compose logs
    pause
    exit /b 1
)

echo.
echo ✅ Services started successfully!
echo.
echo 📍 Access Points:
echo    - Frontend:  http://localhost:3000
echo    - Backend:   http://localhost:8000
echo    - API Docs:  http://localhost:8000/api/docs
echo    - PgAdmin:   http://localhost:5050 (optional)
echo.
echo 📊 Check service status:
echo    docker compose ps
echo.
echo 📋 View logs:
echo    docker compose logs -f [service-name]
echo.
echo 🛑 Stop services:
echo    docker compose down
echo.
echo 🎯 Next Steps:
echo    1. Visit http://localhost:3000
echo    2. Create an account
echo    3. Explore the dashboard
echo    4. Run your first simulation!
echo.
pause

