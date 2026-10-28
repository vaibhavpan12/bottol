import { createContext, useCallback, useContext, useMemo, useState } from "react";

// Shared UI actions for every storefront page: login modal, checkout modal, toasts.
const ShopUIContext = createContext(null);

export function ShopUIProvider({ children }) {
  const [toast, setToast] = useState(null);
  const [isAuthOpen, setAuthOpen] = useState(false);
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);
  const [authPurpose, setAuthPurpose] = useState(null);

  const openLogin = useCallback(() => {
    setAuthPurpose("login");
    setAuthOpen(true);
  }, []);

  const openCheckout = useCallback(() => {
    if (localStorage.getItem("token")) {
      setCheckoutOpen(true);
    } else {
      setAuthPurpose("checkout");
      setAuthOpen(true);
    }
  }, []);

  const closeAuth = useCallback(() => {
    setAuthOpen(false);
    if (localStorage.getItem("token") && authPurpose === "checkout") {
      setCheckoutOpen(true);
    }
    setAuthPurpose(null);
  }, [authPurpose]);

  const value = useMemo(
    () => ({
      toast, setToast,
      isAuthOpen, openLogin, closeAuth,
      isCheckoutOpen, openCheckout, closeCheckout: () => setCheckoutOpen(false),
    }),
    [toast, isAuthOpen, openLogin, closeAuth, isCheckoutOpen, openCheckout]
  );

  return <ShopUIContext.Provider value={value}>{children}</ShopUIContext.Provider>;
}

export function useShopUI() {
  const ctx = useContext(ShopUIContext);
  if (!ctx) throw new Error("useShopUI must be used inside ShopUIProvider");
  return ctx;
}
