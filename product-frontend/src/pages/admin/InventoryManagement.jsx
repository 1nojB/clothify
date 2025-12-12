import React, { useState, useEffect } from 'react';
import { fetchAllProducts, fetchAllInventory, updateInventory } from '../../api';

export default function InventoryManagement() {
    const [products, setProducts] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        setLoading(true);
        try {
            const [productsData, inventoryData] = await Promise.all([
                fetchAllProducts().catch(() => []),
                fetchAllInventory().catch(() => []),
            ]);
            setProducts(productsData);
            setInventory(inventoryData);
        } catch (err) {
            console.error('Failed to load inventory:', err);
        } finally {
            setLoading(false);
        }
    }

    async function handleUpdateStock(productId, newQuantity) {
        try {
            await updateInventory(productId, newQuantity);
            alert('Inventory updated successfully');
            loadData();
        } catch (err) {
            console.error('Failed to update inventory:', err);
            alert('Failed to update inventory');
        }
    }

    const mergedData = products.map(product => {
        const inv = inventory.find(i => i.productId === product.pid);
        return {
            ...product,
            inventoryQuantity: inv?.quantity || product.stockQuantity || 0,
        };
    });

    return (
        <div className="admin-page">
            <div className="admin-header">
                <div>
                    <h1>Inventory Management</h1>
                    <p className="admin-subtitle">Track and manage stock levels</p>
                </div>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Product ID</th>
                            <th>Product Name</th>
                            <th>Category</th>
                            <th>Current Stock</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: 24 }}>Loading...</td>
                            </tr>
                        ) : mergedData.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: 24 }}>No inventory data</td>
                            </tr>
                        ) : (
                            mergedData.map(item => {
                                const stock = item.inventoryQuantity;
                                const status = stock === 0 ? 'Out of Stock' : stock < 10 ? 'Low Stock' : 'In Stock';
                                const statusClass = stock === 0 ? 'danger' : stock < 10 ? 'warning' : 'success';

                                return (
                                    <tr key={item.pid}>
                                        <td>{item.pid}</td>
                                        <td>{item.name}</td>
                                        <td>{item.category || '—'}</td>
                                        <td>{stock}</td>
                                        <td>
                                            <span className={`status-badge status-${statusClass}`}>
                                                {status}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn-small"
                                                onClick={() => {
                                                    const newQty = prompt('Enter new quantity:', stock);
                                                    if (newQty !== null) {
                                                        handleUpdateStock(item.pid, parseInt(newQty));
                                                    }
                                                }}
                                            >
                                                Update Stock
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            
            <div className="order-stats" style={{ marginTop: 32, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                <div className="stat-mini">
                    <div className="stat-mini-label">Total Products</div>
                    <div className="stat-mini-value">{mergedData.length}</div>
                </div>
                <div className="stat-mini">
                    <div className="stat-mini-label">In Stock</div>
                    <div className="stat-mini-value">{mergedData.filter(i => i.inventoryQuantity > 10).length}</div>
                </div>
                <div className="stat-mini">
                    <div className="stat-mini-label">Low Stock</div>
                    <div className="stat-mini-value">{mergedData.filter(i => i.inventoryQuantity > 0 && i.inventoryQuantity < 10).length}</div>
                </div>
                <div className="stat-mini">
                    <div className="stat-mini-label">Out of Stock</div>
                    <div className="stat-mini-value">{mergedData.filter(i => i.inventoryQuantity === 0).length}</div>
                </div>
            </div>
        </div>
    );
}
