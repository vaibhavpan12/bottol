# Pivora Storefront

A React + Vite rebuild of the Pivora drinkware storefront: product catalog with
filtering, a persistent cart drawer, and a two-step checkout flow (demo payment only).

## Project structure

```
pivora/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx              # React entry point
│   ├── App.jsx                # Composes the page from sections
│   ├── index.css              # Global styles / design tokens (unchanged from source)
│   ├── context/
│   │   └── CartContext.jsx    # Cart state, totals, shipping logic (React Context)
│   ├── data/
│   │   └── products.js        # Product catalog + shipping constants
│   └── components/
│       ├── Navbar.jsx         # Sticky header + announcement ticker + cart button
│       ├── Footer.jsx         # Site footer + newsletter form
│       ├── Hero.jsx           # Landing hero with the technical tumbler illustration
│       ├── ProductGrid.jsx    # Category tabs + product grid
│       ├── ProductCard.jsx    # Single product card
│       ├── Perks.jsx          # "Why Pivora" perks strip
│       ├── CartDrawer.jsx     # Slide-in cart drawer
│       ├── CheckoutModal.jsx  # Shipping → payment → success modal flow
│       └── Icon.jsx           # Shared monoline icon set (inline SVG)
```

## Getting started

```bash
npm install
npm run dev       # start local dev server (http://localhost:5173)
npm run build      # production build → dist/
npm run preview   # preview the production build locally
```

## Notes for production

- **Payments**: `CheckoutModal.jsx` simulates a payment with a timeout. Replace
  `handlePay` with a real call to your payment gateway (e.g. Razorpay, Stripe)
  before going live — do not collect real card details client-side without PCI-compliant tooling.
- **Product data**: `src/data/products.js` is static. Swap this for a fetch to
  your commerce API / CMS when ready.
- **Newsletter form**: `Footer.jsx`'s `NewsletterForm` currently just tracks
  local state. Wire the `handleSubmit` function to your ESP (Klaviyo, Mailchimp, etc.).
- **Cart persistence**: Cart state lives in React Context and resets on page
  reload. Add `localStorage` sync in `CartContext.jsx` if you want it to persist.
