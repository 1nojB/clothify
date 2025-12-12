import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllProducts, fetchAllOrders, fetchAllUsers } from '../../api';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalRevenue: 0,
        pendingOrders: 0,
    });
    const [loading, setLoading] = useState(true);
    const [recentOrders, setRecentOrders] = useState([]);

    useEffect(() => {
        loadDashboardData();
    }, []);

    async function loadDashboardData() {
        setLoading(true);
        try {
            const [products, orders, users] = await Promise.all([
                fetchAllProducts().catch(() => []),
                fetchAllOrders().catch(() => []),
                fetchAllUsers().catch(() => []),
            ]);

            const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
            const pendingOrders = orders.filter(o => o.status === 'PENDING').length;

            setStats({
                totalProducts: products.length,
                totalOrders: orders.length,
                totalUsers: users.length,
                totalRevenue,
                pendingOrders,
            });

            setRecentOrders(orders.slice(0, 5));
        } catch (err) {
            console.error('Failed to load dashboard data:', err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <h1>Admin Dashboard</h1>
                <p className="admin-subtitle">Manage your e-commerce platform</p>
            </div>

            
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#3b82f6' }}>📦</div>
                    <div className="stat-content">
                        <div className="stat-label">Total Products</div>
                        <div className="stat-value">{loading ? '...' : stats.totalProducts}</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#10b981' }}>🛒</div>
                    <div className="stat-content">
                        <div className="stat-label">Total Orders</div>
                        <div className="stat-value">{loading ? '...' : stats.totalOrders}</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#f59e0b' }}>👥</div>
                    <div className="stat-content">
                        <div className="stat-label">Total Users</div>
                        <div className="stat-value">{loading ? '...' : stats.totalUsers}</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#8b5cf6' }}>💰</div>
                    <div className="stat-content">
                        <div className="stat-label">Total Revenue</div>
                        <div className="stat-value">Rs {loading ? '...' : stats.totalRevenue.toLocaleString()}</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#ef4444' }}>⏳</div>
                    <div className="stat-content">
                        <div className="stat-label">Pending Orders</div>
                        <div className="stat-value">{loading ? '...' : stats.pendingOrders}</div>
                    </div>
                </div>
            </div>

            
            <div className="admin-section">
                <h2 className="section-title">Quick Actions</h2>
                <div className="quick-actions">
                    <Link to="/admin/products" className="action-card">
                        <div className="action-icon">📦</div>
                        <h3>Manage Products</h3>
                        <p>Add, edit, or remove products</p>
                    </Link>

                    <Link to="/admin/orders" className="action-card">
                        <div className="action-icon">🛒</div>
                        <h3>Manage Orders</h3>
                        <p>View and update order status</p>
                    </Link>

                    <Link to="/admin/users" className="action-card">
                        <div className="action-icon">👥</div>
                        <h3>View Users</h3>
                        <p>See all registered customers</p>
                    </Link>

                    <Link to="/admin/inventory" className="action-card">
                        <div className="action-icon">📊</div>
                        <h3>Inventory</h3>
                        <p>Track stock levels</p>
                    </Link>
                </div>
            </div>

            
            <div className="admin-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h2 className="section-title">Recent Orders</h2>
                    <Link to="/admin/orders" className="view-all-link">View All →</Link>
                </div>

                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: 24 }}>Loading...</td>
                                </tr>
                            ) : recentOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: 24 }}>No orders yet</td>
                                </tr>
                            ) : (
                                recentOrders.map(order => (
                                    <tr key={order.id}>
                                        <td>#{order.id}</td>
                                        <td>{order.name || order.customerId || 'N/A'}</td>
                                        <td>{order.date || 'N/A'}</td>
                                        <td>Rs {order.total ? order.total.toLocaleString() : '0'}</td>
                                        <td>
                                            <span className={`status-badge status-${order.status?.toLowerCase() || 'pending'}`}>
                                                {order.status || 'PENDING'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
