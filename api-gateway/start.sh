#!/bin/bash

echo "=========================================="
echo "  Clothify API Gateway"
echo "=========================================="
echo ""
echo "Starting API Gateway on port 8084..."
echo ""
echo "Make sure all services are running:"
echo "  - Product Service (8080)"
echo "  - User Service (8081)"
echo "  - Order Service (8082)"
echo "  - Inventory Service (8083)"
echo ""
echo "Gateway will be available at: http://localhost:8084"
echo ""

cd "$(dirname "$0")"
mvn spring-boot:run
