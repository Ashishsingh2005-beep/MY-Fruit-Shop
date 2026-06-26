import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyOrders, updateProfile } from '../services/api';
import { useNavigate } from 'react-router-dom';
import LoginModal from '../components/LoginModal';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  'Processing': 'var(--warning)', 'Confirmed': 'var(--info)', 'Preparing': 'var(--info)',
  'Out for Delivery': 'var(--purple)', 'Delivered': 'var(--success)', 'Cancelled': 'var(--danger)'
};

export default function Profile() {
  const { user, isLoggedIn, updateUser } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(!isLoggedIn);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', address: user?.address || '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      setShowLogin(false);
      loadOrders();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', email: user.email || '', address: user.address || '' });
    }
  }, [user]);

  const loadOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await getMyOrders();
      setOrders(res.data.orders);
    } catch { } finally { setOrdersLoading(false); }
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const res = await updateProfile(form);
      updateUser(res.data.user);
      setEditMode(false);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  if (!isLoggedIn) return (
    <>
      <div className="page" style={{ textAlign: 'center', paddingTop: '5rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
        <h2>Login to view your profile</h2>
        <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => setShowLogin(true)}>Login / Sign Up</button>
      </div>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );

  return (
    <div className="page">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '2rem', alignItems: 'start' }}>
          {/* Profile Card */}
          <div>
            <div className="card" style={{ padding: '2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1rem' }}>
                {user?.name?.charAt(0)?.toUpperCase() || '👤'}
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{user?.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>📱 {user?.phone}</p>
              {user?.email && <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>📧 {user.email}</p>}
              <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--primary)' }}>{user?.totalOrders || 0}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Orders</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--success)' }}>₹{user?.totalSpent || 0}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Spent</div>
                </div>
              </div>
              <button className="btn btn-outline" style={{ width: '100%', marginTop: '1.5rem' }} onClick={() => setEditMode(e => !e)}>
                {editMode ? 'Cancel' : '✏️ Edit Profile'}
              </button>
            </div>

            {editMode && (
              <div className="card" style={{ padding: '1.5rem' }}>
                <h4 style={{ marginBottom: '1rem' }}>Edit Profile</h4>
                {['name', 'email', 'address'].map(field => (
                  <div key={field} style={{ marginBottom: '0.75rem' }}>
                    <label className="input-label" style={{ textTransform: 'capitalize' }}>{field}</label>
                    <input className="input" value={form[field]} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))} placeholder={`Your ${field}`} />
                  </div>
                ))}
                <button className="btn btn-primary" style={{ width: '100%' }} onClick={saveProfile} disabled={saving}>
                  {saving ? 'Saving...' : '💾 Save Changes'}
                </button>
              </div>
            )}
          </div>

          {/* Orders */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem' }}>📦 My Orders</h2>
              <button className="btn btn-ghost" style={{ fontSize: '0.85rem' }} onClick={loadOrders}>↻ Refresh</button>
            </div>

            {ordersLoading ? (
              <div className="spinner" />
            ) : orders.length === 0 ? (
              <div className="empty-state">
                <div className="icon">📦</div>
                <h3>No orders yet</h3>
                <p>Start shopping to see your orders here!</p>
                <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/products')}>Shop Now</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {orders.map(order => (
                  <div key={order._id} className="card" style={{ padding: '1.25rem', cursor: 'pointer', transition: 'var(--transition)' }}
                    onClick={() => navigate(`/orders/${order._id}`)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>#{order.orderId}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span style={{ padding: '3px 10px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 600, background: `${STATUS_COLORS[order.delivery?.status]}22`, color: STATUS_COLORS[order.delivery?.status] }}>
                          {order.delivery?.status}
                        </span>
                        <span style={{ fontWeight: 800, color: 'var(--primary)' }}>₹{order.pricing?.total}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {order.items?.slice(0, 3).map(i => `${i.emoji || '🍎'} ${i.name}`).join(' • ')}
                      {order.items?.length > 3 && ` +${order.items.length - 3} more`}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
