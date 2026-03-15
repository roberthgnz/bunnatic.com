#!/bin/bash

# Performance Testing Script
# Run Lighthouse audits and compare results

echo "🚀 Bunnatic Performance Testing"
echo "================================"
echo ""

# Check if lighthouse is installed
if ! command -v lighthouse &> /dev/null; then
    echo "📦 Installing Lighthouse..."
    npm install -g lighthouse
fi

# URLs to test
PROD_URL="https://www.bunnatic.com/"
LOCAL_URL="http://localhost:3000/"

# Create reports directory
mkdir -p lighthouse-reports

# Function to run lighthouse
run_lighthouse() {
    local url=$1
    local name=$2
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local output_path="lighthouse-reports/${name}_${timestamp}"
    
    echo "🔍 Running Lighthouse audit for: $url"
    echo "   Output: ${output_path}"
    
    lighthouse "$url" \
        --output=json \
        --output=html \
        --output-path="$output_path" \
        --chrome-flags="--headless" \
        --quiet
    
    echo "✅ Audit complete: ${output_path}.html"
    echo ""
}

# Main menu
echo "Select test option:"
echo "1) Test Production (www.bunnatic.com)"
echo "2) Test Local (localhost:3000)"
echo "3) Test Both and Compare"
echo ""
read -p "Enter option (1-3): " option

case $option in
    1)
        run_lighthouse "$PROD_URL" "production"
        ;;
    2)
        run_lighthouse "$LOCAL_URL" "local"
        ;;
    3)
        echo "📊 Running comparison test..."
        run_lighthouse "$PROD_URL" "production"
        run_lighthouse "$LOCAL_URL" "local"
        echo "🎯 Comparison complete! Check lighthouse-reports/ folder"
        ;;
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

echo ""
echo "📁 Reports saved in: lighthouse-reports/"
echo "🌐 Open the .html files in your browser to view detailed results"
