@echo off
setlocal

echo ============================================================
echo   Space Explorer - Background Server (PM2)
echo ============================================================
echo.

REM Check if PM2 is installed
where pm2 >nul 2>&1
if errorlevel 1 (
    echo PM2 is not installed. Installing PM2 globally...
    echo.
    npm install -g pm2
    if errorlevel 1 (
        echo.
        echo ❌ Failed to install PM2. Please install it manually:
        echo    npm install -g pm2
        echo.
        pause
        exit /b 1
    )
    echo.
    echo ✅ PM2 installed successfully!
    echo.
)

REM Create logs directory if it doesn't exist
if not exist "logs" mkdir logs

echo Starting Space Explorer in background mode...
echo.
echo The server will run in the background and stay running even if you:
echo   - Close this terminal window
echo   - Close your laptop lid
echo   - Log out of Windows
echo.
echo To stop the server, run: STOP-SERVER-BACKGROUND.bat
echo To view logs, run: VIEW-SERVER-LOGS.bat
echo To check status, run: npm run pm2:status
echo.

npm run pm2:start

if errorlevel 1 (
    echo.
    echo ❌ Failed to start server. Check the output above for details.
    pause
    exit /b 1
)

echo.
echo ✅ Server started in background!
echo.
echo The server should be available at: http://localhost:9200
echo (Check the logs if the port is different)
echo.
timeout /t 3 >nul

REM Show status
npm run pm2:status

echo.
echo ============================================================
echo   Server is running in the background!
echo ============================================================
echo.
pause
