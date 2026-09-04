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

function StorefrontShell({ setToast }) {
  const { closeDrawer, isDrawerOpen } = useCart();

  const [isCheckoutOpen, setCheckoutOpen] = useState(false);
  const [isAuthOpen, setAuthOpen] = useState(false);

  function openCheckout() {
    closeDrawer();

    const token = localStorage.getItem("token");

    if (token) {
      // Already logged in → directly payment
      setCheckoutOpen(true);
    } else {
      // Not logged in → signup/login modal
      setAuthOpen(true);
    }
  }

  function handleAuthClose() {
    setAuthOpen(false);

    // Check whether login/signup was successful
    const token = localStorage.getItem("token");

    if (token) {
      setCheckoutOpen(true);
    }
  }

  function handleAuthSuccess(message) {
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

      {/* Floating Cart */}
      <FloatingCart isHidden={isDrawerOpen || isCheckoutOpen || isAuthOpen} />

      {/* Cart Drawer */}
      <CartDrawer onCheckout={openCheckout} />

      {/* Checkout / Payment */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />

      {/* Login / Signup */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={handleAuthClose}
        initialMode="signup"
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}

export default function App() {
  const [toast, setToast] = useState(null);

  return (
    <BrowserRouter>
      <CartProvider>
        {/* Navbar common for all pages */}
        <Navbar />

        <Routes>
          {/* Main Storefront */}
          <Route path="/" element={<StorefrontShell setToast={setToast} />} />

          {/* Product Details */}
          <Route path="/product/:id" element={<ProductDetails />} />

          {/* Admin */}
          <Route path="/add-product" element={<AddProduct />} />

          {/* Orders */}
          <Route path="/orders" element={<Orders />} />
        </Routes>

        {/* Global Toast */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </CartProvider>
    </BrowserRouter>
  );
}
