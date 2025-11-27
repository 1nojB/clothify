import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { count } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const [query, setQuery] = useState('');

  function onSearch(e) {
    e.preventDefault();
    const q = (query || '').trim();
    window.dispatchEvent(new CustomEvent('product-search', { detail: q }));
  }

  function onToggleCart(e) {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('toggle-cart'));
  }

  function onLogout(e) {
    e.preventDefault();
    logout();
    navigate('/');
  }

  return (
    <header className="nav" role="banner">
      <div className="nav-left">
        <a className="logo" href="/">Clothify</a>
      </div>

      <form className="search" onSubmit={onSearch} role="search" aria-label="Search products">
        <input
          aria-label="Search products"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" aria-label="Submit search">Search</button>
      </form>

      <div className="nav-right" role="region" aria-label="User controls" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {!user ? (
          <>
            <a className="nav-link" href="/login">Login</a>
            <a className="nav-link" href="/register">Register</a>
          </>
        ) : (
          <>
            
            {isAdmin() && (
              <a className="nav-link" href="/admin" style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '6px 12px',
                borderRadius: '6px',
                fontWeight: '600'
              }}>
                Admin
              </a>
            )}
            <span style={{ color: '#0f1724', fontWeight: 600 }}>
              Hi, {user.name || user.email}
            </span>
            <a className="nav-link" href="#logout" onClick={onLogout}>Logout</a>
          </>
        )}

        <a
          className="nav-link"
          href="#cart"
          onClick={onToggleCart}
          aria-label={`Open cart. ${count} items in cart`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
        >
          Cart
          <span
            aria-hidden="true"
            style={{
              background: '#0f6cff',
              color: '#fff',
              borderRadius: 8,
              padding: '2px 8px',
              marginLeft: 4,
              fontWeight: 700,
              fontSize: '0.9rem'
            }}
          >
            {count}
          </span>
        </a>
      </div>
    </header>
  );
}


