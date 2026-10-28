import { useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useSlidingIndicator from "../hooks/useSlidingIndicator";

import Breadcrumbs from "../components/Breadcrumbs";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { useShopUI } from "../context/ShopUIContext";
import useProducts from "../hooks/useProducts";
import usePageTitle from "../hooks/usePageTitle";
import { productImage } from "../utils/image";
import { FREE_SHIPPING_THRESHOLD } from "../data/products";

function parseFeatures(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.filter(Boolean);
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v.filter(Boolean) : [];
  } catch {
    return [];
  }
}

export default function ProductDetails() {
  const { id } = useParams();
  const { products, loading, error } = useProducts();
  const { cart, addToCart, changeQty } = useCart();
  const { openCheckout } = useShopUI();

  const product = products.find((p) => p._id === id);
  const [tab, setTab] = useState("description");
  const tabsRef = useRef(null);
  useSlidingIndicator(tabsRef, [tab, Boolean(product)]);
  usePageTitle(product ? product.name : loading ? "Loading…" : "Product not found");

  if (loading) {
    return (
      <div className="page">
        <div className="wrap pd-layout">
          <div className="skeleton pd-image-skeleton" />
          <div>
            <div className="skeleton skeleton-category" />
            <div className="skeleton skeleton-name" style={{ height: 34, marginTop: 14 }} />
            <div className="skeleton skeleton-price" style={{ marginTop: 18 }} />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page">
        <div className="wrap page-state">
          <h1>Product not found</h1>
          <p>This product may have been removed or is no longer available.</p>
          <Link to="/shop" className="btn btn-primary">Continue shopping</Link>
        </div>
      </div>
    );
  }

  const cartItem = cart.find((item) => item._id === product._id);
  const qty = cartItem?.qty || 0;
  const outOfStock = product.quantity <= 0;
  const features = parseFeatures(product.features);
  const related = products
    .filter((p) => p.category === product.category && p._id !== product._id)
    .slice(0, 4);

  function handleBuyNow() {
    if (!qty && !outOfStock) addToCart(product);
    openCheckout();
  }

  return (
    <div className="page">
      <div className="wrap">
        <Breadcrumbs
          items={[
            { label: "Shop", to: "/shop" },
            ...(product.category
              ? [{ label: product.category, to: `/category/${encodeURIComponent(product.category)}` }]
              : []),
            { label: product.name },
          ]}
        />

        <div className="pd-layout">
          <div className="pd-image">
            {product.trending && <span className="badge">Trending</span>}
            <img src={productImage(product.image)} alt={product.name} />
          </div>

          <div className="pd-info">
            {product.category && (
              <Link to={`/category/${encodeURIComponent(product.category)}`} className="pd-category">
                {product.category}
              </Link>
            )}
            <h1>{product.name}</h1>
            <div className="pd-price">₹{product.price}</div>
            <p className="pd-tax">Inclusive of all taxes</p>

            <p className={`pd-stock${outOfStock ? " out" : ""}`}>
              {outOfStock
                ? "Out of stock"
                : product.quantity <= 5
                ? `Hurry, only ${product.quantity} left`
                : "In stock"}
            </p>

            <div className="pd-actions">
              {qty === 0 ? (
                <button className="btn btn-outline pd-btn" disabled={outOfStock} onClick={() => addToCart(product)}>
                  Add to cart
                </button>
              ) : (
                <div className="pd-qty">
                  <button onClick={() => changeQty(product._id, -1)} aria-label="Decrease quantity">−</button>
                  <span>{qty} in cart</span>
                  <button
                    onClick={() => qty < product.quantity && changeQty(product._id, 1)}
                    disabled={qty >= product.quantity}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              )}
              <button className="btn btn-primary pd-btn" disabled={outOfStock} onClick={handleBuyNow}>
                Buy now
              </button>
            </div>

            <ul className="pd-assurance">
              <li>Free delivery on orders over ₹{FREE_SHIPPING_THRESHOLD}</li>
              <li>Cash on delivery available</li>
              <li>Easy 7-day returns</li>
            </ul>

            <div className="pd-tabs glass-tabs" ref={tabsRef} role="tablist">
              {[
                ["description", "Description"],
                ...(features.length ? [["highlights", "Highlights"]] : []),
                ["delivery", "Delivery & returns"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  role="tab"
                  aria-selected={tab === key}
                  className={tab === key ? "active" : ""}
                  onClick={() => setTab(key)}
                >
                  {label}
                </button>
              ))}
            </div>

            <div key={tab} className="pd-tab-panel" role="tabpanel">
              {tab === "description" && (
                <p>{product.description || "No description has been added for this product yet."}</p>
              )}
              {tab === "highlights" && (
                <ul className="pd-features">
                  {features.map((f, i) => (
                    <li key={i}>{typeof f === "string" ? f : f.title || f.name || JSON.stringify(f)}</li>
                  ))}
                </ul>
              )}
              {tab === "delivery" && (
                <>
                  <p>Free delivery on orders over ₹{FREE_SHIPPING_THRESHOLD}; a flat ₹79 fee applies below that. Most orders ship within 48 hours.</p>
                  <p>Eligible items can be returned within 7 days of delivery. <Link to="/returns">Read the returns policy</Link>.</p>
                </>
              )}
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="section related">
            <div className="section-head split">
              <h2>You may also like</h2>
              <Link to={`/category/${encodeURIComponent(product.category)}`} className="view-all">
                More in {product.category} →
              </Link>
            </div>
            <div className="grid">
              {related.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
