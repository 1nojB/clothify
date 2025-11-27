package com.clothify.orderservice.service;

import com.clothify.orderservice.client.InventoryClient;
import com.clothify.orderservice.client.ProductClient;
import com.clothify.orderservice.client.UserClient;
import com.clothify.orderservice.entity.Order;
import com.clothify.orderservice.entity.OrderItem;
import com.clothify.orderservice.repository.OrderItemRepository;
import com.clothify.orderservice.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    private final OrderRepository ordRepo;
    private final OrderItemRepository orderItemRepo;
    private final InventoryClient inventoryClient;
    private final ProductClient productClient;
    private final UserClient userClient;

    @Autowired
    public OrderService(OrderRepository ordRepo,
                        OrderItemRepository orderItemRepo,
                        InventoryClient inventoryClient,
                        ProductClient productClient,
                        UserClient userClient) {
        this.ordRepo = ordRepo;
        this.orderItemRepo = orderItemRepo;
        this.inventoryClient = inventoryClient;
        this.productClient = productClient;
        this.userClient = userClient;
    }

    public List<Order> getAllOrders() {
        return ordRepo.findAll();
    }

    public Optional<Order> getOrderById(Integer id) {
        Optional<Order> order = ordRepo.findById(id);
        order.ifPresent(o -> {
            List<OrderItem> items = orderItemRepo.findByOrderId(o.getId());
        });
        return order;
    }

    @Transactional
    public Order createOrder(Order order) {
        // Set defaults
        if (order.getDate() == null) {
            order.setDate(java.time.LocalDate.now());
        }
        if (order.getStatus() == null) {
            order.setStatus("PENDING");
        }

        // ✅ NEW: Validate user exists
        if (order.getCustomerId() != null && !userClient.userExists(order.getCustomerId())) {
            throw new RuntimeException("User not found with ID: " + order.getCustomerId());
        }

        // Validate and check stock for all items
        if (order.getItems() != null && !order.getItems().isEmpty()) {
            for (Order.OrderItemDTO item : order.getItems()) {

                // ✅ NEW: Validate product exists
                if (!productClient.productExists(item.getProductId())) {
                    throw new RuntimeException("Product not found with ID: " + item.getProductId());
                }

                // Check if product has enough stock
                if (!inventoryClient.hasStock(item.getProductId(), item.getQuantity())) {
                    Integer currentStock = inventoryClient.getStockQuantity(item.getProductId());
                    String productName = productClient.getProductName(item.getProductId());
                    throw new RuntimeException(
                            "Insufficient stock for product '" + productName + "' (ID: " + item.getProductId() + "). " +
                                    "Available: " + currentStock + ", Requested: " + item.getQuantity()
                    );
                }
            }

            // Save order first
            Order savedOrder = ordRepo.save(order);

            // Reduce inventory and save order items
            for (Order.OrderItemDTO item : order.getItems()) {
                // Reduce inventory
                inventoryClient.reduceStock(item.getProductId(), item.getQuantity());

                // Save order item
                OrderItem orderItem = new OrderItem(
                        savedOrder.getId(),
                        item.getProductId(),
                        item.getQuantity(),
                        item.getPrice()
                );
                orderItemRepo.save(orderItem);
            }

            return savedOrder;
        }

        return ordRepo.save(order);
    }

    public Order updateOrder(Integer id, Order order) {
        order.setId(id);
        return ordRepo.save(order);
    }

    @Transactional
    public void deleteOrder(Integer id) {
        List<OrderItem> items = orderItemRepo.findByOrderId(id);

        for (OrderItem item : items) {
            inventoryClient.restoreStock(item.getProductId(), item.getQuantity());
        }

        orderItemRepo.deleteAll(items);
        ordRepo.deleteById(id);
    }

    @Transactional
    public void cancelOrder(Integer id) {
        Order order = ordRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        List<OrderItem> items = orderItemRepo.findByOrderId(id);

        for (OrderItem item : items) {
            inventoryClient.restoreStock(item.getProductId(), item.getQuantity());
        }

        order.setStatus("CANCELLED");
        ordRepo.save(order);
    }
}
