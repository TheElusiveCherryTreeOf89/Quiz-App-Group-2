# Complete Backend Setup Script
# This will sync files AND create the database

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Quiz App Backend Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if XAMPP is running
Write-Host "📋 Step 1: Checking XAMPP..." -ForegroundColor Yellow
$apacheRunning = Get-Process -Name "httpd" -ErrorAction SilentlyContinue
$mysqlRunning = Get-Process -Name "mysqld" -ErrorAction SilentlyContinue

if (-not $apacheRunning) {
    Write-Host "❌ Apache is not running!" -ForegroundColor Red
    Write-Host "   Please start Apache in XAMPP Control Panel" -ForegroundColor White
    exit 1
}
Write-Host "✅ Apache is running" -ForegroundColor Green

if (-not $mysqlRunning) {
    Write-Host "❌ MySQL is not running!" -ForegroundColor Red
    Write-Host "   Please start MySQL in XAMPP Control Panel" -ForegroundColor White
    exit 1
}
Write-Host "✅ MySQL is running" -ForegroundColor Green
Write-Host ""

# Step 2: Sync backend files
Write-Host "📋 Step 2: Syncing backend files..." -ForegroundColor Yellow
try {
    Copy-Item -Path ".\backend\*" -Destination "C:\xampp\htdocs\quiz-api\" -Recurse -Force
    Write-Host "✅ Backend files synced" -ForegroundColor Green
} catch {
    Write-Host "❌ Sync failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 3: Create database
Write-Host "📋 Step 3: Creating database..." -ForegroundColor Yellow
Write-Host "   Reading SQL schema..." -ForegroundColor White

$sqlFile = ".\backend\database\schema.sql"
if (-not (Test-Path $sqlFile)) {
    Write-Host "❌ Schema file not found: $sqlFile" -ForegroundColor Red
    exit 1
}

$sql = Get-Content $sqlFile -Raw

# Use mysql command line to create database
Write-Host "   Executing SQL via mysql command..." -ForegroundColor White
$mysqlPath = "C:\xampp\mysql\bin\mysql.exe"

if (Test-Path $mysqlPath) {
    # Save SQL to temp file
    $tempSql = [System.IO.Path]::GetTempFileName() + ".sql"
    Set-Content -Path $tempSql -Value $sql
    
    # Execute SQL
    $process = Start-Process -FilePath $mysqlPath -ArgumentList "-u root --execute=`"source $tempSql`"" -NoNewWindow -Wait -PassThru
    
    Remove-Item $tempSql -Force
    
    if ($process.ExitCode -eq 0) {
        Write-Host "✅ Database created successfully!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Database creation may have failed (exit code: $($process.ExitCode))" -ForegroundColor Yellow
        Write-Host "   Manual setup: http://localhost/phpmyadmin" -ForegroundColor White
    }
} else {
    Write-Host "⚠️  MySQL CLI not found at: $mysqlPath" -ForegroundColor Yellow
    Write-Host "   Please create database manually:" -ForegroundColor White
    Write-Host "   1. Open: http://localhost/phpmyadmin" -ForegroundColor Cyan
    Write-Host "   2. Click 'SQL' tab" -ForegroundColor Cyan
    Write-Host "   3. Copy content from: backend\database\schema.sql" -ForegroundColor Cyan
    Write-Host "   4. Click 'Go'" -ForegroundColor Cyan
}
Write-Host ""

# Step 4: Test connection
Write-Host "📋 Step 4: Testing backend..." -ForegroundColor Yellow
try {
    $testResponse = Invoke-WebRequest -Uri "http://localhost/quiz-api/test.php" -UseBasicParsing
    if ($testResponse.Content -match "quiz_app") {
        Write-Host "✅ Backend is working!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Backend responding but database may not exist" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Backend test failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Final Instructions
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🧪 Test your backend:" -ForegroundColor Yellow
Write-Host "   Interactive tests: " -NoNewline
Write-Host "http://localhost/quiz-api/test-suite.html" -ForegroundColor Cyan
Write-Host ""
Write-Host "📖 If tests still fail:" -ForegroundColor Yellow
Write-Host "   1. Open phpMyAdmin: http://localhost/phpmyadmin" -ForegroundColor White
Write-Host "   2. Check if 'quiz_app' database exists" -ForegroundColor White
Write-Host "   3. If not, run the SQL from: backend\database\schema.sql" -ForegroundColor White
Write-Host ""
Write-Host "🔄 To sync changes later, run:" -ForegroundColor Yellow
Write-Host "   .\sync-backend.ps1" -ForegroundColor Cyan
Write-Host ""
