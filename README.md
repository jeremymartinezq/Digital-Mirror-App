# 🪞 Digital Mirror - Financial Decision Simulation Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109.0-green.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.1.0-black.svg)](https://nextjs.org/)

**Digital Mirror** is an AI-powered financial decision simulation platform that helps users visualize the impact of life decisions before making them. Run "what-if" scenarios for purchases, loans, career changes, investments, and more with predictive ML models.

## 📌 Overview

- **Smart Dashboards**: Track spending, net worth, and budgets with interactive charts
- **AI Simulations**: Run ML-powered financial predictions for various life scenarios
- **Gamification**: Progress milestones, achievements, and financial literacy badges
- **Security**: JWT authentication, role-based access, end-to-end encryption ready
- **Scalable**: Dockerized, Kubernetes-ready, AWS deployment configurations
- **Future Bank Integration**: V2 will connect accounts via Plaid API (mock implementation only for MVP)

## 🏗️ Architecture

### Technology Stack

**Backend:**
- FastAPI (Python) - RESTful API
- PostgreSQL - Primary database
- Redis - Session management & caching
- SQLAlchemy (async) - ORM
- Scikit-learn - ML simulations

**Frontend:**
- Next.js 14 (React) - Web application
- TailwindCSS - Styling
- Recharts - Data visualization
- Axios - API client

**Mobile:**
- React Native (Expo) - Mobile app stub

**Infrastructure:**
- Docker & Docker Compose
- Kubernetes (AWS EKS)
- Terraform (IaC)
- AWS RDS, ElastiCache, S3

## 🚀 Quick Start

### Prerequisites

- **Python 3.11+**
- **Node.js 20+**
- **Docker & Docker Compose** (optional)

### Option 1: One-Click Start (Windows - Easiest!)

**No Docker or database setup required! Uses mock data for full functionality.**

#### For Team Members Cloning the Repo:

```bash
# 1. Clone the repository
git clone https://github.com/jeremymartinezq/Digital-Mirror-App.git
cd Digital-Mirror-App

# 2. Verify prerequisites (one-time check)
python --version  # Need 3.11+
node --version    # Need 20+

# 3. Install backend dependencies (one-time setup)
cd backend
python -m venv venv
venv\Scripts\activate  # On Windows: venv\Scripts\activate
                       # On Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
cd ..

# 4. Install frontend dependencies (one-time setup)
cd frontend\web
npm install
cd ..\..

# 5. Launch everything with one command!
start-all.bat  # Windows: Double-click or run from terminal
               # Mac/Linux: See "Manual Launch" section below

# Services will be available at:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:8000
# - API Docs: http://localhost:8000/api/docs
```

**🎉 That's it!** Steps 3-4 are one-time only. After initial setup, just run `start-all.bat` to launch both servers.

#### Every Day After Initial Setup:

```bash
cd digital-mirror
start-all.bat  # That's all you need!
```

**Note:** The app uses mock data, so all features work without PostgreSQL/Redis setup.

### Option 2: Docker Compose (For Real Database)

For production-like environment with real database:

```bash
# Clone the repository
git clone https://github.com/jeremymartinezq/Digital-Mirror-App.git
cd Digital-Mirror-App

# Start all services
cd infra
docker-compose up -d

# Services will be available at:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:8000
# - API Docs: http://localhost:8000/api/docs
# - PgAdmin: http://localhost:5050 (optional)
```

### Option 3: Local Development (Manual Launch)

**🚀 Quick Start (Windows):**

```bash
# Double-click start-all.bat or run from terminal:
cd digital-mirror
.\start-all.bat
```

This will automatically:
- Launch the backend server in a new window (http://localhost:8000)
- Launch the frontend server in a new window (http://localhost:3000)
- Display all access points

**💡 Note**: Make sure you've completed the initial setup below first!

#### Initial Setup (One-Time Only)

**Backend Setup:**

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Dependencies are now installed! Use start-all.bat to launch servers.
```

**Frontend Setup:**

```bash
cd frontend/web

# Install dependencies
npm install

# Dependencies are now installed! Use start-all.bat to launch servers.
```

#### Manual Launch (Alternative)

If you prefer to run servers manually:

**Terminal 1 (Backend):**
```bash
cd backend
venv\Scripts\python.exe -m uvicorn app.main:app --reload
# API will be available at http://localhost:8000
# Interactive docs at http://localhost:8000/api/docs
```

**Terminal 2 (Frontend):**
```bash
cd frontend/web
npm run dev
# Application will be available at http://localhost:3000
```

#### Mobile App (Optional)

```bash
cd frontend/mobile

# Install dependencies
npm install

# Start Expo
npm start

# Scan QR code with Expo Go app on your phone
```

## 📂 Project Structure

```
digital-mirror/
├── backend/                    # FastAPI Backend
│   ├── app/
│   │   ├── main.py            # Application entry point
│   │   ├── db.py              # Database configuration
│   │   ├── auth/              # Authentication & security
│   │   ├── models/            # SQLAlchemy models
│   │   ├── routes/            # API endpoints
│   │   ├── services/          # Business logic (Plaid, etc.)
│   │   └── ml/                # ML simulation engine
│   ├── tests/                 # Unit & integration tests
│   ├── requirements.txt       # Python dependencies
│   └── Dockerfile            # Backend container
│
├── frontend/
│   ├── web/                   # Next.js Web App
│   │   ├── app/              # Next.js 14 app directory
│   │   ├── components/       # React components
│   │   ├── services/         # API client
│   │   ├── package.json
│   │   └── Dockerfile
│   └── mobile/               # React Native App (stub)
│       ├── App.tsx
│       └── package.json
│
├── infra/                     # Infrastructure
│   ├── docker-compose.yml    # Local development
│   ├── k8s/                  # Kubernetes manifests
│   │   ├── namespace.yaml
│   │   ├── backend-deployment.yaml
│   │   ├── frontend-deployment.yaml
│   │   ├── postgres-deployment.yaml
│   │   ├── redis-deployment.yaml
│   │   └── ingress.yaml
│   └── terraform/            # AWS infrastructure
│       ├── main.tf
│       └── variables.tf
│
└── README.md
```

## 🔑 Key Features

### 1. User Authentication
- JWT-based authentication
- Password hashing (bcrypt)
- Role-based access control (Basic, Premium, Admin)
- Secure session management

### 2. Bank Account Integration
- Plaid API integration (mock for MVP)
- Multiple account types (checking, savings, credit, loans, investments)
- Automatic transaction syncing
- Balance tracking
- **Accounts Dashboard**: Visual overview of all accounts, allocation charts, financial health score

### 3. Financial Dashboards
- **Main Dashboard**: Net worth overview, spending trends, financial goals, quick actions
- **Accounts Page**: Assets, liabilities, net worth, account allocation, health metrics
- **Transactions Page**: Detailed transaction history with 30+ demo transactions
- Monthly spending breakdown by category
- Budget tracker with progress bars
- Interactive charts (Recharts)
- Spending insights and recommendations

### 4. AI Simulation Engine
Run 6 types of predictive simulations:
- **Savings Goal**: Calculate monthly contributions and timeline
- **Retirement Planning**: Project portfolio growth with compound interest
- **Debt Payoff**: Optimize repayment schedules and calculate interest savings
- **Investment Growth**: Model portfolio growth with contributions
- **Emergency Fund**: Calculate required fund size based on expenses
- **Home Affordability**: Determine maximum home price and monthly payments

All simulations use accurate financial formulas with edge case handling.

### 5. Tax Calculator
- **Quarterly Tax Estimator**: For self-employed and freelancers
- Multiple income sources (W-2, 1099, business, investment)
- Deductions tracking (standard vs itemized)
- Federal, state, and self-employment tax calculations
- Quarterly payment schedule with due dates
- Annual tax estimate

### 6. Gamification
- **Achievement System**: 8+ unlockable badges
- **Level Progression**: XP-based leveling (Level 1-10)
- **Daily Streaks**: Track consecutive login days
- **Financial Milestones**: Net worth, savings, spending goals
- **Daily Goals**: Task-based rewards system
- Leaderboard and ranking

### 7. Settings & Profile Management
- **Profile Settings**: Name, email, phone, bio
- **Notifications**: Email, push, SMS preferences
- **Security**: Password change, 2FA (planned), session management
- **Appearance**: Theme selection (dark mode, system auto)
- **Account Management**: Danger zone for account deletion

### 8. Admin Panel (Backend)
- User management
- System statistics
- Role assignment
- Activity monitoring

## 🔐 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: Bcrypt with salt
- **Role-Based Access**: Granular permissions
- **Input Validation**: Pydantic models
- **SQL Injection Protection**: SQLAlchemy ORM
- **CORS Configuration**: Controlled origins
- **HTTPS Ready**: TLS/SSL support
- **Data Encryption**: Ready for end-to-end encryption

## 📊 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc

### Example API Endpoints

**Authentication:**
```
POST /api/auth/register     - Register new user
POST /api/auth/login        - Login and get JWT token
GET  /api/auth/me          - Get current user info
```

**Accounts:**
```
POST /api/accounts/plaid/link     - Link bank account
GET  /api/accounts/               - Get all accounts
GET  /api/accounts/networth/calculate - Calculate net worth
```

**Simulations:**
```
POST /api/simulations/           - Create new simulation
GET  /api/simulations/           - List user's simulations
GET  /api/simulations/{id}       - Get simulation details
GET  /api/simulations/templates/list - Get available templates
```

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_auth.py
```

### Frontend Tests

```bash
cd frontend/web

# Run tests (if configured)
npm test
```

## 🚢 Deployment

### Docker Build

```bash
# Build backend
cd backend
docker build -t digital-mirror-backend:latest .

# Build frontend
cd frontend/web
docker build -t digital-mirror-frontend:latest .
```

### Kubernetes Deployment

```bash
cd infra/k8s

# Create namespace
kubectl apply -f namespace.yaml

# Deploy database & cache
kubectl apply -f postgres-deployment.yaml
kubectl apply -f redis-deployment.yaml

# Deploy application
kubectl apply -f backend-deployment.yaml
kubectl apply -f frontend-deployment.yaml

# Configure ingress
kubectl apply -f ingress.yaml

# Check status
kubectl get pods -n digital-mirror
```

### AWS Deployment (Terraform)

```bash
cd infra/terraform

# Initialize Terraform
terraform init

# Plan deployment
terraform plan

# Apply infrastructure
terraform apply

# Get outputs
terraform output
```

## 🔧 Configuration

### Backend Environment Variables

```env
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/digital_mirror
REDIS_URL=redis://localhost:6379
SECRET_KEY=your-secret-key-change-in-production
CORS_ORIGINS=http://localhost:3000
PLAID_CLIENT_ID=your_plaid_client_id
PLAID_SECRET=your_plaid_secret
```

### Frontend Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📈 ML Simulation Models

The simulation engine uses:
- **Rule-based models**: For quick, accurate financial calculations
- **Statistical methods**: Time-series projections
- **Scikit-learn**: For future ML enhancements
- **Extensible architecture**: Ready for PyTorch/TensorFlow models

### Simulation Types

1. **Purchase Simulation**: Cash vs financing analysis
2. **Loan Simulation**: Amortization schedules, early payoff
3. **Career Change**: Income transition modeling
4. **Investment Growth**: Compound interest projections
5. **Debt Repayment**: Avalanche vs snowball strategies

## 🤝 Contributing

This is an MVP/prototype. For production:

1. Implement real Plaid API integration
2. Add comprehensive test coverage
3. Implement advanced ML models (LSTM, etc.)
4. Add mobile app features
5. Implement data encryption
6. Add monitoring & logging (Prometheus, Grafana)
7. Set up CI/CD pipelines

## 📄 License

MIT License - see LICENSE file for details

## 🔮 Future Enhancements

### ✅ Completed in MVP
- [x] Tax optimization simulations (Quarterly Tax Calculator)
- [x] Retirement planning calculator (Retirement Simulation)
- [x] Gamification with achievements and levels
- [x] Comprehensive financial dashboards
- [x] Multiple simulation types (6 total)

### 🚧 Planned
- [ ] Real-time collaboration features
- [ ] Advanced ML models (LSTM for time-series predictions)
- [ ] Mobile push notifications
- [ ] Credit score impact predictions
- [ ] Multi-currency support
- [ ] Social features (share simulations with friends)
- [ ] Financial advisor chat (AI-powered)
- [ ] Automated investment recommendations
- [ ] Real Plaid API integration (currently mock)
- [ ] 2FA implementation (planned in Security settings)

## 👥 Team Collaboration

### For New Team Members

**First time cloning the repo?** See `TEAM_SETUP.md` for complete onboarding instructions.

**Quick start:**
```bash
# 1. Clone repo
git clone https://github.com/jeremymartinezq/Digital-Mirror-App.git
cd Digital-Mirror-App

# 2. Install dependencies (one-time)
cd backend && python -m venv venv && .\venv\Scripts\activate && pip install -r requirements.txt && cd ..
cd frontend\web && npm install && cd ..\..

# 3. Launch (every time)
.\start-all.bat
```

### Development Workflow

**Daily routine:**
```bash
# Pull latest changes
git pull origin main

# Launch servers
.\start-all.bat

# Make your changes...
# Both servers auto-reload on save!

# Commit and push
git add .
git commit -m "Your descriptive message"
git push origin your-branch-name
```

### Branch Strategy

- `main` - Production-ready code
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates

### Before Submitting PR

- [ ] Code runs without errors
- [ ] All pages load correctly
- [ ] No console errors (F12)
- [ ] Backend tests pass (`pytest`)
- [ ] Code is formatted
- [ ] Documentation updated if needed

## 📞 Support

**For Team Members:**
- `TEAM_SETUP.md` - Complete onboarding guide
- `GETTING_STARTED.md` - Quick start instructions
- `FEATURES.md` - Feature reference
- Team chat/Slack - Ask questions anytime!

**For Issues:**
- GitHub Issues: [Create an issue](https://github.com/jeremymartinezq/Digital-Mirror-App/issues)
- Documentation: See documentation files in root folder
- API Docs: http://localhost:8000/api/docs (when running)

## 🙏 Acknowledgments

Built with:
- [FastAPI](https://fastapi.tiangolo.com/)
- [Next.js](https://nextjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)
- [Plaid](https://plaid.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)

---

**Made with ❤️ for better financial decisions**

