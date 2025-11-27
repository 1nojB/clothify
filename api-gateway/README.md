# Clothify API Gateway

A simple Spring Cloud Gateway that routes requests to all Clothify microservices.

## Overview

The API Gateway acts as a single entry point for all client requests and routes them to the appropriate microservice.

## Port Configuration

- **API Gateway**: `http://localhost:8084`
- **Product Service**: `http://localhost:8080`
- **User Service**: `http://localhost:8081`
- **Order Service**: `http://localhost:8082`
- **Inventory Service**: `http://localhost:8083`

## Routes

All requests should be made through the API Gateway at `http://localhost:8084`:

### Product Service
- **Route**: `/product-service/**`
- **Example**: `http://localhost:8084/product-service/products`

### User Service
- **Route**: `/api/users/**`
- **Examples**:
  - `http://localhost:8084/api/users` - Get all users
  - `http://localhost:8084/api/users/1` - Get user by ID
  - `http://localhost:8084/api/users/register` - Register new user
  - `http://localhost:8084/api/users/login` - Login

### Order Service
- **Route**: `/api/orders/**`
- **Examples**:
  - `http://localhost:8084/api/orders` - Get all orders
  - `http://localhost:8084/api/orders/1` - Get order by ID
  - `http://localhost:8084/api/orders` - Create new order (POST)

### Inventory Service
- **Route**: `/api/inventory/**`
- **Examples**:
  - `http://localhost:8084/api/inventory` - Get all inventory
  - `http://localhost:8084/api/inventory/1` - Get inventory by product ID

## Running the Gateway

### 1. Build the project
```bash
cd /home/inoj/Desktop/cw/api-gateway
mvn clean package
```

### 2. Run the gateway
```bash
mvn spring-boot:run
```

Or run the JAR file:
```bash
java -jar target/api-gateway-0.0.1-SNAPSHOT.jar
```

## Testing the Gateway

### Check Gateway Status
```bash
curl http://localhost:8084/
```

### Check Health
```bash
curl http://localhost:8084/health
```

### View All Routes (Actuator)
```bash
curl http://localhost:8084/actuator/gateway/routes
```

## Features

✅ **Centralized Routing** - Single entry point for all services
✅ **CORS Enabled** - Cross-Origin Resource Sharing configured globally
✅ **Load Balancing Ready** - Can be extended with service discovery
✅ **Monitoring** - Actuator endpoints for route inspection
✅ **Simple Configuration** - Easy to add new routes

## CORS Configuration

CORS is enabled globally for all routes:
- **Allowed Origins**: `*` (all origins)
- **Allowed Methods**: `GET, POST, PUT, DELETE, OPTIONS`
- **Allowed Headers**: `*` (all headers)

## Adding New Routes

To add a new service route, edit `src/main/resources/application.properties`:

```properties
spring.cloud.gateway.routes[4].id=new-service
spring.cloud.gateway.routes[4].uri=http://localhost:8085
spring.cloud.gateway.routes[4].predicates[0]=Path=/api/new-service/**
```

## Architecture

```
Client Request
     ↓
API Gateway (8084)
     ↓
├── /product-service/** → Product Service (8080)
├── /api/users/**       → User Service (8081)
├── /api/orders/**      → Order Service (8082)
└── /api/inventory/**   → Inventory Service (8083)
```

## Important Notes

1. **Start Services First**: Make sure all backend services are running before starting the gateway
2. **Port Conflicts**: Ensure port 8084 is not in use
3. **Service URLs**: Update service URLs in `application.properties` if services run on different hosts/ports
4. **Frontend Update**: Update your frontend to use `http://localhost:8084` instead of individual service URLs

## Troubleshooting

### Gateway not routing requests
- Check if all backend services are running
- Verify service ports in `application.properties`
- Check gateway logs for routing errors

### CORS errors
- CORS is already configured globally
- If issues persist, check browser console for specific errors

### Connection refused
- Ensure the target service is running on the specified port
- Check firewall settings
