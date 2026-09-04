import { useState } from "react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeaturedStrip from "./components/FeaturedStrip";
import ProductGrid from "./components/ProductGrid";
import Marquee from "./components/Marquee";
import Perks from "./components/Perks";
import Spotlight from "./components/Spotlight";
import Testimonial from "./components/Testimonial";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import CheckoutModal from "./components/CheckoutModal";
import FloatingCart from "./components/FloatingCart";
import Toast from "./components/Toast";

import { CartProvider, useCart } from "./context/CartContext";

import AddProduct from "./pages/AdminScreen/AddProduct";
import ProductDetails from "./pages/ProductDetails";
import Orders from "./pages/Orders";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthModal from "./components/AuthModal";

function StorefrontShell({
  setToast,
  isAuthOpen,
  setAuthOpen,
  isCheckoutOpen,
  setCheckoutOpen,
  authPurpose,
  setAuthPurpose,
}) {
  const { closeDrawer, isDrawerOpen } = useCart();

  // =========================
  // OPEN CHECKOUT
  // =========================
  function openCheckout() {
    closeDrawer();

    const token = localStorage.getItem("token");

    if (token) {
      // Already logged in
      setCheckoutOpen(true);
    } else {
      // User came from Cart → Checkout
      setAuthPurpose("checkout");
      setAuthOpen(true);
    }
  }

  // =========================
  // AUTH MODAL CLOSE
  // =========================
  function handleAuthClose() {
    setAuthOpen(false);

    const token = localStorage.getItem("token");

    // Only open checkout if AuthModal
    // was opened from Cart → Checkout
    if (token && authPurpose === "checkout") {
      setCheckoutOpen(true);
    }

    // Reset purpose
    setAuthPurpose(null);
  }

  // =========================
  // AUTH SUCCESS
  // =========================
  function handleAuthSuccess(message) {
    console.log("🍞🍞 AUTH SUCCESS:", message);

    setToast({
      type: "success",
      message,
    });
  }

  return (
    <>
      <main>
        <Hero />

        <FeaturedStrip />

        <ProductGrid />

        <Marquee text="Precision engineered" />

        <Perks />

        <Spotlight />

        <Testimonial />
      </main>

      <Footer />

      {/* =========================
          FLOATING CART
      ========================= */}
      <FloatingCart isHidden={isDrawerOpen || isCheckoutOpen || isAuthOpen} />

      {/* =========================
          CART DRAWER
      ========================= */}
      <CartDrawer onCheckout={openCheckout} />

      {/* =========================
          CHECKOUT / PAYMENT
      ========================= */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />

      {/* =========================
          AUTH MODAL
          ONLY ONE INSTANCE
      ========================= */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={handleAuthClose}
        initialMode="login"
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}

export default function App() {
  // =========================
  // TOAST
  // =========================
  const [toast, setToast] = useState(null);

  // =========================
  // AUTH MODAL
  // =========================
  const [isAuthOpen, setAuthOpen] = useState(false);

  // =========================
  // CHECKOUT MODAL
  // =========================
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);

  // =========================
  // AUTH PURPOSE
  // "login"    → Navbar Login
  // "checkout" → Cart Checkout
  // =========================
  const [authPurpose, setAuthPurpose] = useState(null);

  return (
    <BrowserRouter>
      <CartProvider>
        {/* =========================
            NAVBAR
        ========================= */}
        <Navbar
          setToast={setToast}
          onLogin={() => {
            setAuthPurpose("login");
            setAuthOpen(true);
          }}
        />
        {/* =========================
            ROUTES
        ========================= */}
        <Routes>
          {/* =========================
              STOREFRONT
          ========================= */}
          <Route
            path="/"
            element={
              <StorefrontShell
                setToast={setToast}
                isAuthOpen={isAuthOpen}
                setAuthOpen={setAuthOpen}
                isCheckoutOpen={isCheckoutOpen}
                setCheckoutOpen={setCheckoutOpen}
                authPurpose={authPurpose}
                setAuthPurpose={setAuthPurpose}
              />
            }
          />

          {/* =========================
              PRODUCT DETAILS
          ========================= */}
          <Route path="/product/:id" element={<ProductDetails />} />

          {/* =========================
              ADMIN
          ========================= */}
          <Route path="/add-product" element={<AddProduct />} />

          {/* =========================
              ORDERS
          ========================= */}
          <Route path="/orders" element={<Orders />} />
        </Routes>

        {/* =========================
            GLOBAL TOAST
        ========================= */}
        {toast && (
          <>
            {console.log("🔥🔥 TOAST IS RENDERING:", toast)}

            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          </>
        )}
      </CartProvider>
    </BrowserRouter>
  );
}
