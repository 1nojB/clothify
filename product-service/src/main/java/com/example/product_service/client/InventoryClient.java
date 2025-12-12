package com.example.product_service.client;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class InventoryClient {

    @Autowired
    private RestTemplate restTemplate;

    private static final String INVENTORY_SERVICE_URL = "http://localhost:8083/api/inventory";

    public Integer getStockQuantity(int productId) {
        try {
            String url = INVENTORY_SERVICE_URL + "/" + productId;
            InventoryResponse response = restTemplate.getForObject(url, InventoryResponse.class);
            return response != null ? response.getQuantity() : 0;
        } catch (Exception e) {

            System.err.println("Failed to get inventory for product " + productId + ": " + e.getMessage());
            return 0;
        }
    }

    public void createInventory(int productId, int quantity) {
        try {
            InventoryRequest request = new InventoryRequest();
            request.setProductId((long) productId);
            request.setQuantity(quantity);

            restTemplate.postForObject(INVENTORY_SERVICE_URL, request, InventoryResponse.class);
            System.out.println("Created inventory for product " + productId + " with quantity " + quantity);
        } catch (Exception e) {
            System.err.println("Failed to create inventory for product " + productId + ": " + e.getMessage());
        }
    }

    public void updateInventory(int productId, int quantity) {
        try {
            String url = INVENTORY_SERVICE_URL + "/" + productId;
            InventoryRequest request = new InventoryRequest();
            request.setQuantity(quantity);

            restTemplate.put(url, request);
            System.out.println("Updated inventory for product " + productId + " to quantity " + quantity);
        } catch (Exception e) {
            System.err.println("Failed to update inventory for product " + productId + ": " + e.getMessage());
        }
    }

    public static class InventoryResponse {
        private Long id;
        private Long productId;
        private Integer quantity;

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public Long getProductId() {
            return productId;
        }

        public void setProductId(Long productId) {
            this.productId = productId;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }
    }

    public static class InventoryRequest {
        private Long productId;
        private Integer quantity;

        public Long getProductId() {
            return productId;
        }

        public void setProductId(Long productId) {
            this.productId = productId;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }
    }
}