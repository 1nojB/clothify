#!/bin/bash

echo "=========================================="
echo "  API Gateway - Service Health Check"
echo "=========================================="
echo ""

GATEWAY_URL="http://localhost:8084"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to test endpoint
test_endpoint() {
    local name=$1
    local url=$2
    
    echo -n "Testing $name... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
    
    if [ "$response" -eq 200 ] || [ "$response" -eq 302 ]; then
        echo -e "${GREEN}✓ OK${NC} (HTTP $response)"
        return 0
    else
        echo -e "${RED}✗ FAILED${NC} (HTTP $response)"
        return 1
    fi
}

echo "Checking if API Gateway is running..."
echo ""

# Test Gateway itself
test_endpoint "Gateway Status" "$GATEWAY_URL/"
test_endpoint "Gateway Health" "$GATEWAY_URL/health"
echo ""

echo "Testing service routes through gateway..."
echo ""

# Test each service through gateway
test_endpoint "Product Service" "$GATEWAY_URL/product-service/products"
test_endpoint "User Service" "$GATEWAY_URL/api/users"
test_endpoint "Order Service" "$GATEWAY_URL/api/orders"
test_endpoint "Inventory Service" "$GATEWAY_URL/api/inventory"

echo ""
echo "=========================================="
echo "  Test Complete"
echo "=========================================="
echo ""
echo "To view all routes, run:"
echo "  curl $GATEWAY_URL/actuator/gateway/routes | jq"
echo ""
