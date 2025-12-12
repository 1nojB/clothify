import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { items, totalAmount, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setOpen((prev) => !prev);
    window.addEventListener('toggle-cart', handler);
    return () => window.removeEventListener('toggle-cart', handler);
  }, []);

  function goToCheckout() {
    setOpen(false);
    navigate('/checkout');
  }

  return (
    <>
      {open && (
        <div
          style={{
            position: 'fixed',
            right: 16,
            top: 72,
            width: 360,
            maxHeight: '70vh',
            overflow: 'auto',
            background: '#fff',
            boxShadow: '0 20px 50px rgba(12,20,40,0.2)',
            borderRadius: 12,
            zIndex: 2000,
            padding: 16,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <strong>Cart</strong>
            <button
              onClick={() => setOpen(false)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>

          {items.length === 0 && <div style={{ color: '#6b7280' }}>Your cart is empty.</div>}

          {items.map((it) => (
            <div key={it.id} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
              <img
                src={it.imageUrl}
                alt={it.name}
                style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8 }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700 }}>{it.name}</div>
                <div style={{ color: '#6b7280', fontSize: 13 }}>Rs {Number(it.price).toLocaleString()}</div>
                <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
                  <button onClick={() => updateQuantity(it.id, (it.quantity || 1) - 1)} className="filter-btn">-</button>
                  <div style={{ minWidth: 24, textAlign: 'center' }}>{it.quantity}</div>
                  <button onClick={() => updateQuantity(it.id, (it.quantity || 1) + 1)} className="filter-btn">+</button>
                  <button
                    onClick={() => removeFromCart(it.id)}
                    style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: '#b00020', cursor: 'pointer' }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div style={{ borderTop: '1px solid #eef2f7', paddingTop: 12, marginTop: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ color: '#6b7280' }}>Subtotal</div>
              <div style={{ fontWeight: 700 }}>Rs {Number(totalAmount).toLocaleString()}</div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={goToCheckout}
                className="btn"
                disabled={items.length === 0}
                style={{ flex: 1 }}
              >
                Proceed to Checkout
              </button>
              <button
                onClick={clearCart}
                style={{
                  background: '#fff',
                  border: '1px solid #eef2f7',
                  padding: '8px 12px',
                  borderRadius: 10,
                }}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
