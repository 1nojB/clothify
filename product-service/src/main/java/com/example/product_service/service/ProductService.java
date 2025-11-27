package com.example.product_service.service;

import com.example.product_service.client.InventoryClient;
import com.example.product_service.data.Product;
import com.example.product_service.data.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private InventoryClient inventoryClient;

    /**
     * Get all products with real-time inventory from Inventory Service
     */
    public List<Product> gettingAllProducts() {
        List<Product> products = productRepository.findAll();

        // Enrich each product with real-time inventory data
        for (Product product : products) {
            Integer stock = inventoryClient.getStockQuantity(product.getPid());
            product.setStockQuantity(stock);
        }

        return products;
    }

    /**
     * Get product by ID with real-time inventory
     */
    public Product gettingProductById(int pid) {
        Product product = productRepository.findById(pid).orElse(null);

        if (product != null) {
            Integer stock = inventoryClient.getStockQuantity(pid);
            product.setStockQuantity(stock);
        }

        return product;
    }

    /**
     * Save new product and automatically create inventory record
     */
    public Product saveProduct(Product product) {
        // Save product to database
        Product savedProduct = productRepository.save(product);

        // Create inventory record in Inventory Service
        int initialStock = product.getStockQuantity();
        inventoryClient.createInventory(savedProduct.getPid(), initialStock);

        return savedProduct;
    }

    /**
     * Update existing product
     */
    public Product updattingProduct(Product product) {
        Product updatedProduct = productRepository.save(product);

        // Optionally sync inventory if stockQuantity is provided
        // Note: This updates the inventory service as well
        if (product.getStockQuantity() >= 0) {
            inventoryClient.updateInventory(product.getPid(), product.getStockQuantity());
        }

        return updatedProduct;
    }

    /**
     * Delete product by ID
     */
    public void deletingProductById(int pid) {
        productRepository.deleteById(pid);
        // Note: You might want to also delete the inventory record
        // Add a deleteInventory method to InventoryClient if needed
    }

    /**
     * Get products by name with real-time inventory
     */
    public List<Product> gettingProductByName(String name) {
        List<Product> products = productRepository.findProductByNameContaining(name);

        // Enrich with inventory data
        for (Product product : products) {
            Integer stock = inventoryClient.getStockQuantity(product.getPid());
            product.setStockQuantity(stock);
        }

        return products;
    }

    /**
     * Get products by category with real-time inventory
     */
    public List<Product> gettingProductByCategory(String category) {
        List<Product> products = productRepository.findProductByCategory(category);

        // Enrich with inventory data
        for (Product product : products) {
            Integer stock = inventoryClient.getStockQuantity(product.getPid());
            product.setStockQuantity(stock);
        }

        return products;
    }

    /**
     * Get products by brand with real-time inventory
     */
    public List<Product> gettingProductByBrand(String brand) {
        List<Product> products = productRepository.findProductByBrand(brand);

        // Enrich with inventory data
        for (Product product : products) {
            Integer stock = inventoryClient.getStockQuantity(product.getPid());
            product.setStockQuantity(stock);
        }

        return products;
    }
}
