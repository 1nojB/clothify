package com.clothify.orderservice.client;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class ProductClient {

    @Autowired
    private RestTemplate restTemplate;

    private static final String PRODUCT_URL = "http://localhost:8080/product-service/products";

    public ProductResponse getProduct(Integer productId) {
        try {
            String url = PRODUCT_URL + "/" + productId;
            return restTemplate.getForObject(url, ProductResponse.class);
        } catch (Exception e) {
            System.err.println("Product not found: " + productId);
            return null;
        }
    }

    public boolean productExists(Integer productId) {
        ProductResponse product = getProduct(productId);
        return product != null;
    }

    public String getProductName(Integer productId) {
        ProductResponse product = getProduct(productId);
        return product != null ? product.getName() : "Unknown Product";
    }

    public static class ProductResponse {
        private Integer pid;
        private String name;
        private String description;
        private String brand;
        private String category;
        private Double price;
        private String imageUrl;
        private Integer stockQuantity;

        public Integer getPid() {
            return pid;
        }

        public void setPid(Integer pid) {
            this.pid = pid;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public String getBrand() {
            return brand;
        }

        public void setBrand(String brand) {
            this.brand = brand;
        }

        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }

        public Double getPrice() {
            return price;
        }

        public void setPrice(Double price) {
            this.price = price;
        }

        public String getImageUrl() {
            return imageUrl;
        }

        public void setImageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
        }

        public Integer getStockQuantity() {
            return stockQuantity;
        }

        public void setStockQuantity(Integer stockQuantity) {
            this.stockQuantity = stockQuantity;
        }
    }
}
