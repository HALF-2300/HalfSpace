@echo off
echo ============================================================
echo   Stopping Space Explorer Background Server
echo ============================================================
echo.

REM Check if PM2 is installed
where pm2 >nul 2>&1
if errorlevel 1 (
    echo PM2 is not installed. Nothing to stop.
    pause
    exit /b 0
)

npm run pm2:stop

if errorlevel 1 (
    echo.
    echo ⚠️  Server may not be running, or PM2 encountered an error.
) else (
    echo.
    echo ✅ Server stopped successfully!
)

echo.
pause
