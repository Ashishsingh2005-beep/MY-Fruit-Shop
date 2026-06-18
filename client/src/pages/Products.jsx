import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';

const CATEGORIES = ['All', 'Fruits', 'Vegetables', 'Exotic'];
const SORTS = [
  { value: 'default', label: '⭐ Featured' },
  { value: 'popular', label: '🔥 Most Popular' },
  { value: 'rating', label: '⭐ Top Rated' },
  { value: 'price_asc', label: '💰 Price: Low to High' },
  { value: 'price_desc', label: '💰 Price: High to Low' },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('default');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const params = { sort };
        if (category !== 'All') params.category = category;
        if (search) params.search = search;
        const res = await getProducts(params);
        setProducts(res.data.products);
        setTotal(res.data.count);
      } catch { } finally {
        setLoading(false);
      }
    };
    load();
  }, [category, sort, search]);

  return (
    <div className="page">
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
            🛒 Our <span className="gradient-text">Collection</span>
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>{total} products available • Fresh daily</p>
        </div>

        {/* ─── Filters ─── */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search */}
          <div style={{ flex: '1', minWidth: 220, position: 'relative' }}>
            <input
              className="input"
              placeholder="🔍 Search fruits, vegetables..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: '1rem' }}
            />
          </div>

          {/* Category Filter */}
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategory(c)} className="btn" style={{
                padding: '0.5rem 1rem', fontSize: '0.85rem',
                background: category === c ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                color: category === c ? '#000' : 'var(--text)',
                border: `1px solid ${category === c ? 'var(--primary)' : 'var(--border)'}`,
                fontWeight: category === c ? 700 : 500
              }}>
                {c}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            style={{ padding: '0.65rem 1rem', background: 'var(--bg-card)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontFamily: 'Outfit, sans-serif', cursor: 'pointer' }}
          >
            {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        {/* ─── Products Grid ─── */}
        {loading ? (
          <div className="grid-auto">
            {[...Array(12)].map((_, i) => <div key={i} className="skeleton" style={{ height: 320 }} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🔍</div>
            <h3>No products found</h3>
            <p>Try a different search term or category</p>
          </div>
        ) : (
          <div className="grid-auto">
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
