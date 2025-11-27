package com.clothify.inventoryservice.service;


import com.clothify.inventoryservice.entity.Inventory;
import com.clothify.inventoryservice.repository.InventoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InventoryService {

    private final InventoryRepository repo;

    public InventoryService(InventoryRepository repo) {
        this.repo = repo;
    }

    public List<Inventory> getAll() {
        return repo.findAll();
    }

    public Optional<Inventory> getByProductId(Long productId) {
        return repo.findByProductId(productId);
    }

    public Inventory saveOrUpdate(Inventory inventory) {
        Optional<Inventory> existing = repo.findByProductId(inventory.getProductId());
        if (existing.isPresent()) {
            Inventory inv = existing.get();
            inv.setQuantity(inventory.getQuantity());
            return repo.save(inv);
        }
        return repo.save(inventory);
    }

    public void increaseStock(Long productId, int qty) {
        Inventory inv = repo.findByProductId(productId)
                .orElse(new Inventory(productId, 0));
        inv.setQuantity(inv.getQuantity() + qty);
        repo.save(inv);
    }

    public boolean reduceStock(Long productId, int qty) {
        Inventory inv = repo.findByProductId(productId).orElse(null);
        if (inv == null || inv.getQuantity() < qty) {
            return false;
        }
        inv.setQuantity(inv.getQuantity() - qty);
        repo.save(inv);
        return true;
    }
}
