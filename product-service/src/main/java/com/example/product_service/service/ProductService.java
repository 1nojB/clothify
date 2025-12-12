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

    public List<Product> gettingAllProducts() {
        List<Product> products = productRepository.findAll();

        for (Product product : products) {
            Integer stock = inventoryClient.getStockQuantity(product.getPid());
            product.setStockQuantity(stock);
        }

        return products;
    }

    public Product gettingProductById(int pid) {
        Product product = productRepository.findById(pid).orElse(null);

        if (product != null) {
            Integer stock = inventoryClient.getStockQuantity(pid);
            product.setStockQuantity(stock);
        }

        return product;
    }

    public Product saveProduct(Product product) {

        Product savedProduct = productRepository.save(product);

        int initialStock = product.getStockQuantity();
        inventoryClient.createInventory(savedProduct.getPid(), initialStock);

        return savedProduct;
    }

    public Product updattingProduct(Product product) {
        Product updatedProduct = productRepository.save(product);

        if (product.getStockQuantity() >= 0) {
            inventoryClient.updateInventory(product.getPid(), product.getStockQuantity());
        }

        return updatedProduct;
    }

    public void deletingProductById(int pid) {
        productRepository.deleteById(pid);

    }

    public List<Product> gettingProductByName(String name) {
        List<Product> products = productRepository.findProductByNameContaining(name);

        for (Product product : products) {
            Integer stock = inventoryClient.getStockQuantity(product.getPid());
            product.setStockQuantity(stock);
        }

        return products;
    }

    public List<Product> gettingProductByCategory(String category) {
        List<Product> products = productRepository.findProductByCategory(category);

        for (Product product : products) {
            Integer stock = inventoryClient.getStockQuantity(product.getPid());
            product.setStockQuantity(stock);
        }

        return products;
    }

    public List<Product> gettingProductByBrand(String brand) {
        List<Product> products = productRepository.findProductByBrand(brand);

        for (Product product : products) {
            Integer stock = inventoryClient.getStockQuantity(product.getPid());
            product.setStockQuantity(stock);
        }

        return products;
    }
}
