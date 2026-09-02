import { useState } from 'react';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturedStrip from './components/FeaturedStrip';
import ProductGrid from './components/ProductGrid';
import Marquee from './components/Marquee';
import Perks from './components/Perks';
import Spotlight from './components/Spotlight';
import Testimonial from './components/Testimonial';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';

import { CartProvider, useCart } from './context/CartContext';

import AddProduct from './pages/AdminScreen/AddProduct';

import { BrowserRouter, Routes, Route } from 'react-router-dom';


function StorefrontShell() {

  const { closeDrawer } = useCart();

  const [isCheckoutOpen, setCheckoutOpen] = useState(false);

  function openCheckout() {
    closeDrawer();
    setCheckoutOpen(true);
  }

  return (
    <>
      <Navbar />

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

      <CartDrawer onCheckout={openCheckout} />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />
    </>
  );
}


export default function App() {

  return (
    <BrowserRouter>

      <CartProvider>

        <Routes>

          {/* Main Storefront */}
          <Route
            path="/"
            element={<StorefrontShell />}
          />

          {/* Admin - Add Product */}
          <Route
            path="/add-product"
            element={<AddProduct />}
          />

        </Routes>

      </CartProvider>

    </BrowserRouter>
  );
}