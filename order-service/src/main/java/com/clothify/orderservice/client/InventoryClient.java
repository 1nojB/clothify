package com.clothify.orderservice.client;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class InventoryClient {

    @Autowired
    private RestTemplate restTemplate;

    private static final String INVENTORY_URL = "http://localhost:8083/api/inventory";

<<<<<<< HEAD
=======
    // Check if product has enough stock

>>>>>>> 34141186933c2f6d59c51097719d2d5a3de5c2d7
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

<<<<<<< HEAD
=======
    // Get current stock quantity

>>>>>>> 34141186933c2f6d59c51097719d2d5a3de5c2d7
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

<<<<<<< HEAD
=======
    // Reduce stock when order is placed

>>>>>>> 34141186933c2f6d59c51097719d2d5a3de5c2d7
    public void reduceStock(Integer productId, int quantity) {
        try {
            String url = INVENTORY_URL + "/reduce/" + productId + "?qty=" + quantity;
            restTemplate.put(url, null);
            System.out.println("Reduced stock for product " + productId + " by " + quantity);
        } catch (Exception e) {
            throw new RuntimeException("Failed to reduce stock for product " + productId + ": " + e.getMessage());
        }
    }

<<<<<<< HEAD
=======
    // Restore stock if order is cancelled

>>>>>>> 34141186933c2f6d59c51097719d2d5a3de5c2d7
    public void restoreStock(Integer productId, int quantity) {
        try {
            String url = INVENTORY_URL + "/increase/" + productId + "?qty=" + quantity;
            restTemplate.put(url, null);
            System.out.println("Restored stock for product " + productId + " by " + quantity);
        } catch (Exception e) {
            System.err.println("Failed to restore stock for product " + productId + ": " + e.getMessage());
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
}
