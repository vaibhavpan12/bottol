import { Outlet, useLocation } from "react-router-dom";
import { Suspense } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CartDrawer from "../components/CartDrawer";
import CheckoutModal from "../components/CheckoutModal";
import FloatingCart from "../components/FloatingCart";
import AuthModal from "../components/AuthModal";
import AIChat from "../components/AIChat";
import Toast from "../components/Toast";
import ScrollToTop from "../components/ScrollToTop";
import { useCart } from "../context/CartContext";
import { useShopUI } from "../context/ShopUIContext";

function PageLoader() {
  return (
    <div className="page-loader" aria-label="Loading">
      <span className="spinner" />
    </div>
  );
}

export default function StoreLayout() {
  const { isDrawerOpen, closeDrawer } = useCart();
  const ui = useShopUI();
  const { pathname } = useLocation();

  const hideFloating = isDrawerOpen || ui.isCheckoutOpen || ui.isAuthOpen || pathname === "/cart";

  return (
    <>
      <ScrollToTop />
      <Navbar setToast={ui.setToast} onLogin={ui.openLogin} />

      <main className="store-main">
        <Suspense fallback={<PageLoader />}>
          <div key={pathname} className="page-transition">
            <Outlet />
          </div>
        </Suspense>
      </main>

      <Footer />

      <FloatingCart isHidden={hideFloating} />
      <CartDrawer
        onCheckout={() => {
          closeDrawer();
          ui.openCheckout();
        }}
      />
      <CheckoutModal isOpen={ui.isCheckoutOpen} onClose={ui.closeCheckout} />
      <AuthModal
        isOpen={ui.isAuthOpen}
        onClose={ui.closeAuth}
        initialMode="login"
        onSuccess={(message) => ui.setToast({ type: "success", message })}
      />
      <AIChat />

      {ui.toast && (
        <Toast message={ui.toast.message} type={ui.toast.type} onClose={() => ui.setToast(null)} />
      )}
    </>
  );
}
