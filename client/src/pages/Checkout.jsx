import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { placeOrder } from '../services/api';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { cart, subtotal, deliveryFee, discount, total, coupon, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState(user?.address || '');
  const [payMethod, setPayMethod] = useState('COD');
  const [placing, setPlacing] = useState(false);

  const handlePlaceOrder = async () => {
    if (!address.trim()) return toast.error('Please enter delivery address');
    if (cart.length === 0) return toast.error('Cart is empty');

    setPlacing(true);
    try {
      const orderData = {
        items: cart.map(i => ({ productId: i._id, name: i.name, qty: i.qty })),
        pricing: { subtotal, deliveryFee, discount, couponCode: coupon?.code, total },
        payment: { method: payMethod },
        userAddress: address
      };
      const res = await placeOrder(orderData);
      clearCart();
      toast.success('🎉 Order placed successfully!');
      navigate(`/orders/${res.data.order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 860 }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>📋 Checkout</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'start' }}>
          <div>
            {/* Delivery Address */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h3 style={{ marginBottom: '1.25rem' }}>📍 Delivery Address</h3>
              <div style={{ marginBottom: '0.75rem' }}>
                <label className="input-label">Full Name</label>
                <input className="input" value={user?.name || ''} readOnly style={{ background: 'rgba(255,255,255,0.03)' }} />
              </div>
              <div style={{ marginBottom: '0.75rem' }}>
                <label className="input-label">Phone</label>
                <input className="input" value={user?.phone || ''} readOnly style={{ background: 'rgba(255,255,255,0.03)' }} />
              </div>
              <div>
                <label className="input-label">Delivery Address *</label>
                <textarea className="input" value={address} onChange={e => setAddress(e.target.value)} rows={3} placeholder="House no, Street, Area, City..." style={{ resize: 'vertical' }} />
              </div>
            </div>

            {/* Payment Method */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '1.25rem' }}>💳 Payment Method</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { id: 'COD', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when you receive' },
                  { id: 'UPI', label: 'UPI Payment', icon: '📱', desc: 'GPay, PhonePe, Paytm' },
                ].map(m => (
                  <label key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: 'var(--radius-sm)', border: `1px solid ${payMethod === m.id ? 'var(--primary)' : 'var(--border)'}`, cursor: 'pointer', background: payMethod === m.id ? 'rgba(212,175,55,0.05)' : 'transparent', transition: 'var(--transition)' }}>
                    <input type="radio" value={m.id} checked={payMethod === m.id} onChange={() => setPayMethod(m.id)} style={{ accentColor: 'var(--primary)' }} />
                    <span style={{ fontSize: '1.5rem' }}>{m.icon}</span>
                    <div>
                      <div style={{ fontWeight: 600 }}>{m.label}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{m.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1.25rem' }}>🧾 Order Summary</h3>

            {/* Items */}
            <div style={{ maxHeight: 200, overflowY: 'auto', marginBottom: '1rem' }}>
              {cart.map(item => (
                <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{item.emoji} {item.name} ×{item.qty}</span>
                  <span>₹{(item.dynamicPrice || item.price) * item.qty}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
              {[['Subtotal', `₹${subtotal}`], ['Delivery', deliveryFee === 0 ? 'FREE 🎉' : `₹${deliveryFee}`], ...(discount ? [['Discount', `-₹${discount}`]] : [])].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <span>{l}</span><span style={{ color: l === 'Discount' ? 'var(--success)' : 'var(--text)' }}>{v}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.2rem', borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                <span>Total</span><span style={{ color: 'var(--primary)' }}>₹{total}</span>
              </div>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', padding: '1rem', fontSize: '1.05rem' }} onClick={handlePlaceOrder} disabled={placing}>
              {placing ? '⏳ Placing Order...' : `✅ Place Order • ₹${total}`}
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.75rem' }}>
              🔒 Secure checkout • ✅ 100% Fresh Guarantee
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
