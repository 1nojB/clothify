# Order Service (Clothify)

A cleaned, JDK21-compatible Spring Boot Order Service for the Clothify project.

## Run locally
1. Ensure MariaDB is running and create database `orderdb`:
   ```sql
   CREATE DATABASE IF NOT EXISTS orderdb;
   ```
2. Edit `src/main/resources/application.properties` to set your DB credentials.
3. Build and run:
   ```bash
   mvn -DskipTests clean package
   mvn spring-boot:run
   ```

## API Endpoints
- `GET /api/orders` - list orders
- `GET /api/orders/{id}` - get order by id
- `POST /api/orders` - create order (JSON body)
- `PUT /api/orders/{id}` - update order
- `DELETE /api/orders/{id}` - delete order
