# Sync Backend Files to XAMPP
# Run this script whenever you make changes to backend files

Write-Host "Syncing backend files to XAMPP..." -ForegroundColor Cyan

$source = ".\backend\*"
$destination = "C:\xampp\htdocs\quiz-api\"

try {
    # Copy all files recursively
    Copy-Item -Path $source -Destination $destination -Recurse -Force
    
    Write-Host "Backend synced successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Files synced to: $destination" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Test API: http://localhost/quiz-api/test-suite.html" -ForegroundColor White
    Write-Host "  2. Or run tests manually in PowerShell" -ForegroundColor White
    
} catch {
    Write-Host "Sync failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
