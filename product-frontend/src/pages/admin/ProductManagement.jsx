import React, { useState, useEffect } from 'react';
import { fetchAllProducts, createProduct, updateProduct, deleteProduct } from '../../api';

export default function ProductManagement() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        brand: '',
        category: '',
        price: '',
        sizes: '',
        colors: '',
        imageUrl: '',
        stockQuantity: '',
    });

    useEffect(() => {
        loadProducts();
    }, []);

    async function loadProducts() {
        setLoading(true);
        try {
            const data = await fetchAllProducts();
            setProducts(data);
        } catch (err) {
            console.error('Failed to load products:', err);
            alert('Failed to load products');
        } finally {
            setLoading(false);
        }
    }

    function handleAdd() {
        setEditingProduct(null);
        setFormData({
            name: '',
            description: '',
            brand: '',
            category: '',
            price: '',
            sizes: '',
            colors: '',
            imageUrl: '',
            stockQuantity: '',
        });
        setShowModal(true);
    }

    function handleEdit(product) {
        setEditingProduct(product);
        setFormData({
            name: product.name || '',
            description: product.description || '',
            brand: product.brand || '',
            category: product.category || '',
            price: product.price || '',
            sizes: product.sizes || '',
            colors: product.colors || '',
            imageUrl: product.imageUrl || '',
            stockQuantity: product.stockQuantity || '',
        });
        setShowModal(true);
    }

    async function handleDelete(pid) {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            await deleteProduct(pid);
            alert('Product deleted successfully');
            loadProducts();
        } catch (err) {
            console.error('Failed to delete product:', err);
            alert('Failed to delete product');
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const productData = {
            ...formData,
            price: parseFloat(formData.price),
            stockQuantity: parseInt(formData.stockQuantity) || 0,
        };

        try {
            if (editingProduct) {
                await updateProduct(editingProduct.pid, productData);
                alert('Product updated successfully');
            } else {
                await createProduct(productData);
                alert('Product created successfully');
            }
            setShowModal(false);
            loadProducts();
        } catch (err) {
            console.error('Failed to save product:', err);
            alert('Failed to save product: ' + err.message);
        }
    }

    return (
        <div className="admin-page">
            <div className="admin-header">
                <div>
                    <h1>Product Management</h1>
                    <p className="admin-subtitle">Manage your product catalog</p>
                </div>
                <button className="btn primary" onClick={handleAdd}>
                    + Add Product
                </button>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Brand</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="8" style={{ textAlign: 'center', padding: 24 }}>Loading...</td>
                            </tr>
                        ) : products.length === 0 ? (
                            <tr>
                                <td colSpan="8" style={{ textAlign: 'center', padding: 24 }}>No products found</td>
                            </tr>
                        ) : (
                            products.map(product => (
                                <tr key={product.pid}>
                                    <td>{product.pid}</td>
                                    <td>
                                        <img
                                            src={product.imageUrl || '/images/products/placeholder.png'}
                                            alt={product.name}
                                            style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 6 }}
                                        />
                                    </td>
                                    <td>{product.name}</td>
                                    <td>{product.brand || '—'}</td>
                                    <td>{product.category || '—'}</td>
                                    <td>Rs {product.price?.toLocaleString()}</td>
                                    <td>{product.stockQuantity || 0}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <button className="btn-small" onClick={() => handleEdit(product)}>Edit</button>
                                            <button className="btn-small btn-danger" onClick={() => handleDelete(product.pid)}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
                        </div>

                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-grid">
                                <div className="field">
                                    <label className="field-label">Product Name *</label>
                                    <input
                                        type="text"
                                        className="field-input"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="field">
                                    <label className="field-label">Brand</label>
                                    <input
                                        type="text"
                                        className="field-input"
                                        value={formData.brand}
                                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                    />
                                </div>

                                <div className="field">
                                    <label className="field-label">Category</label>
                                    <select
                                        className="field-input"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Men">Men</option>
                                        <option value="Women">Women</option>
                                        <option value="Kids">Kids</option>
                                        <option value="Accessories">Accessories</option>
                                    </select>
                                </div>

                                <div className="field">
                                    <label className="field-label">Price (Rs) *</label>
                                    <input
                                        type="number"
                                        className="field-input"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        required
                                        step="0.01"
                                    />
                                </div>

                                <div className="field">
                                    <label className="field-label">Stock Quantity</label>
                                    <input
                                        type="number"
                                        className="field-input"
                                        value={formData.stockQuantity}
                                        onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                                    />
                                </div>

                                <div className="field">
                                    <label className="field-label">Sizes</label>
                                    <input
                                        type="text"
                                        className="field-input"
                                        value={formData.sizes}
                                        onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                                        placeholder="S, M, L, XL"
                                    />
                                </div>

                                <div className="field">
                                    <label className="field-label">Colors</label>
                                    <input
                                        type="text"
                                        className="field-input"
                                        value={formData.colors}
                                        onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                                        placeholder="Red, Blue, Black"
                                    />
                                </div>

                                <div className="field">
                                    <label className="field-label">Image URL</label>
                                    <input
                                        type="text"
                                        className="field-input"
                                        value={formData.imageUrl}
                                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                        placeholder="/images/products/product.png"
                                    />
                                </div>

                                <div className="field" style={{ gridColumn: '1 / -1' }}>
                                    <label className="field-label">Description</label>
                                    <textarea
                                        className="field-input"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows="3"
                                    />
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn ghost" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn primary">
                                    {editingProduct ? 'Update Product' : 'Create Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
