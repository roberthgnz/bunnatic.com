# Performance Testing Script for Windows PowerShell
# Run Lighthouse audits and compare results

Write-Host "🚀 Bunnatic Performance Testing" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if lighthouse is installed
$lighthouseInstalled = Get-Command lighthouse -ErrorAction SilentlyContinue
if (-not $lighthouseInstalled) {
    Write-Host "📦 Installing Lighthouse..." -ForegroundColor Yellow
    npm install -g lighthouse
}

# URLs to test
$PROD_URL = "https://www.bunnatic.com/"
$LOCAL_URL = "http://localhost:3000/"

# Create reports directory
$reportsDir = "lighthouse-reports"
if (-not (Test-Path $reportsDir)) {
    New-Item -ItemType Directory -Path $reportsDir | Out-Null
}

# Function to run lighthouse
function Run-Lighthouse {
    param(
        [string]$url,
        [string]$name
    )
    
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $outputPath = "$reportsDir/${name}_${timestamp}"
    
    Write-Host "🔍 Running Lighthouse audit for: $url" -ForegroundColor Green
    Write-Host "   Output: ${outputPath}" -ForegroundColor Gray
    
    lighthouse $url `
        --output=json `
        --output=html `
        --output-path="$outputPath" `
        --chrome-flags="--headless" `
        --quiet
    
    Write-Host "✅ Audit complete: ${outputPath}.html" -ForegroundColor Green
    Write-Host ""
}

# Main menu
Write-Host "Select test option:" -ForegroundColor Yellow
Write-Host "1) Test Production (www.bunnatic.com)"
Write-Host "2) Test Local (localhost:3000)"
Write-Host "3) Test Both and Compare"
Write-Host ""
$option = Read-Host "Enter option (1-3)"

switch ($option) {
    "1" {
        Run-Lighthouse -url $PROD_URL -name "production"
    }
    "2" {
        Run-Lighthouse -url $LOCAL_URL -name "local"
    }
    "3" {
        Write-Host "📊 Running comparison test..." -ForegroundColor Cyan
        Run-Lighthouse -url $PROD_URL -name "production"
        Run-Lighthouse -url $LOCAL_URL -name "local"
        Write-Host "🎯 Comparison complete! Check lighthouse-reports/ folder" -ForegroundColor Green
    }
    default {
        Write-Host "❌ Invalid option" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "📁 Reports saved in: $reportsDir/" -ForegroundColor Cyan
Write-Host "🌐 Open the .html files in your browser to view detailed results" -ForegroundColor Cyan
