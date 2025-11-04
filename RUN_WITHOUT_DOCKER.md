# 🚀 Run Digital Mirror Without Docker

This guide is for running Digital Mirror locally without Docker - perfect for development and team collaboration.

## Prerequisites

**Required:**
- ✅ Python 3.11+ (Check: `python --version`)
- ✅ Node.js 20+ (Check: `node --version`)

**Optional:**
- ⚠️ PostgreSQL 16 (Optional - mock data works without it)
- ⚠️ Redis 7 (Optional - mock data works without it)

**Install if needed:**
- Python: https://www.python.org/downloads/
- Node.js: https://nodejs.org/

---

## 🎯 RECOMMENDED: One-Click Start (No Database Required)

### For Team Members Cloning from GitHub:

#### Step 1: Clone the Repository

```bash
git clone https://github.com/jeremymartinezq/Digital-Mirror-App.git
cd Digital-Mirror-App
```

#### Step 2: One-Time Setup (First Time Only)

**Install Backend Dependencies:**
```powershell
# Navigate to backend folder
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\activate

# Install all Python packages
pip install -r requirements.txt

# Go back to root
cd ..
```

**Install Frontend Dependencies:**
```powershell
# Navigate to frontend folder
cd frontend\web

# Install all Node packages
npm install

# Go back to root
cd ..\..
```

⏱️ **This takes 3-5 minutes total.** You only need to do this once!

#### Step 3: Launch Everything (Every Time After Setup)

```powershell
# From the digital-mirror folder, simply run:
.\start-all.bat
```

**Or double-click:** `start-all.bat` in Windows Explorer

This will:
- ✅ Open 2 terminal windows automatically
- ✅ Launch backend server (http://localhost:8000)
- ✅ Launch frontend server (http://localhost:3000)
- ✅ Use mock data (no database required!)
- ✅ Full simulation features
- ✅ All pages functional

Visit: **http://localhost:3000**

**Note**: The app uses mock data by default, so all features work without setting up PostgreSQL/Redis!

---

## Option 1: Quick Demo (Frontend Only - Minimal Features)

For a minimal demo (UI only, no API):

```powershell
# Terminal 1: Frontend
cd "C:\Users\Jeremy\Desktop\Assignments\Digital Mirror - MVP\digital-mirror\frontend\web"
npm install
npm run dev
```

Visit: **http://localhost:3000**

Note: Only UI will work. For full features, use the One-Click Start method above.

---

## Option 2: Manual Launch (Advanced)

If you prefer to launch servers manually instead of using `start-all.bat`:

### Backend (Terminal 1):

```powershell
cd "C:\Users\Jeremy\Desktop\Assignments\Digital Mirror - MVP\digital-mirror\backend"

# Activate venv and run
.\venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

Backend will be at: **http://localhost:8000**

### Frontend (Terminal 2):

```powershell
cd "C:\Users\Jeremy\Desktop\Assignments\Digital Mirror - MVP\digital-mirror\frontend\web"

# Run frontend
npm run dev
```

Frontend will be at: **http://localhost:3000**

---

## Option 3: Full Setup with Real Database (Optional - Advanced)

**Only needed if you want to connect to a real PostgreSQL/Redis database instead of using mock data.**

### Step 1: Install PostgreSQL

**Option A: Install PostgreSQL**
1. Download: https://www.postgresql.org/download/windows/
2. Install with default settings
3. Remember your password
4. Default port: 5432

**Option B: Use Docker Desktop**
1. Install Docker Desktop: https://www.docker.com/products/docker-desktop
2. Start Docker Desktop
3. Run: `docker run -d --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:16-alpine`
4. Run: `docker run -d --name redis -p 6379:6379 redis:7-alpine`

### Step 2: Configure Backend

Update `start-all.bat` with your database credentials, or set environment variables before running servers:

```powershell
$env:DATABASE_URL="postgresql+asyncpg://postgres:postgres@localhost:5432/digital_mirror"
$env:REDIS_URL="redis://localhost:6379"
$env:SECRET_KEY="dev-secret-key-change-in-production"
```

Then use `start-all.bat` as normal!

---

## Option 4: Use Docker Compose (Easiest if Docker is running)

```powershell
# Start Docker Desktop first!
# Then:
cd "C:\Users\Jeremy\Desktop\Assignments\Digital Mirror - MVP\digital-mirror\infra"
docker compose up -d

# Wait 30 seconds, then visit:
# Frontend: http://localhost:3000
# Backend: http://localhost:8000/api/docs
```

## What You'll See

### Frontend (http://localhost:3000)
- 🏠 **Landing Page**: Beautiful welcome screen with feature highlights
- 🔐 **Auth Pages**: Login/Register with JWT authentication
- 📊 **Dashboard**: Overview with net worth, spending trends, financial health score
- 💰 **Accounts Page**: View all accounts, assets, liabilities, financial health metrics
- 💳 **Transactions Page**: Detailed transaction history with category breakdown and budget tracking
- 🎯 **Simulations Page**: Run 6 types of financial simulations:
  - Savings Goal Calculator
  - Retirement Planning
  - Debt Payoff Strategies
  - Investment Growth Projections
  - Emergency Fund Calculator
  - Home Affordability Calculator
- 🧮 **Tax Calculator**: Quarterly tax estimator for self-employed/freelancers
- 🏆 **Gamification**: Achievements, levels, streaks, and financial milestones
- ⚙️ **Settings**: Profile management, notifications, security, appearance

### Backend (http://localhost:8000/api/docs)
- 📖 Interactive API documentation (Swagger UI)
- 🔧 Test all endpoints directly
- 🎮 Try simulations via API
- 📊 View data models and schemas
- 🔐 Authentication flows

## Quick Test

1. **Register Account**: http://localhost:3000/register
2. **Login**: Use your new credentials
3. **View Dashboard**: See financial overview with mock data
4. **Browse Pages**: Explore all sidebar pages (Accounts, Transactions, etc.)
5. **Run Simulation**: Click "New Simulation" and try different scenarios
6. **Check Tax Calculator**: Calculate quarterly taxes
7. **View Achievements**: Check your gamification progress
8. **Test API**: http://localhost:8000/api/docs

## Troubleshooting

### "Module not found" errors (Backend)
```powershell
pip install -r requirements.txt
```

### "Package not found" errors (Frontend)
```powershell
npm install
```

### Port already in use
```powershell
# Check what's using port 8000
netstat -ano | findstr :8000

# Kill process (replace PID)
taskkill /PID <PID> /F
```

### Database connection error
- Make sure PostgreSQL is running
- Check the DATABASE_URL is correct
- Verify port 5432 is accessible

## Need Help?

1. **Docker Issues**: Start Docker Desktop first
2. **Database Issues**: Install PostgreSQL or use Docker
3. **Node Issues**: Install Node.js 20+ from nodejs.org
4. **Python Issues**: Ensure Python 3.11+ is installed

## Recommended: Install Docker Desktop

For the best experience:
1. Download: https://www.docker.com/products/docker-desktop
2. Install and start Docker Desktop
3. Run: `start.bat` in the digital-mirror folder
4. Everything will start automatically!

---

**Choose the option that works best for you! 🚀**

