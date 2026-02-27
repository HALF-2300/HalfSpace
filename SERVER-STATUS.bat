@echo off
echo ============================================================
echo   Space Explorer - Server Status
echo ============================================================
echo.

REM Check if PM2 is installed
where pm2 >nul 2>&1
if errorlevel 1 (
    echo PM2 is not installed.
    echo.
    echo To start the server in background mode, run:
    echo   START-SERVER-BACKGROUND.bat
    echo.
    pause
    exit /b 1
)

npm run pm2:status

echo.
echo ============================================================
echo   Quick Commands:
echo ============================================================
echo   START-SERVER-BACKGROUND.bat  - Start server in background
echo   STOP-SERVER-BACKGROUND.bat   - Stop background server
echo   VIEW-SERVER-LOGS.bat          - View server logs
echo   npm run pm2:restart           - Restart server
echo.
pause
