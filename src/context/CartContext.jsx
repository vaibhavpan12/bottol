import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_FEE,
} from "../data/products";

import { BASE_URL } from "../config/api";

const CartContext = createContext(null);

const GUEST_CART_KEY = "pivora_guest_cart";
const CART_SYNC_DELAY = 500;

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isCartLoading, setIsCartLoading] = useState(true);

  const syncTimerRef = useRef(null);

  /*
   * Get current JWT token
   */
  const getToken = useCallback(() => {
    return localStorage.getItem("token");
  }, []);

  /*
   * Convert frontend cart to backend format
   */
  const getServerCartItems = useCallback((items) => {
    return items.map((item) => ({
      product_id: item._id,
      quantity: item.qty,
    }));
  }, []);

  /*
   * Load guest cart
   */
  const loadGuestCart = useCallback(() => {
    try {
      const savedCart = localStorage.getItem(GUEST_CART_KEY);

      if (!savedCart) {
        return [];
      }

      const parsedCart = JSON.parse(savedCart);

      return Array.isArray(parsedCart) ? parsedCart : [];
    } catch (error) {
      console.error("Failed to load guest cart:", error);
      return [];
    }
  }, []);

  /*
   * Save guest cart
   */
  const saveGuestCart = useCallback((items) => {
    try {
      localStorage.setItem(
        GUEST_CART_KEY,
        JSON.stringify(items)
      );
    } catch (error) {
      console.error("Failed to save guest cart:", error);
    }
  }, []);

  /*
   * Get logged-in user's cart from MongoDB
   *
   * Backend uses JWT to identify the user.
   */
  const loadServerCart = useCallback(async (token) => {
    const response = await fetch(
      `${BASE_URL}/api/cart/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to load cart");
    }

    const data = await response.json();

    return data.items || [];
  }, []);

  /*
   * Convert server cart items into complete frontend cart
   */
  const buildCartFromServerItems = useCallback(
    async (serverItems) => {
      if (!serverItems.length) {
        return [];
      }

      try {
        const response = await fetch(
          `${BASE_URL}/api/products/AllProducts`
        );

        if (!response.ok) {
          throw new Error("Failed to load products");
        }

        const data = await response.json();

        const products = Array.isArray(data)
          ? data
          : data.products || [];

        return serverItems
          .map((serverItem) => {
            const product = products.find(
              (product) =>
                product._id === serverItem.product_id
            );

            if (!product) {
              return null;
            }

            return {
              ...product,
              qty: serverItem.quantity,
            };
          })
          .filter(Boolean);
      } catch (error) {
        console.error(
          "Failed to build cart from server:",
          error
        );

        return [];
      }
    },
    []
  );

  /*
   * Load correct cart according to authentication state
   *
   * Logged in  -> MongoDB
   * Guest      -> localStorage
   */
  const loadCurrentCart = useCallback(async () => {
    setIsCartLoading(true);

    const token = getToken();

    try {
      if (token) {
        const serverItems = await loadServerCart(token);

        const serverCart =
          await buildCartFromServerItems(serverItems);

        setCart(serverCart);
      } else {
        const guestCart = loadGuestCart();

        setCart(guestCart);
      }
    } catch (error) {
      console.error(
        "Cart initialization failed:",
        error
      );

      /*
       * If logged-in cart fails, don't show
       * previous user's cart.
       */
      setCart([]);
    } finally {
      setIsCartLoading(false);
    }
  }, [
    getToken,
    loadServerCart,
    buildCartFromServerItems,
    loadGuestCart,
  ]);

  /*
   * Initial load
   */
  useEffect(() => {
    loadCurrentCart();
  }, [loadCurrentCart]);

  /*
   * IMPORTANT:
   *
   * Login / Signup / Logout ke baad Navbar/AuthModal
   * "auth-changed" event dispatch karta hai.
   *
   * Is event ke baad correct user's cart reload hoga.
   */
  useEffect(() => {
    const handleAuthChanged = async () => {
      /*
       * Cancel pending cart sync
       */
      if (syncTimerRef.current) {
        clearTimeout(syncTimerRef.current);
        syncTimerRef.current = null;
      }

      /*
       * Immediately clear current cart.
       *
       * This prevents User A's cart from being
       * visible while User B's cart is loading.
       */
      setCart([]);

      /*
       * Load cart for the NEW auth state.
       */
      await loadCurrentCart();
    };

    window.addEventListener(
      "auth-changed",
      handleAuthChanged
    );

    return () => {
      window.removeEventListener(
        "auth-changed",
        handleAuthChanged
      );
    };
  }, [loadCurrentCart]);

  /*
   * Sync cart to MongoDB
   *
   * Debounced by 500ms.
   */
  const syncCartToServer = useCallback(
    (items, token) => {
      if (!token) {
        return;
      }

      if (syncTimerRef.current) {
        clearTimeout(syncTimerRef.current);
      }

      syncTimerRef.current = setTimeout(async () => {
        try {
          const response = await fetch(
            `${BASE_URL}/api/cart/me`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                items: getServerCartItems(items),
              }),
            }
          );

          if (!response.ok) {
            throw new Error(
              "Failed to sync cart"
            );
          }
        } catch (error) {
          console.error(
            "Failed to sync cart:",
            error
          );
        }
      }, CART_SYNC_DELAY);
    },
    [getServerCartItems]
  );

  /*
   * Add product
   */
  const addToCart = useCallback(
    (product) => {
      setCart((prev) => {
        const existing = prev.find(
          (item) => item._id === product._id
        );

        const updatedCart = existing
          ? prev.map((item) =>
              item._id === product._id
                ? {
                    ...item,
                    qty: item.qty + 1,
                  }
                : item
            )
          : [
              ...prev,
              {
                ...product,
                qty: 1,
              },
            ];

        const token = getToken();

        if (token) {
          syncCartToServer(
            updatedCart,
            token
          );
        } else {
          saveGuestCart(updatedCart);
        }

        return updatedCart;
      });
    },
    [
      getToken,
      saveGuestCart,
      syncCartToServer,
    ]
  );

  /*
   * Change quantity
   */
  const changeQty = useCallback(
    (id, delta) => {
      setCart((prev) => {
        const updatedCart = prev
          .map((item) =>
            item._id === id
              ? {
                  ...item,
                  qty: item.qty + delta,
                }
              : item
          )
          .filter(
            (item) => item.qty > 0
          );

        const token = getToken();

        if (token) {
          syncCartToServer(
            updatedCart,
            token
          );
        } else {
          saveGuestCart(updatedCart);
        }

        return updatedCart;
      });
    },
    [
      getToken,
      saveGuestCart,
      syncCartToServer,
    ]
  );

  /*
   * Remove product
   */
  const removeItem = useCallback(
    (id) => {
      setCart((prev) => {
        const updatedCart = prev.filter(
          (item) => item._id !== id
        );

        const token = getToken();

        if (token) {
          syncCartToServer(
            updatedCart,
            token
          );
        } else {
          saveGuestCart(updatedCart);
        }

        return updatedCart;
      });
    },
    [
      getToken,
      saveGuestCart,
      syncCartToServer,
    ]
  );

  /*
   * Clear cart
   *
   * Used after successful order.
   */
  const clearCart = useCallback(() => {
    setCart([]);

    if (syncTimerRef.current) {
      clearTimeout(syncTimerRef.current);
      syncTimerRef.current = null;
    }

    const token = getToken();

    if (token) {
      fetch(`${BASE_URL}/api/cart/me`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).catch((error) => {
        console.error(
          "Failed to clear server cart:",
          error
        );
      });
    }

    localStorage.removeItem(
      GUEST_CART_KEY
    );
  }, [getToken]);

  /*
   * Merge guest cart with logged-in user's cart
   */
  const mergeGuestCart = useCallback(async () => {
    const token = getToken();

    if (!token) {
      return;
    }

    const guestCart = loadGuestCart();

    /*
     * No guest cart.
     * Just load user's existing MongoDB cart.
     */
    if (!guestCart.length) {
      const serverItems =
        await loadServerCart(token);

      const serverCart =
        await buildCartFromServerItems(
          serverItems
        );

      setCart(serverCart);

      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL}/api/cart/merge`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            items:
              getServerCartItems(
                guestCart
              ),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to merge cart"
        );
      }

      const data =
        await response.json();

      const mergedCart =
        await buildCartFromServerItems(
          data.items || []
        );

      setCart(mergedCart);

      /*
       * Guest cart has now been transferred
       * to MongoDB.
       */
      localStorage.removeItem(
        GUEST_CART_KEY
      );
    } catch (error) {
      console.error(
        "Guest cart merge failed:",
        error
      );
    }
  }, [
    getToken,
    loadGuestCart,
    loadServerCart,
    buildCartFromServerItems,
    getServerCartItems,
  ]);

  /*
   * Reset only frontend cart on logout.
   *
   * IMPORTANT:
   * MongoDB cart is NOT deleted.
   */
  const resetCartOnLogout = useCallback(() => {
    if (syncTimerRef.current) {
      clearTimeout(syncTimerRef.current);
      syncTimerRef.current = null;
    }

    setCart([]);

    /*
     * Don't delete MongoDB cart.
     *
     * Also don't load guest cart here.
     * This prevents the previous logged-in user's
     * cart from appearing after logout.
     */
    localStorage.removeItem(
      GUEST_CART_KEY
    );
  }, []);

  /*
   * Open / Close drawer
   */
  const openDrawer = useCallback(() => {
    setDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  /*
   * Cart totals
   */
  const totals = useMemo(() => {
    const subtotal = cart.reduce(
      (sum, item) =>
        sum + item.price * item.qty,
      0
    );

    const itemCount = cart.reduce(
      (sum, item) =>
        sum + item.qty,
      0
    );

    const shipping =
      subtotal === 0
        ? 0
        : subtotal >=
          FREE_SHIPPING_THRESHOLD
          ? 0
          : STANDARD_SHIPPING_FEE;

    return {
      subtotal,
      shipping,
      total:
        subtotal + shipping,
      itemCount,
    };
  }, [cart]);

  const value = useMemo(
    () => ({
      cart,
      isDrawerOpen,
      isCartLoading,
      totals,

      addToCart,
      changeQty,
      removeItem,
      clearCart,

      mergeGuestCart,
      resetCartOnLogout,

      openDrawer,
      closeDrawer,
    }),
    [
      cart,
      isDrawerOpen,
      isCartLoading,
      totals,

      addToCart,
      changeQty,
      removeItem,
      clearCart,

      mergeGuestCart,
      resetCartOnLogout,

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
      "useCart must be used within a CartProvider"
    );
  }

  return ctx;
}