# Digital Mirror - Backend API

FastAPI backend for the Digital Mirror financial simulation platform.

## Features

- **JWT Authentication**: Secure user authentication
- **PostgreSQL Database**: Async SQLAlchemy ORM
- **Redis Caching**: Session management and caching
- **RESTful API**: Clean, documented endpoints
- **ML Simulations**: Financial prediction engine
- **Plaid Integration**: Bank account linking (mock for MVP)

## Setup

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Environment Configuration

Create `.env` file:

```env
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/digital_mirror
REDIS_URL=redis://localhost:6379
SECRET_KEY=your-secret-key
```

### Run Development Server

```bash
uvicorn app.main:app --reload
```

API will be available at: http://localhost:8000

## API Documentation

- **Swagger UI**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc
- **OpenAPI Schema**: http://localhost:8000/api/openapi.json

## Testing

```bash
pytest
pytest --cov=app
```

## Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI application
│   ├── db.py                # Database configuration
│   ├── auth/                # Authentication
│   │   ├── security.py      # JWT, password hashing
│   │   └── __init__.py
│   ├── models/              # SQLAlchemy models
│   │   ├── user.py
│   │   ├── account.py
│   │   ├── transaction.py
│   │   ├── simulation.py
│   │   └── gamification.py
│   ├── routes/              # API endpoints
│   │   ├── auth.py
│   │   ├── users.py
│   │   ├── accounts.py
│   │   ├── transactions.py
│   │   ├── simulations.py
│   │   ├── gamification.py
│   │   └── admin.py
│   ├── services/            # Business logic
│   │   └── plaid_service.py # Plaid mock integration
│   └── ml/                  # ML simulation engine
│       └── simulation_engine.py
└── tests/                   # Test files
```

## Database Models

- **User**: Authentication and profile
- **Account**: Bank accounts (Plaid)
- **Transaction**: Financial transactions
- **Simulation**: AI simulation results
- **Achievement**: Gamification achievements
- **Milestone**: Financial goals

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Current user

### Accounts
- `POST /api/accounts/plaid/link` - Link account
- `GET /api/accounts/` - List accounts
- `GET /api/accounts/networth/calculate` - Net worth

### Simulations
- `POST /api/simulations/` - Create simulation
- `GET /api/simulations/` - List simulations
- `GET /api/simulations/templates/list` - Templates

## Development

### Add New Endpoint

1. Create route file in `app/routes/`
2. Define Pydantic schemas
3. Implement endpoint logic
4. Register router in `main.py`
5. Write tests

### Add New Model

1. Create model in `app/models/`
2. Define SQLAlchemy schema
3. Import in `models/__init__.py`
4. Database will auto-create tables

