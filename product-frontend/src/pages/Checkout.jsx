import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../api';

export default function Checkout() {
    const navigate = useNavigate();
    const { items, totalAmount, clearCart } = useCart();
    const { user, isAuthenticated } = useAuth();

    const [formData, setFormData] = useState({
        fullName: user?.name || '',
        email: user?.email || '',
        phone: '',
        address: '',
        city: '',
        zipCode: '',
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    React.useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login?redirect=/checkout');
        }
    }, [isAuthenticated, navigate]);

    React.useEffect(() => {
        if (items.length === 0) {
            navigate('/');
        }
    }, [items, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const formatCardNumber = (value) => {
        const cleaned = value.replace(/\s/g, '');
        const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
        return formatted.substring(0, 19); // 16 digits + 3 spaces
    };

    const formatExpiryDate = (value) => {
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length >= 2) {
            return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
        }
        return cleaned;
    };

    const handleCardNumberChange = (e) => {
        const formatted = formatCardNumber(e.target.value);
        setFormData(prev => ({ ...prev, cardNumber: formatted }));
    };

    const handleExpiryChange = (e) => {
        const formatted = formatExpiryDate(e.target.value);
        setFormData(prev => ({ ...prev, expiryDate: formatted }));
    };

    const validateForm = () => {
        if (!formData.fullName || !formData.email || !formData.phone) {
            setError('Please fill in all contact information');
            return false;
        }
        if (!formData.address || !formData.city || !formData.zipCode) {
            setError('Please fill in all shipping information');
            return false;
        }
        if (!formData.cardNumber || !formData.cardName || !formData.expiryDate || !formData.cvv) {
            setError('Please fill in all payment information');
            return false;
        }

        const cardDigits = formData.cardNumber.replace(/\s/g, '');
        if (cardDigits.length !== 16) {
            setError('Card number must be 16 digits');
            return false;
        }

        if (formData.cvv.length < 3 || formData.cvv.length > 4) {
            setError('CVV must be 3 or 4 digits');
            return false;
        }

        const [month, year] = formData.expiryDate.split('/');
        if (!month || !year || parseInt(month) < 1 || parseInt(month) > 12) {
            setError('Invalid expiry date');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError('');

        try {
            const orderData = {
                userId: user?.id || user?.userId || 1,
                customerId: user?.id || user?.userId || 1,
                name: formData.fullName,
                items: items.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price,
                })),
                total: totalAmount,
                paymentMethod: 'CARD'
            };

            console.log('Submitting order:', orderData);

            const order = await createOrder(orderData);

            console.log('Order created:', order);

            clearCart();

            navigate(`/order-success/${order.id}`);

        } catch (err) {
            console.error('Order creation failed:', err);
            setError(err.message || 'Failed to create order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getCardType = (cardNumber) => {
        const cleaned = cardNumber.replace(/\s/g, '');
        if (cleaned.startsWith('4')) return 'Visa';
        if (cleaned.startsWith('5')) return 'Mastercard';
        if (cleaned.startsWith('3')) return 'Amex';
        return 'Unknown';
    };

    if (items.length === 0) {
        return null; // Will redirect
    }

    return (
        <div className="checkout-page">
            <div className="container" style={{ maxWidth: 1200, paddingTop: 20 }}>
                <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 24 }}>Checkout</h1>

                <div className="checkout-grid">
                    
                    <div className="checkout-forms">
                        <form onSubmit={handleSubmit}>
                            
                            <section className="checkout-section">
                                <h2 className="checkout-section-title">Contact Information</h2>
                                <div className="checkout-fields">
                                    <div className="field">
                                        <label className="field-label">Full Name *</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            className="field-input"
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>

                                    <div className="field">
                                        <label className="field-label">Email *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="field-input"
                                            placeholder="john@example.com"
                                            required
                                        />
                                    </div>

                                    <div className="field">
                                        <label className="field-label">Phone *</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="field-input"
                                            placeholder="+91 98765 43210"
                                            required
                                        />
                                    </div>
                                </div>
                            </section>

                            
                            <section className="checkout-section">
                                <h2 className="checkout-section-title">Shipping Address</h2>
                                <div className="checkout-fields">
                                    <div className="field" style={{ gridColumn: '1 / -1' }}>
                                        <label className="field-label">Address *</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            className="field-input"
                                            placeholder="123 Main Street, Apartment 4B"
                                            required
                                        />
                                    </div>

                                    <div className="field">
                                        <label className="field-label">City *</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className="field-input"
                                            placeholder="Mumbai"
                                            required
                                        />
                                    </div>

                                    <div className="field">
                                        <label className="field-label">ZIP Code *</label>
                                        <input
                                            type="text"
                                            name="zipCode"
                                            value={formData.zipCode}
                                            onChange={handleChange}
                                            className="field-input"
                                            placeholder="400001"
                                            required
                                        />
                                    </div>
                                </div>
                            </section>

                            
                            <section className="checkout-section">
                                <h2 className="checkout-section-title">Payment Information</h2>
                                <div className="checkout-fields">
                                    <div className="field" style={{ gridColumn: '1 / -1' }}>
                                        <label className="field-label">Card Number *</label>
                                        <input
                                            type="text"
                                            name="cardNumber"
                                            value={formData.cardNumber}
                                            onChange={handleCardNumberChange}
                                            className="field-input"
                                            placeholder="1234 5678 9012 3456"
                                            maxLength="19"
                                            required
                                        />
                                    </div>

                                    <div className="field" style={{ gridColumn: '1 / -1' }}>
                                        <label className="field-label">Cardholder Name *</label>
                                        <input
                                            type="text"
                                            name="cardName"
                                            value={formData.cardName}
                                            onChange={handleChange}
                                            className="field-input"
                                            placeholder="JOHN DOE"
                                            required
                                        />
                                    </div>

                                    <div className="field">
                                        <label className="field-label">Expiry Date *</label>
                                        <input
                                            type="text"
                                            name="expiryDate"
                                            value={formData.expiryDate}
                                            onChange={handleExpiryChange}
                                            className="field-input"
                                            placeholder="MM/YY"
                                            maxLength="5"
                                            required
                                        />
                                    </div>

                                    <div className="field">
                                        <label className="field-label">CVV *</label>
                                        <input
                                            type="text"
                                            name="cvv"
                                            value={formData.cvv}
                                            onChange={handleChange}
                                            className="field-input"
                                            placeholder="123"
                                            maxLength="4"
                                            required
                                        />
                                    </div>
                                </div>
                            </section>

                            {error && <div className="error" style={{ marginTop: 16 }}>{error}</div>}

                            <button
                                type="submit"
                                className="btn primary"
                                disabled={loading}
                                style={{ width: '100%', marginTop: 24, padding: '14px 24px', fontSize: 16 }}
                            >
                                {loading ? 'Processing...' : `Place Order - Rs ${totalAmount.toLocaleString()}`}
                            </button>
                        </form>
                    </div>

                    
                    <div className="checkout-summary">
                        <div className="summary-card">
                            <h2 className="summary-title">Order Summary</h2>

                            <div className="summary-items">
                                {items.map(item => (
                                    <div key={item.id} className="summary-item">
                                        <img
                                            src={item.imageUrl || '/images/products/placeholder.png'}
                                            alt={item.name}
                                            className="summary-item-image"
                                        />
                                        <div className="summary-item-details">
                                            <h3 className="summary-item-name">{item.name}</h3>
                                            <p className="summary-item-qty">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="summary-item-price">
                                            Rs {(item.price * item.quantity).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="summary-divider"></div>

                            <div className="summary-totals">
                                <div className="summary-row">
                                    <span>Subtotal</span>
                                    <span>Rs {totalAmount.toLocaleString()}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Shipping</span>
                                    <span className="text-success">Free</span>
                                </div>
                                <div className="summary-divider"></div>
                                <div className="summary-row summary-total">
                                    <span>Total</span>
                                    <span>Rs {totalAmount.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
