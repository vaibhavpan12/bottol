import { lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";

import { CartProvider } from "./context/CartContext";
import { ShopUIProvider } from "./context/ShopUIContext";
import StoreLayout from "./layouts/StoreLayout";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./pages/Home";

// Storefront pages (code-split so the homepage loads fast)
const Shop = lazy(() => import("./pages/Shop"));
const Categories = lazy(() => import("./pages/Categories"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Cart = lazy(() => import("./pages/Cart"));
const Orders = lazy(() => import("./pages/Orders"));
const InfoPage = lazy(() => import("./pages/InfoPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Admin (separate bundle — customers never download it)
const AdminLogin = lazy(() => import("./pages/AdminScreen/AdminLogin"));
const AdminLayout = lazy(() => import("./components/AdminLayout"));
const ProtectedAdminRoute = lazy(() => import("./components/ProtectedAdminRoute"));
const AdminDashboard = lazy(() => import("./pages/AdminScreen/AdminDashboard"));
const AdminOrders = lazy(() => import("./pages/AdminScreen/AdminOrders"));
const AdminProducts = lazy(() => import("./pages/AdminScreen/AdminProducts"));
const AdminCustomers = lazy(() => import("./pages/AdminScreen/AdminCustomers"));

const INFO_PAGES = ["about", "contact", "faq", "shipping", "returns", "privacy", "terms"];

function Loader() {
  return (
    <div className="page-loader" aria-label="Loading">
      <span className="spinner" />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <CartProvider>
          <ShopUIProvider>
            <Suspense fallback={<Loader />}>
              <Routes>
                {/* ================= STOREFRONT ================= */}
                <Route element={<StoreLayout />}>
                  <Route index element={<Home />} />
                  <Route path="shop" element={<Shop mode="all" />} />
                  <Route path="deals" element={<Shop mode="deals" />} />
                  <Route path="category/:category" element={<Shop mode="category" />} />
                  <Route path="categories" element={<Categories />} />
                  <Route path="product/:id" element={<ProductDetails />} />
                  <Route path="cart" element={<Cart />} />
                  <Route path="orders" element={<Orders />} />
                  {INFO_PAGES.map((p) => (
                    <Route key={p} path={p} element={<InfoPage />} />
                  ))}
                  <Route path="*" element={<NotFound />} />
                </Route>

                {/* ================= ADMIN ================= */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route element={<ProtectedAdminRoute />}>
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="customers" element={<AdminCustomers />} />
                  </Route>
                </Route>
              </Routes>
            </Suspense>
          </ShopUIProvider>
        </CartProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
