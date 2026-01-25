# Spark Command Center Launcher
Write-Host "⚡ Starting Spark Command Center..." -ForegroundColor Cyan
Write-Host ""
Write-Host "Dashboard will be available at: " -NoNewline
Write-Host "http://localhost:3000" -ForegroundColor Green
Write-Host ""

# Try to use serve, fallback to python
if (Get-Command npx -ErrorAction SilentlyContinue) {
    npx serve . -p 3000
} elseif (Get-Command python -ErrorAction SilentlyContinue) {
    python -m http.server 3000
} else {
    Write-Host "Please install Node.js (npx serve) or Python to run the server" -ForegroundColor Red
    Write-Host "Or just open index.html directly in your browser"
    pause
}
