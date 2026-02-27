@echo off
REM Runs a heavy job and then restarts the dev server
REM Usage: RUN-HEAVY-JOB-AND-RESTART.bat [job-name]
REM Available jobs: build, space-index, media-index, all
REM Default: space-index

set JOB=space-index
if not "%~1"=="" set JOB=%~1

echo ============================================================
echo   Heavy Job Runner ^& Dev Server Restart
echo ============================================================
echo.
echo Running job: %JOB%
echo.

node scripts/run-heavy-job-and-restart.mjs %JOB%

if errorlevel 1 (
    echo.
    echo ❌ Script failed. Check the output above for details.
    pause
    exit /b 1
)
