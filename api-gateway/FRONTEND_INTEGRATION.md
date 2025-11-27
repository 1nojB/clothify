# Frontend Integration Guide

## Update Your Frontend to Use API Gateway

Instead of calling services directly, route all requests through the API Gateway at `http://localhost:8084`.

## Before (Direct Service Calls)

```javascript
// Product Service
fetch('http://localhost:8080/product-service/products')

// User Service
fetch('http://localhost:8081/api/users')

// Order Service
fetch('http://localhost:8082/api/orders')

// Inventory Service
fetch('http://localhost:8083/api/inventory')
```

## After (Through API Gateway)

```javascript
// Product Service
fetch('http://localhost:8084/product-service/products')

// User Service
fetch('http://localhost:8084/api/users')

// Order Service
fetch('http://localhost:8084/api/orders')

// Inventory Service
fetch('http://localhost:8084/api/inventory')
```

## Recommended: Use Environment Variable

Create a configuration file or use environment variables:

```javascript
// config.js
const API_GATEWAY_URL = 'http://localhost:8084';

export const API_ENDPOINTS = {
  products: `${API_GATEWAY_URL}/product-service/products`,
  users: `${API_GATEWAY_URL}/api/users`,
  orders: `${API_GATEWAY_URL}/api/orders`,
  inventory: `${API_GATEWAY_URL}/api/inventory`,
};
```

Then use it in your code:

```javascript
import { API_ENDPOINTS } from './config';

// Fetch products
fetch(API_ENDPOINTS.products)
  .then(response => response.json())
  .then(data => console.log(data));

// Login
fetch(`${API_ENDPOINTS.users}/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
})
  .then(response => response.json())
  .then(data => console.log(data));
```

## Benefits

✅ **Single Entry Point** - All requests go through one URL
✅ **CORS Handled** - No more CORS issues
✅ **Easy Deployment** - Change gateway URL once for production
✅ **Load Balancing** - Gateway can distribute load
✅ **Monitoring** - Track all API calls in one place

## Production Deployment

For production, update the gateway URL:

```javascript
const API_GATEWAY_URL = process.env.REACT_APP_API_GATEWAY_URL || 'http://localhost:8084';
```

Then set the environment variable:
```bash
REACT_APP_API_GATEWAY_URL=https://api.yourcompany.com
```
