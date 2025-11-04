# 📝 Quick Reference Card - Digital Mirror

## 🚀 Quick Commands

### First Time Setup
```bash
git clone https://github.com/jeremymartinezq/Digital-Mirror-App.git
cd Digital-Mirror-App
cd backend && python -m venv venv && .\venv\Scripts\activate && pip install -r requirements.txt && cd ..
cd frontend\web && npm install && cd ..\..
```

### Daily Launch
```bash
cd Digital-Mirror-App
.\start-all.bat
```

### Stop Servers
- Close terminal windows, or
- Press `Ctrl+C` in each window

---

## 🌐 Important URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:8000 |
| API Docs | http://localhost:8000/api/docs |
| API ReDoc | http://localhost:8000/api/redoc |

---

## 📂 Key Directories

| Path | Contains |
|------|----------|
| `backend/app/routes/` | API endpoints |
| `backend/app/models/` | Database models |
| `backend/app/services/` | Business logic |
| `frontend/web/app/` | Next.js pages |
| `frontend/web/components/` | React components |
| `frontend/web/services/` | API client |

---

## 🔧 Common Tasks

### Create a new branch
```bash
git checkout -b feature/your-feature-name
```

### Pull latest changes
```bash
git pull origin main
```

### Commit changes
```bash
git add .
git commit -m "Description of changes"
git push origin your-branch-name
```

### Activate backend venv
```bash
cd backend
.\venv\Scripts\activate
```

### Run backend manually
```bash
cd backend
.\venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

### Run frontend manually
```bash
cd frontend\web
npm run dev
```

### Install new Python package
```bash
cd backend
.\venv\Scripts\activate
pip install package-name
pip freeze > requirements.txt
```

### Install new npm package
```bash
cd frontend\web
npm install package-name
```

---

## 🐛 Troubleshooting

### Port already in use
```bash
netstat -ano | findstr :3000
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### Backend errors
```bash
cd backend
.\venv\Scripts\activate
pip install -r requirements.txt
```

### Frontend errors
```bash
cd frontend\web
npm install
```

### Hard refresh browser
- Windows: `Ctrl+Shift+R`
- Mac: `Cmd+Shift+R`

### Clear npm cache
```bash
npm cache clean --force
```

---

## 📖 Documentation Files

| File | Purpose |
|------|---------|
| `TEAM_SETUP.md` | **START HERE** - New team member onboarding |
| `GETTING_STARTED.md` | Quick start guide |
| `README.md` | Complete project documentation |
| `FEATURES.md` | Feature reference |
| `RUN_WITHOUT_DOCKER.md` | Local setup details |
| `API_DOCUMENTATION.md` | Backend API reference |
| `CHANGELOG.md` | Version history |

---

## 🧪 Testing

### Run backend tests
```bash
cd backend
.\venv\Scripts\activate
pytest
```

### Run tests with coverage
```bash
pytest --cov=app --cov-report=html
```

---

## 🎨 Frontend Pages

| Route | Page |
|-------|------|
| `/` | Landing page |
| `/login` | Login |
| `/register` | Register |
| `/dashboard` | Dashboard overview |
| `/accounts` | Account management |
| `/transactions` | Transaction history |
| `/simulations` | Financial simulations |
| `/tax-calculator` | Tax calculator |
| `/gamification` | Achievements & goals |
| `/settings` | User settings |

---

## 🔐 API Endpoints (Key)

### Authentication
```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Accounts
```
GET  /api/accounts/
POST /api/accounts/
GET  /api/accounts/networth/calculate
```

### Simulations
```
GET  /api/simulations/
POST /api/simulations/
GET  /api/simulations/templates/list
```

**Full API Docs:** http://localhost:8000/api/docs

---

## 💡 Pro Tips

1. **Use `start-all.bat`** - Easiest way to launch both servers
2. **Auto-reload enabled** - Changes reflect automatically
3. **Check browser console** - F12 to see frontend errors
4. **Check terminal logs** - Backend errors show in terminal
5. **Mock data works** - No database setup needed
6. **Use API docs** - Test endpoints at http://localhost:8000/api/docs
7. **Hard refresh** - Ctrl+Shift+R to clear browser cache
8. **Git pull daily** - Stay updated with team changes

---

## 📞 Need Help?

1. Check `TEAM_SETUP.md` for detailed troubleshooting
2. Ask in team chat/Slack
3. Check API docs: http://localhost:8000/api/docs
4. Review browser console (F12)
5. Check terminal logs for errors

---

## ✅ Quick Health Check

**Is everything working?**

- [ ] `python --version` shows 3.11+
- [ ] `node --version` shows 20+
- [ ] `start-all.bat` runs without errors
- [ ] http://localhost:3000 loads
- [ ] http://localhost:8000/api/docs loads
- [ ] Can register and login
- [ ] All sidebar pages work

**All checked?** You're good to go! 🚀

---

**Keep this handy for quick reference!**

