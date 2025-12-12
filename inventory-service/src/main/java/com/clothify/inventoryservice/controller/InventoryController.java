package com.clothify.inventoryservice.controller;

import com.clothify.inventoryservice.entity.Inventory;
import com.clothify.inventoryservice.service.InventoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryService service;

    public InventoryController(InventoryService service) {
        this.service = service;
    }

    @GetMapping
    public List<Inventory> getAll() {
        return service.getAll();
    }

    @GetMapping("/{productId}")
    public ResponseEntity<Inventory> getByProductId(@PathVariable Long productId) {
        return service.getByProductId(productId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Inventory saveOrUpdate(@RequestBody Inventory inventory) {
        return service.saveOrUpdate(inventory);
    }

    @PutMapping("/{productId}")
    public ResponseEntity<Inventory> updateQuantity(@PathVariable Long productId,
            @RequestBody Map<String, Integer> update) {
        Integer newQuantity = update.get("quantity");
        if (newQuantity == null || newQuantity < 0) {
            return ResponseEntity.badRequest().build();
        }

        Inventory inventory = service.getByProductId(productId)
                .orElse(new Inventory());

        inventory.setProductId(productId);
        inventory.setQuantity(newQuantity);

        Inventory updated = service.saveOrUpdate(inventory);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/increase/{productId}")
    public ResponseEntity<String> increase(@PathVariable Long productId, @RequestParam int qty) {
        service.increaseStock(productId, qty);
        return ResponseEntity.ok("Stock increased successfully.");
    }

    @PutMapping("/reduce/{productId}")
    public ResponseEntity<String> reduce(@PathVariable Long productId, @RequestParam int qty) {
        boolean ok = service.reduceStock(productId, qty);
        if (!ok)
            return ResponseEntity.badRequest().body("Insufficient stock.");
        return ResponseEntity.ok("Stock reduced successfully.");
    }
}
