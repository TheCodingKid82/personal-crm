# Start Zeus Agent
# Run this to boot Zeus with his own OpenClaw instance

$env:OPENCLAW_CONFIG_DIR = "C:\Users\theul\.openclaw-zeus"

Write-Host "⚡ Starting Zeus - CEO of Spark Studio" -ForegroundColor Yellow
Write-Host "Config: $env:OPENCLAW_CONFIG_DIR" -ForegroundColor Gray
Write-Host ""

# Start the gateway
openclaw gateway start

Write-Host ""
Write-Host "⚡ Zeus is online and ready to command." -ForegroundColor Green
