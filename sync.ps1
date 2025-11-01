# Quick Git Sync Script
# Usage: .\sync.ps1 ["optional commit message"]

param(
    [string]$message = "Update: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
)

Write-Host "🔄 Syncing to GitHub..." -ForegroundColor Cyan

# Add all changes
git add .
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to add files" -ForegroundColor Red
    exit 1
}

# Commit with message
git commit -m $message
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Nothing to commit or commit failed" -ForegroundColor Yellow
}

# Push to GitHub
git push
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to push to GitHub" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Successfully synced to GitHub!" -ForegroundColor Green
