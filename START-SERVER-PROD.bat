@echo off
setlocal

set PORT=9200
if not "%~1"=="" set PORT=%~1

echo Building Space Explorer (production)...
npm run build
if errorlevel 1 goto end

echo.
echo Starting production server...
echo Port: %PORT%
echo.
echo Tip: for other devices on the SAME Wi-Fi, open:
echo   http://<your-pc-ip>:%PORT%
echo.

npm start -- -p %PORT% -H 0.0.0.0

:end
pause

