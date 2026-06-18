import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, getAIRecommendations } from '../services/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const { applyCoupon } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [prodRes, aiRes] = await Promise.all([
          getProducts({ sort: 'popular' }),
          getAIRecommendations()
        ]);
        setFeatured(prodRes.data.products.filter(p => p.isFeatured).slice(0, 8));
        setTrending(aiRes.data.trending || prodRes.data.products.slice(0, 4));
      } catch {
        const prodRes = await getProducts({ sort: 'rating' });
        setFeatured(prodRes.data.products.slice(0, 8));
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div>
      {/* ─── HERO ─── */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="container">
          <div className="hero-content">
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-gold">🌿 Fresh & Organic</span>
              <span className="badge badge-red">⚡ 5% Below Market Price</span>
            </div>
            <h1>Taste the <br /><span className="gradient-text">Luxury of Nature</span></h1>
            <p>Hand-picked exotic fruits & vegetables delivered to your doorstep in 12 minutes. Experience the vibrant flavors of the tropics.</p>
            <div className="hero-btns">
              <button className="btn btn-primary" style={{ fontSize: '1.05rem', padding: '0.9rem 2rem' }} onClick={() => navigate('/products')}>
                🛒 Shop Collection
              </button>
              <button className="btn btn-outline" style={{ fontSize: '1.05rem', padding: '0.9rem 2rem' }} onClick={() => applyCoupon('WELCOME50')}>
                🎁 Claim ₹50 OFF
              </button>
            </div>

            <div className="stats-bar" style={{ marginTop: '3rem' }}>
              {[['10K+', 'Happy Customers'], ['12 Min', 'Delivery Time'], ['200+', 'Fruit Varieties'], ['4.9★', 'App Rating']].map(([val, label]) => (
                <div key={label} className="stat-item">
                  <div className="stat-val">{val}</div>
                  <div className="stat-label">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div style={{ position: 'absolute', right: '5%', top: '20%', fontSize: '8rem', opacity: 0.06, pointerEvents: 'none', userSelect: 'none' }}>🍎</div>
        <div style={{ position: 'absolute', right: '15%', bottom: '15%', fontSize: '6rem', opacity: 0.05, pointerEvents: 'none', userSelect: 'none' }}>🥭</div>
      </section>

      {/* ─── OFFER BANNER ─── */}
      <section style={{ padding: '3rem 0 0' }}>
        <div className="container">
          <div style={{ background: 'linear-gradient(135deg, #ec4899, #be123c)', borderRadius: 'var(--radius-lg)', padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.6rem' }}>🎉 First Order Special!</h3>
              <p style={{ margin: '0.3rem 0 0', opacity: 0.9 }}>Use code <strong>WELCOME50</strong> and save ₹50 instantly</p>
            </div>
            <button className="btn" style={{ background: 'white', color: '#be123c', fontWeight: 800 }} onClick={() => applyCoupon('WELCOME50')}>
              CLAIM NOW →
            </button>
          </div>
        </div>
      </section>

      {/* ─── CATEGORY QUICK LINKS ─── */}
      <section style={{ padding: '3rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
            {[
              { icon: '🥭', label: 'Mangoes', filter: 'mango' },
              { icon: '🐉', label: 'Dragon Fruit', filter: 'dragon' },
              { icon: '🍎', label: 'Apples', filter: 'apple' },
              { icon: '🍇', label: 'Grapes', filter: 'grapes' },
              { icon: '🍅', label: 'Vegetables', filter: 'vegetables' },
              { icon: '🫐', label: 'Berries', filter: 'berry' },
            ].map(cat => (
              <button key={cat.label} onClick={() => navigate(`/products?search=${cat.filter}`)} style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.2rem 0.5rem',
                cursor: 'pointer', color: 'var(--text)', transition: 'var(--transition)', textAlign: 'center', fontFamily: 'Outfit, sans-serif'
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '0.4rem' }}>{cat.icon}</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{cat.label}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ─── */}
      <section style={{ padding: '0 0 4rem' }}>
        <div className="container">
          <div className="section-title">
            <h2>⭐ <span className="gradient-text">Featured Collection</span></h2>
            <p>Hand-picked premium selections, freshest quality guaranteed</p>
          </div>
          {loading ? (
            <div className="grid-auto">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 320 }} />
              ))}
            </div>
          ) : (
            <div className="grid-auto">
              {featured.map(p => <ProductCard key={p._id} product={p} onClick={() => navigate('/products')} />)}
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <button className="btn btn-outline" style={{ padding: '0.85rem 2.5rem', fontSize: '1rem' }} onClick={() => navigate('/products')}>
              View All Products →
            </button>
          </div>
        </div>
      </section>

      {/* ─── WHY US ─── */}
      <section style={{ padding: '4rem 0', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div className="section-title">
            <h2>Why Choose <span className="gradient-text">Ajay Fruit Mart</span>?</h2>
          </div>
          <div className="grid-4">
            {[
              { icon: '🚀', title: '12-Minute Delivery', desc: 'Lightning fast express delivery across Delhi NCR' },
              { icon: '✅', title: '100% Fresh Guarantee', desc: 'Farm-fresh produce or full refund, no questions asked' },
              { icon: '💰', title: 'Best Prices', desc: '5% below market rate on all products, every day' },
              { icon: '🤖', title: 'AI-Powered', desc: 'Smart recommendations, freshness detection & chatbot support' },
            ].map(f => (
              <div key={f.title} className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{f.icon}</div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{f.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
