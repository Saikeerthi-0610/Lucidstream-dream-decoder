@echo off
echo Stopping backend...
taskkill /F /IM python.exe /FI "WINDOWTITLE eq *uvicorn*" 2>nul

echo.
echo Starting backend...
cd backend
start "Dream Decoder Backend" cmd /k "python -m uvicorn app.main:app --reload"

echo.
echo Backend restarted!
echo Check the new window for backend logs.
pause
