import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import LoginModal from './LoginModal';

export default function Navbar() {
  const { user, logout, isLoggedIn } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogin, setShowLogin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <>
      <nav className="navbar">
        <div className="nav-inner">
          <Link to="/" className="nav-logo">Ajay <span>Fruit Mart</span></Link>

          <ul className="nav-links" style={{ display: menuOpen ? 'flex' : undefined }}>
            <li><Link to="/" className={isActive('/')}>Home</Link></li>
            <li><Link to="/products" className={isActive('/products')}>Products</Link></li>
            {isLoggedIn && <li><Link to="/profile" className={isActive('/profile')}>Profile</Link></li>}
          </ul>

          <div className="nav-actions">
            {!isLoggedIn ? (
              <button className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => setShowLogin(true)}>
                Login
              </button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Hi, {user?.name?.split(' ')[0]}</span>
                <button className="btn btn-ghost" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={logout}>Logout</button>
              </div>
            )}

            <button className="cart-btn" onClick={() => navigate('/cart')}>
              🛒
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
          </div>
        </div>
      </nav>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}
