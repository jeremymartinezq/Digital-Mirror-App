@echo off
echo Installing and starting Digital Mirror frontend...
echo.

cd /d "%~dp0"

if not exist "node_modules\next" (
    echo Installing Next.js and dependencies...
    call npm install --legacy-peer-deps
    if errorlevel 1 (
        echo ERROR: npm install failed!
        pause
        exit /b 1
    )
)

echo.
echo Starting Next.js dev server...
echo Frontend will be available at: http://localhost:3000
echo.
call npm run dev

