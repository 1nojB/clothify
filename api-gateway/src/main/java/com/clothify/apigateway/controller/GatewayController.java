package com.clothify.apigateway.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class GatewayController {

    @GetMapping("/")
    public Map<String, Object> home() {
        Map<String, Object> response = new HashMap<>();
        response.put("service", "Clothify API Gateway");
        response.put("status", "running");
        response.put("version", "1.0.0");

        Map<String, String> routes = new HashMap<>();
        routes.put("product-service", "http://localhost:8084/product-service/**");
        routes.put("user-service", "http://localhost:8084/api/users/**");
        routes.put("order-service", "http://localhost:8084/api/orders/**");
        routes.put("inventory-service", "http://localhost:8084/api/inventory/**");

        response.put("available_routes", routes);
        response.put("actuator", "http://localhost:8084/actuator/gateway/routes");

        return response;
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "api-gateway");
        return response;
    }
}
