# Restart Backend Script
Write-Host "🛑 Stopping backend..." -ForegroundColor Yellow

# Find and kill Python processes running uvicorn
Get-Process python -ErrorAction SilentlyContinue | Where-Object {
    $_.MainWindowTitle -like "*uvicorn*" -or 
    $_.CommandLine -like "*uvicorn*"
} | Stop-Process -Force

Start-Sleep -Seconds 2

Write-Host "✅ Backend stopped" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Starting backend..." -ForegroundColor Cyan

# Start backend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; python -m uvicorn app.main:app --reload"

Write-Host "✅ Backend started in new window!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Check the new PowerShell window for backend logs" -ForegroundColor Yellow
Write-Host "🌐 Backend will be available at: http://localhost:8000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
