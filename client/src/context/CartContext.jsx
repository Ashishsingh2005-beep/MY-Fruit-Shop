import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart')) || []; } catch { return []; }
  });
  const [coupon, setCoupon] = useState(null);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, qty = 1) => {
    setCart(prev => {
      const exists = prev.find(i => i._id === product._id);
      if (exists) {
        toast.success(`${product.emoji || '🍎'} Quantity updated!`);
        return prev.map(i => i._id === product._id ? { ...i, qty: i.qty + qty } : i);
      }
      toast.success(`${product.emoji || '🍎'} ${product.name} added to cart!`);
      return [...prev, { ...product, qty }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(i => i._id !== productId));
  };

  const updateQty = (productId, qty) => {
    if (qty < 1) { removeFromCart(productId); return; }
    setCart(prev => prev.map(i => i._id === productId ? { ...i, qty } : i));
  };

  const clearCart = () => setCart([]);

  const applyCoupon = (code) => {
    const coupons = { WELCOME50: 50, MANGO20: 20, FRESH30: 30 };
    if (coupons[code.toUpperCase()]) {
      setCoupon({ code: code.toUpperCase(), discount: coupons[code.toUpperCase()] });
      toast.success(`🎉 Coupon applied! ₹${coupons[code.toUpperCase()]} OFF`);
    } else {
      toast.error('Invalid coupon code');
    }
  };

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = cart.reduce((sum, i) => sum + (i.dynamicPrice || i.price) * i.qty, 0);
  const deliveryFee = subtotal >= 499 ? 0 : 30;
  const discount = coupon?.discount || 0;
  const total = subtotal + deliveryFee - discount;

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart, updateQty, clearCart,
      coupon, applyCoupon,
      cartCount, subtotal, deliveryFee, discount, total
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
