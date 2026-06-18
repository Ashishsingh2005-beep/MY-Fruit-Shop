import { useCart } from '../context/CartContext';

export default function ProductCard({ product, onClick }) {
  const { addToCart } = useCart();

  const bgColor = product.color || '#FFD700';
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="product-card" onClick={() => onClick && onClick(product)}>
      {product.isHot && (
        <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 1 }}>
          <span className="badge badge-red">🔥 Hot</span>
        </div>
      )}
      {discount > 0 && (
        <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 1 }}>
          <span className="badge badge-green">{discount}% OFF</span>
        </div>
      )}
      {!product.inStock && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius)', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Out of Stock
        </div>
      )}

      <div className="emoji-bg" style={{ background: `radial-gradient(circle at center, ${bgColor}22 0%, transparent 70%)` }}>
        <span style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}>{product.emoji || '🍎'}</span>
      </div>

      <div className="card-body">
        <div className="card-name">{product.name}</div>
        <div className="card-desc">{product.description}</div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '0.75rem' }}>
          <span className="card-price">₹{product.dynamicPrice || product.price}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/{product.unit || 'kg'}</span>
          {product.originalPrice && <span className="card-original">₹{product.originalPrice}</span>}
        </div>

        <div className="card-footer">
          <div className="card-rating">
            ⭐ <span>{product.rating?.toFixed(1)}</span>
            <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>({product.reviewCount || 0})</span>
          </div>
          <button
            className="btn btn-primary"
            style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
            disabled={!product.inStock}
            onClick={e => { e.stopPropagation(); addToCart(product); }}
          >
            + Add
          </button>
        </div>
      </div>
    </div>
  );
}
