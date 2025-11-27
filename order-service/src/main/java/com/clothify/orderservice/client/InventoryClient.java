package com.clothify.orderservice.client;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class InventoryClient {

    @Autowired
    private RestTemplate restTemplate;

    private static final String INVENTORY_URL = "http://localhost:8083/api/inventory";

    /**
     * Check if product has enough stock
     */
    public boolean hasStock(Integer productId, int quantity) {
        try {
            String url = INVENTORY_URL + "/" + productId;
            InventoryResponse inv = restTemplate.getForObject(url, InventoryResponse.class);
            return inv != null && inv.getQuantity() >= quantity;
        } catch (Exception e) {
            System.err.println("Failed to check stock for product " + productId + ": " + e.getMessage());
            return false;
        }
    }

    /**
     * Get current stock quantity
     */
    public Integer getStockQuantity(Integer productId) {
        try {
            String url = INVENTORY_URL + "/" + productId;
            InventoryResponse inv = restTemplate.getForObject(url, InventoryResponse.class);
            return inv != null ? inv.getQuantity() : 0;
        } catch (Exception e) {
            System.err.println("Failed to get stock for product " + productId + ": " + e.getMessage());
            return 0;
        }
    }

    /**
     * Reduce stock when order is placed
     */
    public void reduceStock(Integer productId, int quantity) {
        try {
            String url = INVENTORY_URL + "/reduce/" + productId + "?qty=" + quantity;
            restTemplate.put(url, null);
            System.out.println("Reduced stock for product " + productId + " by " + quantity);
        } catch (Exception e) {
            throw new RuntimeException("Failed to reduce stock for product " + productId + ": " + e.getMessage());
        }
    }

    /**
     * Restore stock if order is cancelled
     */
    public void restoreStock(Integer productId, int quantity) {
        try {
            String url = INVENTORY_URL + "/increase/" + productId + "?qty=" + quantity;
            restTemplate.put(url, null);
            System.out.println("Restored stock for product " + productId + " by " + quantity);
        } catch (Exception e) {
            System.err.println("Failed to restore stock for product " + productId + ": " + e.getMessage());
        }
    }

    // Response class
    public static class InventoryResponse {
        private Long id;
        private Long productId;
        private Integer quantity;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }
}
