import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import {
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_FEE,
} from '../data/products';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  // Add product to cart
  const addToCart = useCallback((product) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item._id === product._id
      );

      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }

      return [...prev, { ...product, qty: 1 }];
    });

    // ❌ Yahan setDrawerOpen(true) mat karo
  }, []);

  // Change quantity
  const changeQty = useCallback((id, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item._id === id
            ? { ...item, qty: item.qty + delta }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  }, []);

  // Remove product
  const removeItem = useCallback((id) => {
    setCart((prev) =>
      prev.filter((item) => item._id !== id)
    );
  }, []);

  // Clear cart
  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Open / Close drawer
  const openDrawer = useCallback(() => {
    setDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  // Cart totals
  const totals = useMemo(() => {
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );

    const itemCount = cart.reduce(
      (sum, item) => sum + item.qty,
      0
    );

    const shipping =
      subtotal === 0
        ? 0
        : subtotal >= FREE_SHIPPING_THRESHOLD
          ? 0
          : STANDARD_SHIPPING_FEE;

    return {
      subtotal,
      shipping,
      total: subtotal + shipping,
      itemCount,
    };
  }, [cart]);

  const value = useMemo(
    () => ({
      cart,
      isDrawerOpen,
      totals,
      addToCart,
      changeQty,
      removeItem,
      clearCart,
      openDrawer,
      closeDrawer,
    }),
    [
      cart,
      isDrawerOpen,
      totals,
      addToCart,
      changeQty,
      removeItem,
      clearCart,
      openDrawer,
      closeDrawer,
    ]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);

  if (!ctx) {
    throw new Error(
      'useCart must be used within a CartProvider'
    );
  }

  return ctx;
}