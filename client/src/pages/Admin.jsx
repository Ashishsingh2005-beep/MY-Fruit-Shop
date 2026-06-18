import { useState, useEffect } from 'react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { adminLogin, getAdminStats, getAnalytics, getAdminOrders, updateOrder, getAdminUsers, banUser, addProduct, deleteProduct, getComplaints, resolveComplaint, getDemandForecast } from '../services/api';
import toast from 'react-hot-toast';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const CHART_OPTS = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { labels: { color: '#94a3b8', font: { family: 'Outfit' } } } },
  scales: { x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } }, y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' }, beginAtZero: true } }
};

export default function Admin() {
  const [authed, setAuthed] = useState(!!sessionStorage.getItem('adminToken'));
  const [password, setPassword] = useState('');
  const [view, setView] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [analytics, setAnalytics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);

  const doLogin = async () => {
    try {
      const res = await adminLogin(password);
      sessionStorage.setItem('adminToken', res.data.token);
      setAuthed(true);
      toast.success('Welcome Admin! 🔓');
    } catch { toast.error('Wrong password!'); }
  };

  useEffect(() => {
    if (!authed) return;
    loadAll();
    const interval = setInterval(loadAll, 30000);
    return () => clearInterval(interval);
  }, [authed]);

  const loadAll = async () => {
    try {
      const [s, a, o, u, c, f] = await Promise.all([
        getAdminStats(), getAnalytics(), getAdminOrders(), getAdminUsers(), getComplaints(), getDemandForecast()
      ]);
      setStats(s.data.stats);
      setAnalytics(a.data.analytics);
      setOrders(o.data.orders);
      setUsers(u.data.users);
      setComplaints(c.data.complaints);
      setForecast(f.data.forecast);
    } catch (err) { console.error(err); }
  };

  if (!authed) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
      <div className="card" style={{ padding: '3rem', width: 380, textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛡️</div>
        <h2 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--primary)', marginBottom: '0.5rem' }}>Admin Access</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>Restricted Area</p>
        <input className="input" type="password" placeholder="Enter admin password" value={password} onChange={e => setPassword(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && doLogin()} style={{ textAlign: 'center', letterSpacing: 4, marginBottom: '1rem' }} />
        <button className="btn btn-primary" style={{ width: '100%' }} onClick={doLogin}>Unlock System 🔓</button>
        <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-dim)' }}>Default: admin123</p>
      </div>
    </div>
  );

  const NAV_ITEMS = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'orders', label: '📦 Orders' },
    { id: 'users', label: '👥 Users' },
    { id: 'products', label: '🍎 Products' },
    { id: 'complaints', label: '📢 Complaints' },
    { id: 'forecast', label: '🔮 AI Forecast' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: 'calc(100vh - 60px)', background: '#000' }}>
      {/* ─── Sidebar ─── */}
      <aside style={{ background: '#0a0a0a', borderRight: '1px solid var(--border)', padding: '1.5rem', position: 'sticky', top: 60, height: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <div style={{ fontFamily: 'Playfair Display, serif', color: 'var(--primary)', fontSize: '1.1rem', textAlign: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
          Control Center 🛡️
        </div>
        {NAV_ITEMS.map(item => (
          <button key={item.id} onClick={() => setView(item.id)} style={{
            padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'Outfit', fontSize: '0.9rem', fontWeight: 500,
            background: view === item.id ? 'rgba(212,175,55,0.12)' : 'transparent',
            color: view === item.id ? 'var(--primary)' : 'var(--text-muted)',
            borderLeft: `3px solid ${view === item.id ? 'var(--primary)' : 'transparent'}`,
            transition: 'var(--transition)'
          }}>
            {item.label}
          </button>
        ))}
        <button onClick={() => { sessionStorage.removeItem('adminToken'); setAuthed(false); }} style={{ marginTop: 'auto', padding: '0.85rem', border: 'none', borderRadius: 'var(--radius-sm)', background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', cursor: 'pointer', fontFamily: 'Outfit', fontWeight: 600 }}>
          🔒 Lock System
        </button>
      </aside>

      {/* ─── Main ─── */}
      <main style={{ padding: '2rem', overflowY: 'auto' }}>
        {/* DASHBOARD VIEW */}
        {view === 'dashboard' && (
          <>
            <h1 style={{ marginBottom: '0.5rem' }}>Dashboard Overview</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Real-time system monitoring</p>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
              {[
                { label: 'Total Revenue', value: `₹${stats.totalRevenue?.toLocaleString('en-IN') || 0}`, color: 'var(--success)', icon: '💰' },
                { label: 'Total Orders', value: stats.totalOrders || 0, color: 'var(--info)', icon: '📦' },
                { label: 'Today\'s Orders', value: stats.todayOrders || 0, color: 'var(--primary)', icon: '⚡' },
                { label: 'Pending Orders', value: stats.pendingOrders || 0, color: 'var(--warning)', icon: '⏳' },
                { label: 'Total Users', value: stats.totalUsers || 0, color: 'var(--purple)', icon: '👥' },
                { label: 'Total Products', value: stats.totalProducts || 0, color: 'var(--danger)', icon: '🍎' },
              ].map(s => (
                <div key={s.label} className="card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{s.label}</div>
                      <div style={{ fontSize: '2rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                    </div>
                    <span style={{ fontSize: '2rem', opacity: 0.3 }}>{s.icon}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts */}
            {analytics && (
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="card" style={{ padding: '1.5rem' }}>
                  <h3 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>📈 Revenue (Last 7 Days)</h3>
                  <div style={{ height: 220 }}>
                    <Line data={{
                      labels: analytics.dailyRevenue?.map(d => d.date),
                      datasets: [{ label: 'Revenue ₹', data: analytics.dailyRevenue?.map(d => d.revenue), borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.08)', fill: true, tension: 0.4, pointBackgroundColor: '#10b981', borderWidth: 2 }]
                    }} options={{ ...CHART_OPTS, plugins: { ...CHART_OPTS.plugins, legend: { display: false } } }} />
                  </div>
                </div>
                <div className="card" style={{ padding: '1.5rem' }}>
                  <h3 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>🍩 Order Status</h3>
                  <div style={{ height: 220 }}>
                    <Doughnut data={{
                      labels: analytics.statusDistribution?.map(s => s._id),
                      datasets: [{ data: analytics.statusDistribution?.map(s => s.count), backgroundColor: ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#d946ef'], borderWidth: 0 }]
                    }} options={{ ...CHART_OPTS, scales: undefined, cutout: '68%' }} />
                  </div>
                </div>
              </div>
            )}

            {analytics && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="card" style={{ padding: '1.5rem' }}>
                  <h3 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>🏆 Top Products by Revenue</h3>
                  <div style={{ height: 220 }}>
                    <Bar data={{
                      labels: analytics.topProducts?.map(p => p._id?.substring(0, 15) + '...'),
                      datasets: [{ label: 'Revenue ₹', data: analytics.topProducts?.map(p => p.revenue), backgroundColor: ['#d4af37', '#10b981', '#3b82f6', '#d946ef', '#f59e0b'], borderRadius: 6 }]
                    }} options={{ ...CHART_OPTS, plugins: { ...CHART_OPTS.plugins, legend: { display: false } } }} />
                  </div>
                </div>
                <div className="card" style={{ padding: '1.5rem' }}>
                  <h3 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>💳 Payment Methods</h3>
                  <div style={{ height: 220 }}>
                    <Doughnut data={{
                      labels: analytics.paymentDistribution?.map(p => p._id),
                      datasets: [{ data: analytics.paymentDistribution?.map(p => p.count), backgroundColor: ['#d4af37', '#3b82f6', '#10b981'], borderWidth: 0 }]
                    }} options={{ ...CHART_OPTS, scales: undefined, cutout: '60%' }} />
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ORDERS VIEW */}
        {view === 'orders' && (
          <>
            <h1 style={{ marginBottom: '2rem' }}>📦 All Orders</h1>
            <div className="card" style={{ padding: '1.5rem' }}>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Payment</th><th>Delivery</th><th>Actions</th></tr></thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o._id}>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-muted)' }}>#{o.orderId?.substring(0, 16)}</td>
                        <td><div style={{ fontWeight: 600 }}>{o.userName || o.user?.name}</div><div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{o.userPhone}</div></td>
                        <td style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{o.pricing?.total}</td>
                        <td><select value={o.payment?.status} onChange={async e => { await updateOrder(o._id, { paymentStatus: e.target.value }); loadAll(); }} style={{ background: '#111', color: '#fff', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 8px', fontSize: '0.82rem' }}>
                          {['Pending', 'Paid', 'Failed', 'Refunded'].map(s => <option key={s}>{s}</option>)}
                        </select></td>
                        <td><select value={o.delivery?.status} onChange={async e => { await updateOrder(o._id, { deliveryStatus: e.target.value }); loadAll(); }} style={{ background: '#111', color: '#fff', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 8px', fontSize: '0.82rem' }}>
                          {['Processing', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
                        </select></td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* USERS VIEW */}
        {view === 'users' && (
          <>
            <h1 style={{ marginBottom: '2rem' }}>👥 User Database <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}>with RFM Segmentation</span></h1>
            <div className="card" style={{ padding: '1.5rem' }}>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Name</th><th>Phone</th><th>Segment</th><th>Orders</th><th>Spent</th><th>Last Login</th><th>Actions</th></tr></thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id}>
                        <td style={{ fontWeight: 600 }}>{u.name}</td>
                        <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>{u.phone}</td>
                        <td><span className="badge" style={{ background: 'rgba(212,175,55,0.1)', color: 'var(--primary)', border: '1px solid rgba(212,175,55,0.2)' }}>{u.segment}</span></td>
                        <td>{u.totalOrders}</td>
                        <td style={{ color: 'var(--success)', fontWeight: 600 }}>₹{u.totalSpent}</td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.lastLogin ? new Date(u.lastLogin).toLocaleDateString('en-IN') : '-'}</td>
                        <td>
                          <button onClick={async () => { await banUser(u._id, !u.isBanned); loadAll(); toast.success(u.isBanned ? 'User unbanned' : 'User banned'); }} style={{ padding: '4px 10px', borderRadius: 6, border: 'none', background: u.isBanned ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: u.isBanned ? 'var(--success)' : 'var(--danger)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                            {u.isBanned ? '✅ Unban' : '🚫 Ban'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* COMPLAINTS VIEW */}
        {view === 'complaints' && (
          <>
            <h1 style={{ marginBottom: '2rem' }}>📢 Complaints</h1>
            <div className="card" style={{ padding: '1.5rem' }}>
              {complaints.length === 0 ? <div className="empty-state"><div className="icon">✅</div><h3>No complaints!</h3></div> : (
                complaints.map(c => (
                  <div key={c._id} style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <strong>#{c.orderId}</strong>
                      <span className={`badge ${c.complaint?.status === 'Resolved' ? 'badge-green' : 'badge-red'}`}>{c.complaint?.status}</span>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>{c.complaint?.description}</p>
                    {c.complaint?.status !== 'Resolved' && (
                      <button className="btn btn-success" style={{ fontSize: '0.85rem' }} onClick={async () => {
                        const reply = prompt('Reply to customer:');
                        if (reply) { await resolveComplaint(c.orderId, reply); loadAll(); toast.success('Complaint resolved!'); }
                      }}>✅ Resolve</button>
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* AI FORECAST VIEW */}
        {view === 'forecast' && (
          <>
            <h1 style={{ marginBottom: '0.5rem' }}>🔮 AI Demand Forecast</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Machine Learning powered predictions for next 7 days</p>

            {forecast.length > 0 && (
              <>
                <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                  <h3 style={{ marginBottom: '1rem', color: 'var(--purple)' }}>Predicted Orders — Next 7 Days</h3>
                  <div style={{ height: 280 }}>
                    <Bar data={{
                      labels: forecast.map(f => `${f.day} ${f.date}`),
                      datasets: [
                        { label: 'Orders', data: forecast.map(f => f.orders), backgroundColor: 'rgba(217,70,239,0.6)', borderRadius: 8, borderSkipped: false },
                        { label: 'Revenue ₹', data: forecast.map(f => f.revenue), backgroundColor: 'rgba(212,175,55,0.4)', borderRadius: 8, borderSkipped: false }
                      ]
                    }} options={{ ...CHART_OPTS, plugins: { ...CHART_OPTS.plugins, legend: { labels: { color: '#94a3b8' } } } }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.75rem' }}>
                  {forecast.map(f => (
                    <div key={f.day} className="card" style={{ padding: '1rem', textAlign: 'center' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{f.day}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{f.date}</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0.5rem 0', color: 'var(--purple)' }}>{f.orders}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--success)' }}>₹{f.revenue?.toLocaleString('en-IN')}</div>
                      <div style={{ fontSize: '1rem', marginTop: '0.25rem' }}>{f.trend}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
