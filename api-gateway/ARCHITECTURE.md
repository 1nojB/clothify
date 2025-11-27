# Clothify Microservices Architecture

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    Client Applications                      │
│              (Browser, Mobile App, etc.)                    │
│                                                             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ All requests go through
                         │ http://localhost:8084
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                   API Gateway (Port 8084)                   │
│                                                             │
│  • Centralized routing                                      │
│  • CORS handling                                            │
│  • Load balancing (future)                                  │
│  • Authentication (future)                                  │
│                                                             │
└─────────────────────────┬───────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┬─────────────────┐
        │                 │                 │                 │
        ▼                 ▼                 ▼                 ▼
┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│   Product     │ │     User      │ │     Order     │ │  Inventory    │
│   Service     │ │   Service     │ │   Service     │ │   Service     │
│               │ │               │ │               │ │               │
│  Port: 8080   │ │  Port: 8081   │ │  Port: 8082   │ │  Port: 8083   │
│               │ │               │ │               │ │               │
│  /product-    │ │  /api/users   │ │  /api/orders  │ │  /api/        │
│   service/**  │ │               │ │               │ │   inventory   │
└───────┬───────┘ └───────┬───────┘ └───────┬───────┘ └───────┬───────┘
        │                 │                 │                 │
        │                 │                 │                 │
        ▼                 ▼                 ▼                 ▼
┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│  ProductDB    │ │    UserDB     │ │   OrderDB     │ │ InventoryDB   │
│  (MariaDB)    │ │  (MariaDB)    │ │  (MariaDB)    │ │  (MariaDB)    │
│  Port: 3306   │ │  Port: 3306   │ │  Port: 3306   │ │  Port: 3306   │
└───────────────┘ └───────────────┘ └───────────────┘ └───────────────┘
```

## Request Flow Example

### Example 1: Get All Products

```
1. Client Request:
   GET http://localhost:8084/product-service/products

2. API Gateway receives request

3. Gateway routes to Product Service:
   GET http://localhost:8080/product-service/products

4. Product Service queries ProductDB

5. Response flows back through Gateway to Client
```

### Example 2: Create Order

```
1. Client Request:
   POST http://localhost:8084/api/orders
   Body: { customerId: 1, items: [...] }

2. API Gateway receives request

3. Gateway routes to Order Service:
   POST http://localhost:8082/api/orders

4. Order Service:
   - Validates user via User Service
   - Validates products via Product Service
   - Checks inventory via Inventory Service
   - Creates order in OrderDB
   - Reduces inventory

5. Response flows back through Gateway to Client
```

## Service Communication

### External (Client → Services)
All external requests MUST go through the API Gateway:
- ✅ Client → Gateway → Service
- ❌ Client → Service (direct)

### Internal (Service → Service)
Services can communicate directly with each other:
- Order Service → User Service (validate user)
- Order Service → Product Service (validate product)
- Order Service → Inventory Service (check/update stock)

## Port Summary

| Component | Port | URL |
|-----------|------|-----|
| API Gateway | 8084 | http://localhost:8084 |
| Product Service | 8080 | http://localhost:8080 |
| User Service | 8081 | http://localhost:8081 |
| Order Service | 8082 | http://localhost:8082 |
| Inventory Service | 8083 | http://localhost:8083 |
| MariaDB | 3306 | localhost:3306 |

## Database Schema

| Service | Database | Tables |
|---------|----------|--------|
| Product | productdb | products |
| User | userdb | users |
| Order | orderdb | orders, order_items |
| Inventory | inventorydb | inventory |

## Benefits of API Gateway

1. **Single Entry Point**: Clients only need to know one URL
2. **CORS Management**: Handled centrally, no per-service configuration
3. **Security**: Add authentication/authorization in one place
4. **Load Balancing**: Distribute requests across service instances
5. **Monitoring**: Track all API traffic centrally
6. **Versioning**: Easy to manage API versions
7. **Rate Limiting**: Protect services from overload
8. **Caching**: Cache responses for better performance

## Future Enhancements

- [ ] Service Discovery (Eureka/Consul)
- [ ] Circuit Breaker (Resilience4j)
- [ ] Rate Limiting
- [ ] Authentication (JWT)
- [ ] API Documentation (Swagger/OpenAPI)
- [ ] Request/Response logging
- [ ] Metrics and monitoring (Prometheus/Grafana)
- [ ] Distributed tracing (Zipkin/Jaeger)
