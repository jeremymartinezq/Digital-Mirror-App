#!/bin/bash

# Digital Mirror - Quick Start Script
# This script starts all services with Docker Compose

echo "🪞 Digital Mirror - Starting Services..."
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker Desktop first."
    echo "   Visit: https://www.docker.com/products/docker-desktop"
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not available. Please install Docker Compose."
    exit 1
fi

# Navigate to infra directory
cd infra || exit 1

# Check if .env file exists, if not create from example
if [ ! -f ../.env ]; then
    echo "📝 Creating .env file from example..."
    if [ -f ../backend/.env.example ]; then
        cp ../backend/.env.example ../.env
        echo "✅ .env file created. Please update with your configuration if needed."
    fi
fi

# Start services
echo "🚀 Starting Digital Mirror services..."
echo ""

# Use docker compose (v2) or docker-compose (v1)
if docker compose version &> /dev/null; then
    docker compose up -d
else
    docker-compose up -d
fi

# Check if services started successfully
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Services started successfully!"
    echo ""
    echo "📍 Access Points:"
    echo "   - Frontend:  http://localhost:3000"
    echo "   - Backend:   http://localhost:8000"
    echo "   - API Docs:  http://localhost:8000/api/docs"
    echo "   - PgAdmin:   http://localhost:5050 (optional, username: admin@digitalmirror.com, password: admin)"
    echo ""
    echo "📊 Check service status:"
    echo "   docker compose ps"
    echo ""
    echo "📋 View logs:"
    echo "   docker compose logs -f [service-name]"
    echo ""
    echo "🛑 Stop services:"
    echo "   docker compose down"
    echo ""
    echo "🎯 Next Steps:"
    echo "   1. Visit http://localhost:3000"
    echo "   2. Create an account"
    echo "   3. Explore the dashboard"
    echo "   4. Run your first simulation!"
    echo ""
else
    echo ""
    echo "❌ Failed to start services. Please check Docker logs:"
    echo "   docker compose logs"
    exit 1
fi

