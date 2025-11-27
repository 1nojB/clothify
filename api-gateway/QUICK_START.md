# API Gateway Setup - Quick Start Guide

## ✅ What Was Created

A simple Spring Cloud Gateway that acts as a single entry point for all your microservices.

## 📁 Project Structure

```
api-gateway/
├── src/
│   └── main/
│       ├── java/com/clothify/apigateway/
│       │   ├── ApiGatewayApplication.java      # Main application
│       │   ├── config/
│       │   │   └── GatewayConfig.java          # CORS configuration
│       │   └── controller/
│       │       └── GatewayController.java      # Info endpoint
│       └── resources/
│           └── application.properties           # Route configuration
├── pom.xml                                      # Maven dependencies
├── start.sh                                     # Startup script
├── README.md                                    # Full documentation
└── FRONTEND_INTEGRATION.md                     # Frontend guide
```

## 🚀 How to Run

### Option 1: Using the startup script
```bash
cd /home/inoj/Desktop/cw/api-gateway
./start.sh
```

### Option 2: Using Maven
```bash
cd /home/inoj/Desktop/cw/api-gateway
mvn spring-boot:run
```

### Option 3: Using the JAR file
```bash
cd /home/inoj/Desktop/cw/api-gateway
java -jar target/api-gateway-0.0.1-SNAPSHOT.jar
```

## 🔗 Service Routes

| Service | Direct URL | Through Gateway |
|---------|-----------|-----------------|
| Product | http://localhost:8080/product-service/products | http://localhost:8084/product-service/products |
| User | http://localhost:8081/api/users | http://localhost:8084/api/users |
| Order | http://localhost:8082/api/orders | http://localhost:8084/api/orders |
| Inventory | http://localhost:8083/api/inventory | http://localhost:8084/api/inventory |

## 🧪 Testing the Gateway

### 1. Start all services
Make sure these are running:
- Product Service (port 8080)
- User Service (port 8081)
- Order Service (port 8082)
- Inventory Service (port 8083)

### 2. Start the gateway
```bash
cd /home/inoj/Desktop/cw/api-gateway
./start.sh
```

### 3. Test the gateway
```bash
# Check gateway status
curl http://localhost:8084/

# Test product service through gateway
curl http://localhost:8084/product-service/products

# Test user service through gateway
curl http://localhost:8084/api/users

# View all routes
curl http://localhost:8084/actuator/gateway/routes
```

## 🎯 Next Steps

### 1. Update Frontend
Change all API calls to use `http://localhost:8084` instead of individual service URLs.

See `FRONTEND_INTEGRATION.md` for detailed instructions.

### 2. Update Service Clients (Optional)
If your services call each other (like order-service calling user-service), you can optionally route those through the gateway too, but it's not required for internal service-to-service communication.

### 3. Production Deployment
When deploying to production:
- Update the gateway URL in your frontend
- Configure proper CORS origins (instead of `*`)
- Add authentication/authorization if needed
- Consider adding rate limiting

## 🔧 Configuration

All routes are configured in `src/main/resources/application.properties`.

To add a new service:
```properties
spring.cloud.gateway.routes[4].id=new-service
spring.cloud.gateway.routes[4].uri=http://localhost:8085
spring.cloud.gateway.routes[4].predicates[0]=Path=/api/new-service/**
```

## 📊 Monitoring

View all active routes:
```bash
curl http://localhost:8084/actuator/gateway/routes | jq
```

## ✨ Features

- ✅ Centralized routing
- ✅ CORS enabled globally
- ✅ Simple configuration
- ✅ Actuator endpoints for monitoring
- ✅ Easy to extend
- ✅ Production-ready

## 🐛 Troubleshooting

**Gateway won't start:**
- Check if port 8084 is available
- Ensure Java 21 is installed

**Routes not working:**
- Verify all backend services are running
- Check service ports match configuration
- Review gateway logs for errors

**CORS errors:**
- CORS is already configured globally
- Check browser console for specific errors
- Verify request headers

## 📚 Documentation

- Full documentation: `README.md`
- Frontend integration: `FRONTEND_INTEGRATION.md`

---

**Gateway URL:** http://localhost:8084
**Status:** ✅ Built and Ready to Run
