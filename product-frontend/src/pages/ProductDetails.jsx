import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductById } from '../api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function ProductDetails() {
  const { pid } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    getProductById(pid)
      .then((data) => { if (mounted) setProduct(data); })
      .catch((err) => { if (mounted) setError(err.message); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [pid]);

  const handleAddToCart = () => {
    if (!isAuthenticated()) {
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    addToCart(product, 1);
    window.dispatchEvent(new CustomEvent('toggle-cart'));
  };

  if (loading) return <div className="container"><p>Loading product…</p></div>;
  if (error) return <div className="container"><p className="error">Error: {error}</p></div>;
  if (!product) return <div className="container"><p>Product not found.</p></div>;

  return (
    <div className="container" style={{ paddingTop: 20 }}>
      <Link to="/" style={{ textDecoration: 'none', color: '#0f6cff' }}>← Back to products</Link>

      <div className="product-details-grid">
        <div className="product-image-container">
          <img
            src={product.imageUrl || 'https://via.placeholder.com/600x600?text=No+Image'}
            alt={product.name}
            className="product-image"
          />
        </div>

        <div className="product-info">
          <h2 className="product-title">{product.name}</h2>
          <p className="product-desc">{product.description}</p>

          <div className="product-meta">
            <strong>Brand:</strong> {product.brand || '—'}
          </div>

          <div style={{ marginTop: 8 }}>
            <strong>Category:</strong> {product.category || '—'}
          </div>

          <div className="product-price-row">
            <div className="product-price">Rs {Number(product.price).toLocaleString()}</div>
            <button className="btn" onClick={handleAddToCart}>Add to cart</button>
          </div>

          <div style={{ marginTop: 16 }}>
            <strong>Available sizes:</strong> {product.sizes || '—'}
          </div>

          <div style={{ marginTop: 8 }}>
            <strong>Colors:</strong> {product.colors || '—'}
          </div>

          <div style={{ marginTop: 8 }}>
            <strong>Stock:</strong> {typeof product.stockQuantity === 'number' ? product.stockQuantity : '—'}
          </div>
        </div>
      </div>
    </div>
  );
}
