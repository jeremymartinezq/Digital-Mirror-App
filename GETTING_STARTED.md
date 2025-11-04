# 🚀 Getting Started with Digital Mirror

Welcome to Digital Mirror! This guide will get you up and running in minutes.

---

## 📥 First Time Setup (Team Members)

If you're cloning this repo for the first time:

### Step 1: Clone the Repository

```bash
git clone https://github.com/jeremymartinezq/Digital-Mirror-App.git
cd Digital-Mirror-App
```

### Step 2: Verify Prerequisites

**Check Python (need 3.11+):**
```powershell
python --version
# Should show Python 3.11 or higher
```

**Check Node.js (need 20+):**
```powershell
node --version
# Should show v20.x or higher
```

**If you need to install:**
- Python: https://www.python.org/downloads/
- Node.js: https://nodejs.org/

### Step 3: Install Dependencies

**Backend Dependencies:**
```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

**Frontend Dependencies:**
```powershell
cd frontend\web
npm install
cd ..\..
```

⏱️ **This takes 3-5 minutes** (only needed once!)

### Step 4: Launch Everything

```powershell
# From the digital-mirror folder:
.\start-all.bat
```

**That's it!** Two terminal windows will open automatically:
- 🌐 Frontend: http://localhost:3000 ✅
- 🔧 Backend: http://localhost:8000 ✅
- 📖 API Docs: http://localhost:8000/api/docs ✅

---

## ⚡ Quick Start (After Initial Setup)

**Already installed dependencies?** Just run:

```powershell
cd Digital-Mirror-App
.\start-all.bat
```

Done! Both servers launch automatically.

---

## 📚 Documentation Guide

### Essential Reading
1. **GETTING_STARTED.md** (this file) - Quick setup
2. **README.md** - Full project documentation
3. **FEATURES.md** - Complete feature list and details
4. **RUN_WITHOUT_DOCKER.md** - Detailed setup options

### Reference Documents
- **CHANGELOG.md** - Version history and updates
- **API_DOCUMENTATION.md** - Backend API reference
- **DEPLOYMENT.md** - Production deployment guide
- **STRUCTURE.md** - Project structure overview

### Quick Reference
- **QUICKSTART.md** - Ultra-fast setup guide
- **WELCOME.md** - Project introduction
- **PROJECT_SUMMARY.md** - Executive summary

---

## 🎯 First Steps After Launch

### 1. Register an Account
Visit http://localhost:3000/register
- Create your account
- Login automatically redirects to dashboard

### 2. Explore the Dashboard
Navigate to http://localhost:3000/dashboard
- View net worth overview
- Check spending trends
- See financial health score
- Review active goals

### 3. Try All Features

**View Your Accounts** (`/accounts`)
- 5 demo accounts with $215K+ net worth
- Financial health score: 79/100
- Account allocation chart
- Insights and recommendations

**Browse Transactions** (`/transactions`)
- 30+ demo transactions
- Spending by category
- Budget tracker
- Monthly spending analysis

**Run Simulations** (`/simulations`)
Try these simulation types:
1. **Savings Goal** - Calculate savings timeline
2. **Retirement Planning** - Project portfolio growth
3. **Debt Payoff** - Optimize debt repayment
4. **Investment Growth** - Model investment returns
5. **Emergency Fund** - Calculate fund requirements
6. **Home Affordability** - Determine max home price

**Calculate Taxes** (`/tax-calculator`)
- Input multiple income sources
- Track deductions
- Calculate federal, state, self-employment tax
- View quarterly payment schedule

**Check Achievements** (`/gamification`)
- Current Level: 5
- Achievements: 4/8 unlocked
- Daily Streak: 14 days
- Daily Goals: Task-based rewards

**Manage Settings** (`/settings`)
- Update profile information
- Configure notifications
- Change security settings
- Customize appearance

---

## 🔧 Backend API

### Access API Documentation
Visit: http://localhost:8000/api/docs

### Quick API Test

**1. Register via API:**
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "full_name": "Test User",
    "password": "secure_password123"
  }'
```

**2. Login and Get Token:**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=testuser&password=secure_password123"
```

**3. Use Token for Authenticated Requests:**
```bash
curl http://localhost:8000/api/accounts/ \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🎨 UI Overview

### Color Scheme
- **Primary**: Slate gray background
- **Accents**: Purple, blue, pink gradients
- **Mode**: Dark mode (default)
- **Typography**: System fonts with clear hierarchy

### Navigation
**Sidebar Pages:**
1. 🏠 Dashboard - Financial overview
2. 🏦 Accounts - Account management
3. 💳 Transactions - Transaction history
4. ✨ Simulations - What-if scenarios
5. 🧮 Tax Calculator - Quarterly taxes
6. 🏆 Gamification - Achievements & goals
7. ⚙️ Settings - User preferences

### Interactive Elements
- Hover effects on cards and buttons
- Smooth transitions
- Progress bars with animations
- Modal dialogs for forms
- Toast notifications for feedback

---

## 💡 Tips & Tricks

### Development Tips
1. **Auto-reload**: Both servers watch for file changes
2. **Mock Data**: Frontend uses mock data by default (no database needed)
3. **API Testing**: Use Swagger UI at http://localhost:8000/api/docs
4. **Console Logs**: Check browser console for simulation debugging

### Keyboard Shortcuts
- `Ctrl+C` in terminal windows to stop servers
- `F5` to refresh frontend
- `Ctrl+Shift+I` to open browser DevTools

### Common Tasks

**Stop Servers:**
- Close the terminal windows, or
- Press `Ctrl+C` in each terminal

**Restart Servers:**
- Run `start-all.bat` again

**Clear Cache:**
```powershell
# Frontend
cd frontend\web
npm run build

# Backend (restart server)
```

**View Logs:**
- Backend: Check the backend terminal window
- Frontend: Check the frontend terminal window
- Browser: Open DevTools console (F12)

---

## 🐛 Troubleshooting

### Port Already in Use
```powershell
# Check what's using ports 3000 or 8000
netstat -ano | findstr ":3000 :8000"

# Kill process (replace PID with actual number)
taskkill /PID <PID> /F
```

### Backend Not Starting
1. Ensure virtual environment is activated
2. Check Python version: `python --version` (need 3.11+)
3. Reinstall dependencies: `pip install -r requirements.txt`

### Frontend Not Starting
1. Check Node version: `node --version` (need 20+)
2. Clear node_modules: `rm -rf node_modules && npm install`
3. Clear cache: `npm cache clean --force`

### Database Errors (Optional)
- **No problem!** App works with mock data
- To use real database, see `RUN_WITHOUT_DOCKER.md`

### Module Not Found
```powershell
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd frontend\web
npm install
```

---

## 📊 Demo Data

### Accounts (Total: $215,379.75 net worth)
- Chase Checking: $15,420.50
- High-Yield Savings: $45,800.00
- Vanguard 401(k): $125,000.00
- Chase Sapphire Reserve: -$2,340.75 (credit)
- Robinhood Investment: $28,500.00

### Transactions (30+ entries)
- Last 30 days of activity
- Multiple categories (housing, food, shopping, etc.)
- Income and expenses
- Realistic amounts and descriptions

### User Profile
- Level: 5 (475/500 XP)
- Achievements: 4 unlocked, 4 locked
- Streak: 14 days
- Rank: Silver

---

## 🎯 Next Steps

### For Demo/Presentation
1. ✅ Launch servers (`start-all.bat`)
2. ✅ Register account
3. ✅ Explore all 9 pages
4. ✅ Run multiple simulations
5. ✅ Show tax calculator
6. ✅ Display achievements
7. ✅ Demonstrate API docs

### For Development
1. 📖 Read `README.md` for architecture details
2. 📖 Review `FEATURES.md` for complete feature list
3. 🔧 Set up PostgreSQL (optional)
4. 🔧 Configure real Plaid API
5. 🧪 Write additional tests
6. 🚀 Deploy to production (see `DEPLOYMENT.md`)

### For Production
1. Set up PostgreSQL and Redis
2. Configure environment variables
3. Enable HTTPS
4. Set up monitoring
5. Configure backups
6. Deploy with Docker/Kubernetes
7. See `DEPLOYMENT.md` for details

---

## 📞 Support

### Common Questions

**Q: Do I need PostgreSQL/Redis?**
A: No! App works fully with mock data.

**Q: Can I use the real database?**
A: Yes! See `RUN_WITHOUT_DOCKER.md` for setup.

**Q: How do I deploy to production?**
A: See `DEPLOYMENT.md` for full guide.

**Q: Where are the API docs?**
A: http://localhost:8000/api/docs (after starting backend)

**Q: Is this production-ready?**
A: This is an MVP. See "Future Enhancements" in README.md.

### Getting Help
1. Check `README.md` for detailed documentation
2. Review `TROUBLESHOOTING` section above
3. Check API docs at http://localhost:8000/api/docs
4. Review browser console for errors
5. Check terminal logs for backend errors

---

## ✅ Quick Checklist

- [ ] Python 3.11+ installed
- [ ] Node.js 20+ installed
- [ ] Dependencies installed (`pip install`, `npm install`)
- [ ] `start-all.bat` runs successfully
- [ ] Backend accessible at http://localhost:8000
- [ ] Frontend accessible at http://localhost:3000
- [ ] Can register and login
- [ ] All 9 pages working
- [ ] Simulations calculating correctly
- [ ] API docs accessible

---

## 🎉 You're Ready!

Digital Mirror is now running. Enjoy exploring all the features!

**Key URLs:**
- 🌐 Frontend: http://localhost:3000
- 🔧 Backend: http://localhost:8000
- 📖 API Docs: http://localhost:8000/api/docs

**Happy simulating! 💰📊✨**

---

*For more information, see the other documentation files in this folder.*

