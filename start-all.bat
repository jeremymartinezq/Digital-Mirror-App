@echo off
REM ============================================================
REM Digital Mirror - Start All Services (Without Docker)
REM ============================================================
REM 
REM For Team Members:
REM   - First time? See TEAM_SETUP.md for installation steps
REM   - Already setup? Just double-click this file!
REM
REM What this does:
REM   1. Launches backend server (FastAPI) in new window
REM   2. Launches frontend server (Next.js) in new window
REM   3. Both servers auto-reload on file changes
REM
REM Troubleshooting:
REM   - Port already in use? Run: netstat -ano | findstr ":3000 :8000"
REM   - Backend errors? Check backend terminal window
REM   - Frontend errors? Check frontend terminal and browser console (F12)
REM   - Need help? See TEAM_SETUP.md or ask the team!
REM
REM ============================================================

echo 🪞 Digital Mirror - Starting All Services...
echo.

REM Get the directory where this batch file is located
set "ROOT_DIR=%~dp0"

REM Start Backend in a new window
echo 🔧 Starting Backend Server...
start "Digital Mirror - Backend" cmd /k "cd /d "%ROOT_DIR%backend" && set DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/digital_mirror && set REDIS_URL=redis://localhost:6379 && set SECRET_KEY=dev-secret-key-change-in-production && venv\Scripts\python.exe -m uvicorn app.main:app --reload"

REM Wait a moment before starting frontend
timeout /t 2 /nobreak >nul

REM Start Frontend in a new window
echo 🎨 Starting Frontend Server...
start "Digital Mirror - Frontend" cmd /k "cd /d "%ROOT_DIR%frontend\web" && set NEXT_PUBLIC_API_URL=http://localhost:8000 && npm run dev"

echo.
echo ✅ Services are starting in separate windows!
echo.
echo 📍 Access Points:
echo    - Frontend:  http://localhost:3000
echo    - Backend:   http://localhost:8000
echo    - API Docs:  http://localhost:8000/api/docs
echo.
echo 💡 Tips:
echo    - Both servers auto-reload when you save files
echo    - Press Ctrl+C in terminal windows to stop servers
echo    - Hard refresh browser: Ctrl+Shift+R
echo    - Check browser console (F12) for frontend errors
echo.
echo 📖 Documentation:
echo    - New to the project? See TEAM_SETUP.md
echo    - Quick reference: See QUICK_REFERENCE.md
echo    - Full docs: See README.md
echo.
pause

