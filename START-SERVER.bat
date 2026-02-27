@echo off
set PORT=9200
if not "%~1"=="" set PORT=%~1
echo Starting Space Explorer (requested port: %PORT%)...
echo.
echo Please wait while the server starts...
echo.
echo Tip: open the URL printed in the terminal (it may change if the port is in use).
echo.
npm run dev -- --port %PORT%
pause

