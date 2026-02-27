@echo off
setlocal

set PORT=9200
if not "%~1"=="" set PORT=%~1

for /f %%I in ('powershell -NoProfile -Command "$ip=(Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue | Where-Object { $_.IPAddress -notlike '169.254*' -and $_.IPAddress -ne '127.0.0.1' } | Select-Object -First 1 -ExpandProperty IPAddress); if($ip){$ip}else{'localhost'}"') do set LAN_IP=%%I

echo Starting Space Explorer (LAN accessible)...
echo Port: %PORT%
echo.
echo If you open from another device on the SAME Wi-Fi, use:
echo   http://%LAN_IP%:%PORT%
echo.
echo Note: Windows Firewall may prompt you the first time. Allow access on Private networks.
echo.

npm run dev -- --port %PORT% --hostname 0.0.0.0
pause

