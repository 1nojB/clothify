// src/pages/OrderSuccess.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../api';

export default function OrderSuccess() {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (orderId) {
            getOrderById(orderId)
                .then(data => setOrder(data))
                .catch(err => console.error('Failed to fetch order:', err))
                .finally(() => setLoading(false));
        }
    }, [orderId]);

    if (loading) {
        return (
            <div className="container" style={{ paddingTop: 60, textAlign: 'center' }}>
                <p>Loading order details...</p>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: 60, maxWidth: 600, textAlign: 'center' }}>
            <div className="success-icon" style={{ fontSize: 64, marginBottom: 24 }}>✅</div>

            <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 16 }}>
                Order Placed Successfully!
            </h1>

            <p style={{ fontSize: 18, color: 'var(--muted)', marginBottom: 32 }}>
                Thank you for your order. We've received your order and will process it shortly.
            </p>

            {order && (
                <div className="order-details-card" style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border)',
                    borderRadius: 12,
                    padding: 24,
                    marginBottom: 32,
                    textAlign: 'left'
                }}>
                    <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Order Details</h2>

                    <div style={{ display: 'grid', gap: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--muted)' }}>Order ID:</span>
                            <strong>#{order.id}</strong>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--muted)' }}>Date:</span>
                            <strong>{order.date || new Date().toLocaleDateString()}</strong>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--muted)' }}>Status:</span>
                            <span className="badge" style={{
                                background: '#10b981',
                                color: 'white',
                                padding: '4px 12px',
                                borderRadius: 6,
                                fontSize: 14,
                                fontWeight: 600
                            }}>
                                {order.status || 'PENDING'}
                            </span>
                        </div>

                        {order.total && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                                <span style={{ fontSize: 18, fontWeight: 600 }}>Total:</span>
                                <strong style={{ fontSize: 18 }}>Rs {Number(order.total).toLocaleString()}</strong>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <Link to="/" className="btn primary">
                    Continue Shopping
                </Link>
                {order && (
                    <Link to={`/orders/${order.id}`} className="btn ghost">
                        View Order Details
                    </Link>
                )}
            </div>

            <p style={{ marginTop: 32, fontSize: 14, color: 'var(--muted)' }}>
                A confirmation email has been sent to your email address.
            </p>
        </div>
    );
}
