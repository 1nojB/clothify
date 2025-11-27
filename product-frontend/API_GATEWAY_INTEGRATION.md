# Frontend - API Gateway Integration

## ✅ What Changed

The frontend has been updated to use the **API Gateway** instead of calling services directly.

## Before vs After

### Before (Direct Service Calls)
```javascript
Product Service:   http://localhost:8080/product-service
User Service:      http://localhost:8081/api/users
Order Service:     http://localhost:8082/api
Inventory Service: http://localhost:8083/api
```

### After (Through API Gateway)
```javascript
All Services:      http://localhost:8084/*
```

All requests now go through the API Gateway at `http://localhost:8084`, which routes them to the appropriate service.

## Configuration

The API Gateway URL is configured in `.env`:

```env
VITE_API_GATEWAY=http://localhost:8084
```

## Running the Frontend

### 1. Install dependencies (if not already done)
```bash
npm install
```

### 2. Start the development server
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Important: Start Services in Order

Make sure to start services in this order:

1. **Database** (MariaDB on port 3306)
2. **Backend Services**:
   - Product Service (port 8080)
   - User Service (port 8081)
   - Order Service (port 8082)
   - Inventory Service (port 8083)
3. **API Gateway** (port 8084)
4. **Frontend** (port 5173)

## Testing the Integration

### 1. Start the API Gateway
```bash
cd /home/inoj/Desktop/cw/api-gateway
./start.sh
```

### 2. Start the Frontend
```bash
cd /home/inoj/Desktop/cw/product-frontend
npm run dev
```

### 3. Open your browser
Navigate to `http://localhost:5173`

All API calls will now automatically route through the gateway!

## Benefits

✅ **Single Entry Point** - All API calls go through one URL
✅ **CORS Handled** - No more CORS issues
✅ **Easy Configuration** - Change one URL for all services
✅ **Production Ready** - Just update `.env.production` for deployment
✅ **Better Security** - Gateway can handle authentication centrally
✅ **Monitoring** - Track all API traffic in one place

## Production Deployment

For production, update `.env.production`:

```env
VITE_API_GATEWAY=https://api.yourcompany.com
```

Then build:
```bash
npm run build
```

## Troubleshooting

### API calls failing
- Make sure the API Gateway is running on port 8084
- Check that all backend services are running
- Verify the gateway routes in `api-gateway/src/main/resources/application.properties`

### CORS errors
- CORS is handled by the API Gateway
- Make sure you're using the gateway URL, not direct service URLs

### Environment variables not working
- Restart the dev server after changing `.env`
- Make sure variable names start with `VITE_`

## Files Modified

- ✅ `src/api.js` - Updated all API base URLs
- ✅ `src/services/auth.js` - Updated authentication endpoints
- ✅ `.env` - Added API Gateway configuration
- ✅ `.env.production` - Added production template

## API Endpoints (Through Gateway)

| Service | Endpoint | Gateway URL |
|---------|----------|-------------|
| Products | GET /products | http://localhost:8084/product-service/products |
| Users | GET /users | http://localhost:8084/api/users |
| Orders | GET /orders | http://localhost:8084/api/orders |
| Inventory | GET /inventory | http://localhost:8084/api/inventory |
| Login | POST /login | http://localhost:8084/api/users/login |
| Register | POST /register | http://localhost:8084/api/users/register |

---

**Status:** ✅ Frontend Updated and Ready to Use API Gateway
