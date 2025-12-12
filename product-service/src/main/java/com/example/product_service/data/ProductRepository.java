package com.example.product_service.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    @Query("select p from Product p where lower(p.name) like lower(concat('%',?1,'%'))")
    public List<Product> findProductByNameContaining(String name);

    @Query("select p from Product p where lower(p.category) = lower(?1)")
    public List<Product> findProductByCategory(String category);

    @Query("select p from Product p where lower(p.brand) = lower(?1)")
    public List<Product> findProductByBrand(String brand);
}
