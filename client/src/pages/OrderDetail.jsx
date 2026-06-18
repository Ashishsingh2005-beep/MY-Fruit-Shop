import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrder, cancelOrder, fileComplaint } from '../services/api';
import toast from 'react-hot-toast';

const STEPS = ['Processing', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];
const STEP_ICONS = ['⏳', '✅', '👨‍🍳', '🛵', '📦'];

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showComplaint, setShowComplaint] = useState(false);
  const [complaint, setComplaint] = useState({ type: 'Delivery', description: '' });
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getOrder(id);
        setOrder(res.data.order);
      } catch { toast.error('Order not found'); navigate('/profile'); }
      finally { setLoading(false); }
    };
    load();
    const interval = setInterval(load, 15000); // Auto-refresh every 15s
    return () => clearInterval(interval);
  }, [id]);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await cancelOrder(id);
      toast.success('Order cancelled');
      const res = await getOrder(id);
      setOrder(res.data.order);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot cancel order');
    } finally { setCancelling(false); }
  };

  const handleComplaint = async () => {
    if (!complaint.description.trim()) return toast.error('Please describe the issue');
    try {
      await fileComplaint(id, complaint);
      toast.success('Complaint filed! We will contact you within 24 hours. 🙏');
      setShowComplaint(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  if (loading) return <div className="spinner" style={{ marginTop: '5rem' }} />;
  if (!order) return null;

  const currentStep = STEPS.indexOf(order.delivery?.status);
  const isCancelled = order.delivery?.status === 'Cancelled';

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 800 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <button className="btn btn-ghost" onClick={() => navigate('/profile')}>← Back</button>
          <div>
            <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Order #{order.orderId}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
              {new Date(order.createdAt).toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* ─── Tracking Progress ─── */}
        {!isCancelled && (
          <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '2rem' }}>🚚 Live Tracking</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 20, left: '10%', right: '10%', height: 3, background: 'var(--border)', borderRadius: 2 }}>
                <div style={{ height: '100%', background: 'linear-gradient(90deg, var(--success), var(--primary))', width: `${(currentStep / (STEPS.length - 1)) * 100}%`, transition: 'width 0.5s ease', borderRadius: 2 }} />
              </div>
              {STEPS.map((step, i) => (
                <div key={step} style={{ textAlign: 'center', zIndex: 1, flex: 1 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: '50%', margin: '0 auto 0.5rem',
                    background: i <= currentStep ? 'linear-gradient(135deg, var(--success), #059669)' : 'var(--bg-card-2)',
                    border: `2px solid ${i <= currentStep ? 'var(--success)' : 'var(--border)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.1rem', transition: 'all 0.4s ease',
                    boxShadow: i === currentStep ? '0 0 16px rgba(16,185,129,0.5)' : 'none'
                  }}>
                    {STEP_ICONS[i]}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: i <= currentStep ? 'var(--text)' : 'var(--text-dim)', fontWeight: i === currentStep ? 700 : 400 }}>{step}</div>
                </div>
              ))}
            </div>

            {order.delivery?.status === 'Out for Delivery' && (
              <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(217,70,239,0.08)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(217,70,239,0.2)' }}>
                <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>🛵 Delivery Person</div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  {order.delivery?.deliveryPerson?.name} • 📞 {order.delivery?.deliveryPerson?.phone}<br />
                  <span style={{ fontSize: '0.8rem' }}>{order.delivery?.deliveryPerson?.vehicle}</span>
                </p>
              </div>
            )}
          </div>
        )}

        {isCancelled && (
          <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', borderColor: 'var(--danger)', background: 'rgba(239,68,68,0.05)' }}>
            <h3 style={{ color: 'var(--danger)' }}>❌ Order Cancelled</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Payment Status: <strong>{order.payment?.status}</strong>
            </p>
          </div>
        )}

        {/* ─── Order Items ─── */}
        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>🛒 Order Items</h3>
          {order.items?.map(item => (
            <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border)', fontSize: '0.9rem' }}>
              <span>{item.emoji || '🍎'} {item.name} × {item.qty}</span>
              <span style={{ fontWeight: 600 }}>₹{item.subtotal}</span>
            </div>
          ))}
          <div style={{ padding: '1rem 0 0', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.05rem' }}>
            <span>Total Paid</span>
            <span style={{ color: 'var(--primary)' }}>₹{order.pricing?.total}</span>
          </div>
        </div>

        {/* ─── Actions ─── */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {!['Delivered', 'Cancelled', 'Out for Delivery'].includes(order.delivery?.status) && (
            <button className="btn btn-danger" onClick={handleCancel} disabled={cancelling} style={{ flex: 1 }}>
              {cancelling ? 'Cancelling...' : '❌ Cancel Order'}
            </button>
          )}
          {order.delivery?.status === 'Delivered' && !order.complaint?.description && (
            <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowComplaint(true)}>
              📢 Report Issue
            </button>
          )}
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => navigate('/products')}>
            🛒 Order Again
          </button>
        </div>

        {/* ─── Complaint Modal ─── */}
        {showComplaint && (
          <div className="modal-overlay" onClick={() => setShowComplaint(false)}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
              <h3 style={{ marginBottom: '1.25rem' }}>📢 Report an Issue</h3>
              <label className="input-label">Issue Type</label>
              <select className="input" style={{ marginBottom: '0.75rem' }} value={complaint.type} onChange={e => setComplaint(p => ({ ...p, type: e.target.value }))}>
                <option>Delivery</option>
                <option>Product</option>
                <option>Other</option>
              </select>
              <label className="input-label">Description</label>
              <textarea className="input" rows={4} placeholder="Describe your issue..." value={complaint.description} onChange={e => setComplaint(p => ({ ...p, description: e.target.value }))} style={{ marginBottom: '1rem' }} />
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowComplaint(false)}>Cancel</button>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleComplaint}>Submit</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
