# Quick Start Guide - Digital Mirror

Get Digital Mirror running in under 5 minutes!

## The Fastest Way (Docker Compose)

**Requirements:** Docker Desktop installed

```bash
# 1. Clone the repository
git clone https://github.com/jeremymartinezq/Digital-Mirror-App.git
cd digital-mirror

# 2. Start everything with one command
cd infra
docker-compose up -d

# 3. Wait ~30 seconds for services to start

# 4. Open your browser
# Frontend: http://localhost:3000
# API Docs: http://localhost:8000/api/docs
```

That's it! 🎉

## What You Get

### Services Running:
- **Frontend**: React/Next.js web app on port 3000
- **Backend**: FastAPI server on port 8000
- **PostgreSQL**: Database on port 5432
- **Redis**: Cache on port 6379
- **PgAdmin**: Database UI on port 5050 (optional)

### Test Credentials:
Create your own account on http://localhost:3000/register

## Next Steps

### 1. Create Your First User

1. Go to http://localhost:3000
2. Click "Get Started"
3. Fill in registration form
4. You're logged in!

### 2. Explore the Dashboard

The dashboard shows:
- Net worth calculator
- Spending breakdown
- Recent transactions

### 3. Run a Simulation

1. Click "New Simulation" button
2. Choose a simulation type
3. Enter parameters
4. View AI-powered predictions

## API Exploration

Visit http://localhost:8000/api/docs for interactive API documentation.

### Try It Out:

1. Register a user via API
2. Login to get JWT token
3. Use token to access protected endpoints
4. Create simulations
5. View results

## Stopping Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v
```

## Troubleshooting

### Services won't start

```bash
# Check if ports are already in use
# Kill processes on ports 3000, 8000, 5432, 6379

# On Windows:
netstat -ano | findstr :8000

# On Mac/Linux:
lsof -i :8000
```

### Backend can't connect to database

```bash
# Wait for database to be ready
docker-compose logs postgres

# Restart backend
docker-compose restart backend
```

### Frontend can't reach backend

Check that NEXT_PUBLIC_API_URL is set correctly in docker-compose.yml

## Development Mode

Want to make changes and see them live?

### Backend (with auto-reload)

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend (with hot reload)

```bash
cd frontend/web
npm install
npm run dev
```

## What to Try

### Sample Workflows:

**1. Financial Dashboard**
- Link mock bank accounts
- View spending breakdown
- Calculate net worth
- Track transactions

**2. Purchase Simulation**
- Go to Simulations
- Choose "Major Purchase"
- Enter: $30,000 car, 5 years, 5% interest
- See monthly payment and total cost

**3. Investment Growth**
- Choose "Investment Growth"
- Enter: $10,000 initial, $500/month, 7% return, 10 years
- See compound growth projection

**4. Debt Payoff**
- Choose "Debt Repayment"
- Add multiple debts
- Compare avalanche vs snowball strategies
- See months to debt-free

## Configuration

### Change API URL (Frontend)

Edit `docker-compose.yml`:
```yaml
frontend-web:
  environment:
    NEXT_PUBLIC_API_URL: http://your-backend-url:8000
```

### Change Database Password

Edit `docker-compose.yml`:
```yaml
postgres:
  environment:
    POSTGRES_PASSWORD: your-secure-password

backend:
  environment:
    DATABASE_URL: postgresql+asyncpg://postgres:your-secure-password@postgres:5432/digital_mirror
```

## Data Persistence

Data is stored in Docker volumes:
- `postgres_data`: Database
- `redis_data`: Cache

To reset everything:
```bash
docker-compose down -v
docker-compose up -d
```

## Mobile App (Stub)

```bash
cd frontend/mobile
npm install
npm start
```

Scan QR code with Expo Go app on your phone.

## Need Help?

- Check logs: `docker-compose logs -f [service-name]`
- Restart service: `docker-compose restart [service-name]`
- See running containers: `docker-compose ps`
- Enter container: `docker-compose exec backend bash`

## Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for production setup with AWS, Kubernetes, and Terraform.

---

**Happy Simulating! 🎯**

