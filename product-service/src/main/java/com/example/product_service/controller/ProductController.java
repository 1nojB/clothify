package com.example.product_service.controller;

import com.example.product_service.data.Product;
import com.example.product_service.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping(path = "/products")
    public List<Product> getAllProducts() {
        return productService.gettingAllProducts();
    }

    @GetMapping(path = "/products/{pid}")
    public Product getProductById(@PathVariable int pid) {
        return productService.gettingProductById(pid);
    }

    @PostMapping(path = "/products")
    public Product createProduct(@RequestBody Product product) {
        return productService.saveProduct(product);
    }

    @PutMapping(path = "/products/{pid}")
    public Product updateProduct(@PathVariable int pid, @RequestBody Product product) {
        product.setPid(pid);
        return productService.updattingProduct(product);
    }

    @DeleteMapping(path = "/products/{pid}")
    public void deleteProductById(@PathVariable int pid) {
        productService.deletingProductById(pid);
    }

    @GetMapping(path = "/products", params = { "name" })
    public List<Product> getProductByName(@RequestParam String name) {
        return productService.gettingProductByName(name);
    }

    @GetMapping(path = "/products", params = { "category" })
    public List<Product> getProductByCategory(@RequestParam String category) {
        return productService.gettingProductByCategory(category);
    }

    @GetMapping(path = "/products", params = { "brand" })
    public List<Product> getProductByBrand(@RequestParam String brand) {
        return productService.gettingProductByBrand(brand);
    }
}