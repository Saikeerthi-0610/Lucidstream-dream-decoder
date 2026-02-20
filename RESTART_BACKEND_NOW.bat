@echo off
cls
echo ========================================
echo   RESTARTING DREAM DECODER BACKEND
echo ========================================
echo.

echo [1/3] Stopping old backend processes...
taskkill /F /IM python.exe 2>nul
if %errorlevel% == 0 (
    echo      ✓ Stopped
) else (
    echo      ℹ No processes to stop
)

echo.
echo [2/3] Waiting 2 seconds...
timeout /t 2 /nobreak >nul

echo.
echo [3/3] Starting backend...
cd backend
start "Dream Decoder Backend" cmd /k "python -m uvicorn app.main:app --reload"

echo.
echo ========================================
echo   ✓ BACKEND RESTARTED!
echo ========================================
echo.
echo Check the new window for backend logs.
echo Backend will be at: http://localhost:8000
echo.
echo Press any key to close this window...
pause >nul
