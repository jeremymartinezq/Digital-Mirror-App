# 👥 Team Setup Guide - Digital Mirror

Welcome to the team! This guide will get you up and running with the Digital Mirror project in under 10 minutes.

---

## 📋 Quick Checklist

Before you start, make sure you have:
- [ ] Git installed
- [ ] Python 3.11 or higher
- [ ] Node.js 20 or higher
- [ ] A code editor (VS Code recommended)
- [ ] GitHub access to the repository

---

## 🚀 Complete Setup Process

### Step 1: Clone the Repository

```bash
# Clone the repo
git clone https://github.com/jeremymartinezq/Digital-Mirror-App.git

# Navigate into the project
cd Digital-Mirror-App
```

**✅ Checkpoint:** You should now have the `Digital-Mirror-App` folder on your machine.

---

### Step 2: Verify Your Environment

**Check Python Version:**
```powershell
python --version
```
✅ **Should show:** Python 3.11.x or Python 3.12.x (or higher)

❌ **If not installed:** Download from https://www.python.org/downloads/

**Check Node.js Version:**
```powershell
node --version
```
✅ **Should show:** v20.x.x or higher

❌ **If not installed:** Download from https://nodejs.org/

---

### Step 3: Install Backend Dependencies

```powershell
# Navigate to backend folder
cd backend

# Create a Python virtual environment
python -m venv venv

# Activate the virtual environment
.\venv\Scripts\activate
# You should see (venv) appear in your terminal prompt

# Install all required Python packages
pip install -r requirements.txt
# This takes 1-2 minutes

# Navigate back to root
cd ..
```

**✅ Checkpoint:** You should see "Successfully installed" messages for packages like fastapi, uvicorn, sqlalchemy, etc.

**Troubleshooting:**
- If `python` command not found, try `python3`
- If activation fails, you might need to run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

---

### Step 4: Install Frontend Dependencies

```powershell
# Navigate to frontend web folder
cd frontend\web

# Install all required Node packages
npm install
# This takes 2-3 minutes

# Navigate back to root
cd ..\..
```

**✅ Checkpoint:** You should see `node_modules` folder created in `frontend/web` with 1000+ packages installed.

**Troubleshooting:**
- If `npm` command not found, reinstall Node.js
- If installation hangs, try: `npm cache clean --force` then retry

---

### Step 5: Launch the Application

```powershell
# From the digital-mirror root folder:
.\start-all.bat
```

**What happens:**
1. Two new terminal windows will open automatically
2. One window runs the backend server (FastAPI)
3. One window runs the frontend server (Next.js)
4. Both will compile and start (takes 20-30 seconds)

**✅ Checkpoint:** You should see:
- Backend window: "Uvicorn running on http://127.0.0.1:8000"
- Frontend window: "Local: http://localhost:3000"

---

### Step 6: Verify Everything Works

**Open your browser and visit:**

1. **Frontend:** http://localhost:3000
   - You should see the Digital Mirror landing page
   
2. **Backend API Docs:** http://localhost:8000/api/docs
   - You should see Swagger UI with API documentation

3. **Register an Account:**
   - Go to http://localhost:3000/register
   - Create a test account
   - Login and explore the dashboard

**✅ Checkpoint:** All URLs load successfully and you can navigate the app.

---

## 🎯 Daily Workflow

After the initial setup, here's your daily routine:

### Starting Work:

```powershell
# 1. Pull latest changes
cd Digital-Mirror-App
git pull origin main

# 2. Launch servers
.\start-all.bat
```

That's it! Both servers start automatically.

### Making Changes:

**Backend Changes:**
- Edit files in `backend/app/`
- Server auto-reloads on save (hot reload enabled)
- Check the backend terminal window for errors

**Frontend Changes:**
- Edit files in `frontend/web/app/` or `frontend/web/components/`
- Browser auto-refreshes on save (hot reload enabled)
- Check the frontend terminal window and browser console for errors

### Stopping Work:

```powershell
# Close both terminal windows, or
# Press Ctrl+C in each terminal window
```

### Committing Changes:

```bash
# Stage your changes
git add .

# Commit with a descriptive message
git commit -m "Add feature: description of what you did"

# Push to your branch
git push origin your-branch-name
```

---

## 📂 Project Structure

Here's what's in the repo:

```
Digital-Mirror-App/
├── backend/                 # FastAPI Backend
│   ├── app/
│   │   ├── routes/         # API endpoints
│   │   ├── models/         # Database models
│   │   ├── services/       # Business logic
│   │   └── auth/           # Authentication
│   ├── requirements.txt    # Python dependencies
│   └── venv/               # Python virtual environment (created by you)
│
├── frontend/
│   └── web/                # Next.js Frontend
│       ├── app/            # Pages (Next.js 14 app directory)
│       ├── components/     # React components
│       ├── services/       # API client
│       └── package.json    # Node dependencies
│
├── start-all.bat           # Launch script (your best friend!)
├── README.md               # Project documentation
├── GETTING_STARTED.md      # Quick start guide
└── TEAM_SETUP.md           # This file!
```

---

## 🔧 Common Issues & Solutions

### Issue: "python: command not found"
**Solution:** 
```powershell
# Try python3 instead
python3 --version

# Or add Python to PATH (reinstall Python and check "Add to PATH")
```

### Issue: "npm: command not found"
**Solution:** 
```powershell
# Reinstall Node.js from nodejs.org
# Restart your terminal after installation
```

### Issue: "Port 3000 already in use"
**Solution:** 
```powershell
# Find what's using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

### Issue: "Port 8000 already in use"
**Solution:** 
```powershell
# Find what's using port 8000
netstat -ano | findstr :8000

# Kill the process
taskkill /PID <PID> /F
```

### Issue: Backend shows "Module not found"
**Solution:** 
```powershell
# Make sure you're in the backend folder
cd backend

# Activate virtual environment
.\venv\Scripts\activate

# Reinstall dependencies
pip install -r requirements.txt
```

### Issue: Frontend won't start
**Solution:** 
```powershell
# Navigate to frontend web folder
cd frontend\web

# Clear node_modules and reinstall
Remove-Item -Recurse -Force node_modules
npm install
```

### Issue: Changes not reflecting in the app
**Solution:** 
```powershell
# Hard refresh browser: Ctrl+Shift+R
# Or clear cache: Ctrl+Shift+Delete

# For backend, restart the server:
# Press Ctrl+C in backend terminal, then run start-all.bat again
```

---

## 🎓 Learning Resources

### Understanding the Stack

**Backend (FastAPI):**
- FastAPI Docs: https://fastapi.tiangolo.com/
- Python Tutorial: https://docs.python.org/3/tutorial/

**Frontend (Next.js/React):**
- Next.js Docs: https://nextjs.org/docs
- React Docs: https://react.dev/

**Database (SQLAlchemy):**
- SQLAlchemy Docs: https://docs.sqlalchemy.org/

### Project-Specific Docs

- `README.md` - Complete project overview
- `FEATURES.md` - All features explained
- `API_DOCUMENTATION.md` - Backend API reference
- API Docs (live): http://localhost:8000/api/docs

---

## 👥 Team Collaboration

### Branch Strategy

```bash
# Create a new branch for your feature
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description

# Make your changes, commit, and push
git add .
git commit -m "Description of changes"
git push origin feature/your-feature-name

# Create a Pull Request on GitHub
```

### Code Review Checklist

Before submitting a PR:
- [ ] Code runs without errors
- [ ] Tested on localhost
- [ ] No console errors in browser (F12)
- [ ] Backend terminal shows no errors
- [ ] Formatted code (prettier/black)
- [ ] Added comments for complex logic
- [ ] Updated documentation if needed

---

## 🆘 Getting Help

### When You're Stuck:

1. **Check the logs:**
   - Backend: Look at the backend terminal window
   - Frontend: Check the frontend terminal and browser console (F12)

2. **Check documentation:**
   - `README.md` - General info
   - `GETTING_STARTED.md` - Setup guide
   - `FEATURES.md` - Feature details
   - API Docs: http://localhost:8000/api/docs

3. **Ask the team:**
   - Post in your team chat
   - Tag someone who worked on that feature
   - Include error messages and screenshots

4. **Common fixes:**
   - Restart servers (Ctrl+C, then `start-all.bat`)
   - Pull latest changes (`git pull`)
   - Clear cache (browser: Ctrl+Shift+R)
   - Reinstall dependencies (`pip install` or `npm install`)

---

## ✅ Setup Verification Checklist

Before you start development, verify:

- [ ] Python 3.11+ is installed (`python --version`)
- [ ] Node.js 20+ is installed (`node --version`)
- [ ] Repository is cloned (`cd digital-mirror`)
- [ ] Backend venv is created (`backend/venv` folder exists)
- [ ] Backend dependencies installed (pip install completed)
- [ ] Frontend node_modules installed (`frontend/web/node_modules` exists)
- [ ] `start-all.bat` runs without errors
- [ ] Backend is accessible at http://localhost:8000
- [ ] Frontend is accessible at http://localhost:3000
- [ ] API docs load at http://localhost:8000/api/docs
- [ ] Can register and login at http://localhost:3000
- [ ] All sidebar pages work (Dashboard, Accounts, Simulations, etc.)

---

## 🎉 You're All Set!

Welcome to the team! You're now ready to start contributing to Digital Mirror.

**Next steps:**
1. Explore the app at http://localhost:3000
2. Read `FEATURES.md` to understand all features
3. Check your assigned tasks/tickets
4. Start coding! 🚀

**Questions?** Don't hesitate to ask the team!

---

**Happy coding! 💻✨**

