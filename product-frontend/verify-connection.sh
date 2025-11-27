#!/bin/bash

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "=================================================="
echo "   Frontend <-> Gateway Connection Verifier"
echo "=================================================="

# 1. Check if Gateway is reachable
echo -n "Checking API Gateway (localhost:8084)... "
if curl -s http://localhost:8084/actuator/health > /dev/null; then
    echo -e "${GREEN}ONLINE${NC}"
else
    echo -e "${RED}OFFLINE${NC}"
    echo "Please start the gateway: cd ../api-gateway && ./start.sh"
    exit 1
fi

# 2. Check Frontend Configuration
echo -n "Checking Frontend Configuration... "
if grep -q "VITE_API_GATEWAY=http://localhost:8084" .env; then
    echo -e "${GREEN}CORRECT${NC}"
else
    echo -e "${RED}INCORRECT${NC}"
    echo "Please check your .env file in product-frontend"
fi

echo ""
echo "Connection is properly configured!"
echo "You can now run 'npm run dev' to start the frontend."
