import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { cart, removeFromCart, updateQty, subtotal, deliveryFee, discount, total, coupon, applyCoupon } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [couponInput, setCouponInput] = React.useState('');

  if (cart.length === 0) return (
    <div className="page">
      <div className="container">
        <div className="empty-state" style={{ paddingTop: '6rem' }}>
          <div className="icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add some fresh fruits and vegetables!</p>
          <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => navigate('/products')}>
            Shop Now →
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="page">
      <div className="container">
        <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>🛒 Your Cart <span style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 400 }}>({cart.length} items)</span></h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'start' }}>
          {/* ─── Cart Items ─── */}
          <div className="card" style={{ padding: '1.5rem' }}>
            {cart.map(item => (
              <div key={item._id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: 64, height: 64, borderRadius: 'var(--radius-sm)', background: `${item.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', flexShrink: 0 }}>
                  {item.emoji || '🍎'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{item.name}</div>
                  <div style={{ color: 'var(--primary)', fontWeight: 700 }}>₹{item.dynamicPrice || item.price}/{item.unit || 'kg'}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button onClick={() => updateQty(item._id, item.qty - 1)} style={{ width: 30, height: 30, borderRadius: '50%', border: '1px solid var(--border)', background: 'none', color: 'var(--text)', cursor: 'pointer', fontSize: '1.1rem' }}>−</button>
                  <span style={{ width: 24, textAlign: 'center', fontWeight: 700 }}>{item.qty}</span>
                  <button onClick={() => updateQty(item._id, item.qty + 1)} style={{ width: 30, height: 30, borderRadius: '50%', border: '1px solid var(--border)', background: 'none', color: 'var(--text)', cursor: 'pointer', fontSize: '1.1rem' }}>+</button>
                </div>
                <div style={{ fontWeight: 700, minWidth: 70, textAlign: 'right' }}>₹{(item.dynamicPrice || item.price) * item.qty}</div>
                <button onClick={() => removeFromCart(item._id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '1.1rem', padding: '0.25rem' }}>🗑</button>
              </div>
            ))}
          </div>

          {/* ─── Order Summary ─── */}
          <div>
            <div className="card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
              <h3 style={{ marginBottom: '1.25rem' }}>Order Summary</h3>

              {[
                ['Subtotal', `₹${subtotal}`],
                ['Delivery', deliveryFee === 0 ? '🎉 FREE' : `₹${deliveryFee}`],
                ...(discount > 0 ? [['Coupon Discount', `-₹${discount}`]] : []),
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                  <span>{label}</span>
                  <span style={{ color: label.includes('Discount') ? 'var(--success)' : label === 'Delivery' && deliveryFee === 0 ? 'var(--success)' : 'var(--text)', fontWeight: 500 }}>{value}</span>
                </div>
              ))}

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.15rem', marginBottom: '1.5rem' }}>
                <span>Total</span>
                <span style={{ color: 'var(--primary)' }}>₹{total}</span>
              </div>

              {subtotal < 499 && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem', background: 'rgba(212,175,55,0.08)', padding: '0.6rem', borderRadius: '8px' }}>Add ₹{499 - subtotal} more for FREE delivery 🚀</p>}

              <button className="btn btn-primary" style={{ width: '100%', padding: '0.9rem', fontSize: '1.05rem' }}
                onClick={() => isLoggedIn ? navigate('/checkout') : navigate('/profile')}>
                {isLoggedIn ? 'Proceed to Checkout →' : '🔐 Login to Checkout'}
              </button>
            </div>

            {/* Coupon */}
            {!coupon && (
              <div className="card" style={{ padding: '1.25rem' }}>
                <h4 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>🎁 Have a Coupon?</h4>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input className="input" placeholder="Enter code" value={couponInput} onChange={e => setCouponInput(e.target.value.toUpperCase())} style={{ flex: 1 }} />
                  <button className="btn btn-outline" onClick={() => applyCoupon(couponInput)}>Apply</button>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>Try: WELCOME50, FRESH30</p>
              </div>
            )}
            {coupon && (
              <div className="card" style={{ padding: '1rem', borderColor: 'var(--success)', background: 'rgba(16,185,129,0.05)' }}>
                <p style={{ color: 'var(--success)', fontWeight: 600 }}>✅ {coupon.code} applied! ₹{coupon.discount} OFF</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
