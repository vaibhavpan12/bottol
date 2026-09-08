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
// import AIChat from "./components/AIChat";

import { CartProvider, useCart } from "./context/CartContext";

import ProductDetails from "./pages/ProductDetails";
import Orders from "./pages/Orders";
import AddProduct from "./pages/AdminScreen/AddProduct";

import AdminLogin from "./pages/AdminScreen/AdminLogin";
import AdminDashboard from "./pages/AdminScreen/AdminDashboard";
import AdminLayout from "./components/AdminLayout";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import AuthModal from "./components/AuthModal";
import AdminOrders from "./pages/AdminScreen/AdminOrders";
import AdminProducts from "./pages/AdminScreen/AdminProducts";
import AdminCustomers from "./pages/AdminScreen/AdminCustomers";

// =====================================================
// STOREFRONT
// =====================================================

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

  // =====================================================
  // OPEN CHECKOUT
  // =====================================================

  function openCheckout() {
    closeDrawer();

    const token = localStorage.getItem("token");

    if (token) {
      setCheckoutOpen(true);
    } else {
      setAuthPurpose("checkout");
      setAuthOpen(true);
    }
  }

  // =====================================================
  // AUTH MODAL CLOSE
  // =====================================================

  function handleAuthClose() {
    setAuthOpen(false);

    const token = localStorage.getItem("token");

    if (token && authPurpose === "checkout") {
      setCheckoutOpen(true);
    }

    setAuthPurpose(null);
  }

  // =====================================================
  // AUTH SUCCESS
  // =====================================================

  function handleAuthSuccess(message) {
    console.log("🍞🍞 AUTH SUCCESS:", message);

    setToast({
      type: "success",
      message,
    });
  }

  return (
    <>
      {/* =================================================
          CUSTOMER NAVBAR
      ================================================= */}

      <Navbar
        setToast={setToast}
        onLogin={() => {
          setAuthPurpose("login");
          setAuthOpen(true);
        }}
      />

      {/* =================================================
          CUSTOMER MAIN CONTENT
      ================================================= */}

      <main>
        <Hero />

        <FeaturedStrip />

        <ProductGrid />

        <Marquee text="Precision engineered" />

        <Perks />

        <Spotlight />

        <Testimonial />
      </main>

      {/* =================================================
          FOOTER
      ================================================= */}

      <Footer />

      {/* =================================================
          FLOATING CART
      ================================================= */}

      <FloatingCart isHidden={isDrawerOpen || isCheckoutOpen || isAuthOpen} />

      {/* =================================================
          CART DRAWER
      ================================================= */}

      <CartDrawer onCheckout={openCheckout} />

      {/* =================================================
          CHECKOUT
      ================================================= */}

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />

      {/* =================================================
          AUTH MODAL
      ================================================= */}

      <AuthModal
        isOpen={isAuthOpen}
        onClose={handleAuthClose}
        initialMode="login"
        onSuccess={handleAuthSuccess}
      />

      {/* =================================================
          AI SHOPPING ASSISTANT
      ================================================= */}

      {/* <AIChat /> */}
    </>
  );
}

// =====================================================
// APP
// =====================================================

export default function App() {
  // =====================================================
  // TOAST
  // =====================================================

  const [toast, setToast] = useState(null);

  // =====================================================
  // CUSTOMER AUTH MODAL
  // =====================================================

  const [isAuthOpen, setAuthOpen] = useState(false);

  // =====================================================
  // CHECKOUT MODAL
  // =====================================================

  const [isCheckoutOpen, setCheckoutOpen] = useState(false);

  // =====================================================
  // AUTH PURPOSE
  //
  // "login"    → Navbar Login
  // "checkout" → Checkout
  // =====================================================

  const [authPurpose, setAuthPurpose] = useState(null);

  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          {/* =================================================
              CUSTOMER STOREFRONT
          ================================================= */}

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

          {/* =================================================
              PRODUCT DETAILS
          ================================================= */}

          <Route
            path="/product/:id"
            element={
              <>
                <Navbar
                  setToast={setToast}
                  onLogin={() => {
                    setAuthPurpose("login");
                    setAuthOpen(true);
                  }}
                />

                <ProductDetails />
              </>
            }
          />

          {/* =================================================
              CUSTOMER ORDERS
          ================================================= */}

          <Route
            path="/orders"
            element={
              <>
                <Navbar
                  setToast={setToast}
                  onLogin={() => {
                    setAuthPurpose("login");
                    setAuthOpen(true);
                  }}
                />

                <Orders />
              </>
            }
          />

          {/* =================================================
              ADD PRODUCT
          ================================================= */}

          <Route
            path="/add-product"
            element={
              <>
                <Navbar
                  setToast={setToast}
                  onLogin={() => {
                    setAuthPurpose("login");
                    setAuthOpen(true);
                  }}
                />

                <AddProduct />
              </>
            }
          />

          {/* =================================================
              ADMIN LOGIN
              
              IMPORTANT:
              NO CUSTOMER NAVBAR HERE
          ================================================= */}

          <Route path="/admin/login" element={<AdminLogin />} />

          {/* =================================================
              PROTECTED ADMIN ROUTES
          ================================================= */}

          <Route element={<ProtectedAdminRoute />}>
            {/* ===============================================
                ADMIN LAYOUT
            =============================================== */}

            <Route path="/admin" element={<AdminLayout />}>
              {/* =============================================
                  DASHBOARD
              ============================================= */}

              <Route path="dashboard" element={<AdminDashboard />} />

              <Route path="orders" element={<AdminOrders   />} />
              {/* =============================================
                  FUTURE ADMIN PAGES
              ============================================= */}

              

              <Route
                path="products"
                element={<AdminProducts />}
              />

              {/* <Route
                path="orders"
                element={<AdminOrders />}
              /> */}

              <Route
                path="customers"
                element={<AdminCustomers />}
              />

              {/* <Route
                path="sales"
                element={<AdminSales />}
              /> */}

              {/* <Route
                path="inventory"
                element={<AdminInventory />}
              /> */}

              {/* <Route
                path="settings"
                element={<AdminSettings />}
              /> */}

             
            </Route>
          </Route>
        </Routes>

        {/* =================================================
            GLOBAL TOAST
        ================================================= */}

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
