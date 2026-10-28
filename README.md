# Pivora Store

A general multi-category e-commerce storefront built with React + Vite, backed by
the Pivora API (`src/config/api.js`).

## Features
- Home page: hero banner, shop-by-category tiles, today's deals, full catalogue
- Header search, category bar, sort (price / name), category tabs — all URL-driven (`/?q=…&cat=…`)
- Product quick-view modal and product detail page
- Cart drawer + **floating cart bar**, guest cart in localStorage, merged on login
- Customer login / signup, account drawer, My Orders page
- Checkout (shipping → payment → success)
- **AI shopping assistant** chat (`/api/ai/agent`)
- Admin panel at `/admin` (dashboard, products incl. add product, orders, customers)

## Structure
```
src/
  App.jsx                 routes
  hooks/useProducts.js    shared, cached product fetch + category helper
  utils/image.js          product image URL helper
  context/CartContext.jsx cart state, sync, totals
  components/             storefront UI (Navbar, Hero, FeaturedStrip = categories,
                          Spotlight = deals, ProductGrid, Perks, Testimonial = newsletter,
                          Footer, CartDrawer, FloatingCart, AIChat, …)
  pages/                  ProductDetails, Orders, AdminScreen/*
  css/store.css           e-commerce theme (overrides tokens in index.css)
```

Categories are read from your products, so adding a product with a new category
in the admin panel makes it appear in the header, tiles and tabs automatically.

## Run
```bash
npm install
npm run dev
npm run build
```

## Before going live
- Online payment is still simulated in `CheckoutModal.jsx` — connect Razorpay/Stripe.
- Make sure the backend recalculates prices/totals and protects admin endpoints.
- Newsletter form (`Testimonial.jsx`) needs connecting to your email provider.
