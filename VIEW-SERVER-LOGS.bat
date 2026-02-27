@echo off
echo ============================================================
echo   Space Explorer - Server Logs
echo ============================================================
echo.
echo Press Ctrl+C to exit log viewer
echo.

REM Check if PM2 is installed
where pm2 >nul 2>&1
if errorlevel 1 (
    echo PM2 is not installed. Cannot view logs.
    pause
    exit /b 1
)

npm run pm2:logs
