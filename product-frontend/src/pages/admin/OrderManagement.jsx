// src/pages/admin/OrderManagement.jsx
import React, { useState, useEffect } from 'react';
import { fetchAllOrders, updateOrderStatus } from '../../api';

export default function OrderManagement() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        loadOrders();
    }, []);

    async function loadOrders() {
        setLoading(true);
        try {
            const data = await fetchAllOrders();
            setOrders(data);
        } catch (err) {
            console.error('Failed to load orders:', err);
            alert('Failed to load orders');
        } finally {
            setLoading(false);
        }
    }

    async function handleStatusChange(orderId, newStatus) {
        try {
            await updateOrderStatus(orderId, newStatus);
            alert('Order status updated successfully');
            loadOrders();
        } catch (err) {
            console.error('Failed to update order status:', err);
            alert('Failed to update order status');
        }
    }

    const filteredOrders = filter === 'ALL'
        ? orders
        : orders.filter(o => o.status === filter);

    return (
        <div className="admin-page">
            <div className="admin-header">
                <div>
                    <h1>Order Management</h1>
                    <p className="admin-subtitle">View and manage customer orders</p>
                </div>
            </div>

            {/* Filters */}
            <div className="filters" style={{ marginBottom: 24 }}>
                {['ALL', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(status => (
                    <button
                        key={status}
                        className={`filter-btn ${filter === status ? 'active' : ''}`}
                        onClick={() => setFilter(status)}
                    >
                        {status}
                    </button>
                ))}
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Customer ID</th>
                            <th>Date</th>
                            <th>Payment</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="8" style={{ textAlign: 'center', padding: 24 }}>Loading...</td>
                            </tr>
                        ) : filteredOrders.length === 0 ? (
                            <tr>
                                <td colSpan="8" style={{ textAlign: 'center', padding: 24 }}>
                                    No {filter !== 'ALL' ? filter.toLowerCase() : ''} orders found
                                </td>
                            </tr>
                        ) : (
                            filteredOrders.map(order => (
                                <tr key={order.id}>
                                    <td>#{order.id}</td>
                                    <td>{order.name || '—'}</td>
                                    <td>{order.customerId || '—'}</td>
                                    <td>{order.date || '—'}</td>
                                    <td>{order.paymentMethod || '—'}</td>
                                    <td>Rs {order.total ? order.total.toLocaleString() : '0'}</td>
                                    <td>
                                        <span className={`status-badge status-${order.status?.toLowerCase() || 'pending'}`}>
                                            {order.status || 'PENDING'}
                                        </span>
                                    </td>
                                    <td>
                                        <select
                                            className="status-select"
                                            value={order.status || 'PENDING'}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        >
                                            <option value="PENDING">Pending</option>
                                            <option value="PROCESSING">Processing</option>
                                            <option value="SHIPPED">Shipped</option>
                                            <option value="DELIVERED">Delivered</option>
                                            <option value="CANCELLED">Cancelled</option>
                                        </select>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Stats */}
            <div className="order-stats" style={{ marginTop: 32, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                <div className="stat-mini">
                    <div className="stat-mini-label">Total Orders</div>
                    <div className="stat-mini-value">{orders.length}</div>
                </div>
                <div className="stat-mini">
                    <div className="stat-mini-label">Pending</div>
                    <div className="stat-mini-value">{orders.filter(o => o.status === 'PENDING').length}</div>
                </div>
                <div className="stat-mini">
                    <div className="stat-mini-label">Processing</div>
                    <div className="stat-mini-value">{orders.filter(o => o.status === 'PROCESSING').length}</div>
                </div>
                <div className="stat-mini">
                    <div className="stat-mini-label">Shipped</div>
                    <div className="stat-mini-value">{orders.filter(o => o.status === 'SHIPPED').length}</div>
                </div>
                <div className="stat-mini">
                    <div className="stat-mini-label">Delivered</div>
                    <div className="stat-mini-value">{orders.filter(o => o.status === 'DELIVERED').length}</div>
                </div>
                <div className="stat-mini">
                    <div className="stat-mini-label">Total Revenue</div>
                    <div className="stat-mini-value">
                        Rs {orders.reduce((sum, o) => sum + (o.total || 0), 0).toLocaleString()}
                    </div>
                </div>
            </div>
        </div>
    );
}
