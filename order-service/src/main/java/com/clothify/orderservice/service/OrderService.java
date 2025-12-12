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

            orderItemRepo.findByOrderId(o.getId());
        });
        return order;
    }

    @Transactional
    public Order createOrder(Order order) {

        if (order.getDate() == null) {
            order.setDate(java.time.LocalDate.now());
        }
        if (order.getStatus() == null) {
            order.setStatus("PENDING");
        }

        if (order.getCustomerId() != null && !userClient.userExists(order.getCustomerId())) {
            throw new RuntimeException("User not found with ID: " + order.getCustomerId());
        }

        if (order.getItems() != null && !order.getItems().isEmpty()) {
            for (Order.OrderItemDTO item : order.getItems()) {

                if (!productClient.productExists(item.getProductId())) {
                    throw new RuntimeException("Product not found with ID: " + item.getProductId());
                }

                if (!inventoryClient.hasStock(item.getProductId(), item.getQuantity())) {
                    Integer currentStock = inventoryClient.getStockQuantity(item.getProductId());
                    String productName = productClient.getProductName(item.getProductId());
                    throw new RuntimeException(
                            "Insufficient stock for product '" + productName + "' (ID: " + item.getProductId() + "). " +
                                    "Available: " + currentStock + ", Requested: " + item.getQuantity());
                }
            }

            Order savedOrder = ordRepo.save(order);

            for (Order.OrderItemDTO item : order.getItems()) {

                inventoryClient.reduceStock(item.getProductId(), item.getQuantity());

                OrderItem orderItem = new OrderItem(
                        savedOrder.getId(),
                        item.getProductId(),
                        item.getQuantity(),
                        item.getPrice());
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
