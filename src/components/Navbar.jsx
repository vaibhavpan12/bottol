import Icon from "./Icon";
import { useCart } from "../context/CartContext";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams, useLocation, Link, NavLink } from "react-router-dom";
import useSlidingIndicator from "../hooks/useSlidingIndicator";
import UserDrawer from "./UserDrawer";
import useProducts, { getCategories } from "../hooks/useProducts";

const ANNOUNCEMENTS = [
  "Free delivery on orders over ₹1499",
  "Easy 7-day returns",
  "Cash on delivery available",
  "New arrivals added every week",
];

function AnnouncementBar() {
  const items = [...ANNOUNCEMENTS, ...ANNOUNCEMENTS];
  return (
    <div className="marquee clay">
      <div className="marquee-track">
        {items.map((text, i) => (
          <span key={i}>{text}</span>
        ))}
      </div>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="18" height="18" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export default function Navbar({ onLogin, setToast }) {
  const { totals, openDrawer } = useCart();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { products } = useProducts();
  const categories = getCategories(products).slice(0, 7);

  const { pathname } = useLocation();
  const tabsRef = useRef(null);
  useSlidingIndicator(tabsRef, [pathname, categories.length]);

  const [userDrawerOpen, setUserDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [query, setQuery] = useState(params.get("q") || "");

  useEffect(() => {
    setQuery(params.get("q") || "");
  }, [params]);

  useEffect(() => {
    function loadUser() {
      const savedUser = localStorage.getItem("user");
      try {
        setUser(savedUser ? JSON.parse(savedUser) : null);
      } catch {
        setUser(null);
      }
    }
    loadUser();
    window.addEventListener("auth-changed", loadUser);
    return () => window.removeEventListener("auth-changed", loadUser);
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
  }

  return (
    <>
      <header className="site-header">
        <AnnouncementBar />

        <nav className="nav wrap">
          <Link to="/" className="logo">
            <span className="logo-mark">P</span>
            Pivora
          </Link>

          <form className="nav-search" onSubmit={handleSearch} role="search">
            <SearchIcon />
            <input
              type="search"
              placeholder="Search products, brands and categories"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search products"
            />
            <button type="submit">Search</button>
          </form>

          <div className="nav-actions">
            {user ? (
              <button
                className="user-header-btn"
                onClick={() => setUserDrawerOpen(true)}
                aria-label="Open account"
              >
                <span className="user-header-avatar">
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
                <span className="nav-action-label">
                  Hi, {user.name?.split(" ")[0] || "there"}
                </span>
              </button>
            ) : (
              <button className="login-btn" onClick={onLogin}>
                Sign in
              </button>
            )}

            <Link to="/orders" className="nav-text-link">Orders</Link>
            <button className="icon-btn" aria-label="Open cart" onClick={openDrawer}>
              <Icon name="cart" viewBox="0 0 24 24" />
              {totals.itemCount > 0 && (
                <span className="cart-count">{totals.itemCount}</span>
              )}
            </button>
          </div>
        </nav>

        <div className="cat-bar">
          <div className="wrap cat-bar-inner glass-tabs" ref={tabsRef}>
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/shop">All products</NavLink>
            <NavLink to="/deals" className="deal-link">Today's deals</NavLink>
            {categories.map((c) => (
              <NavLink key={c.name} to={`/category/${encodeURIComponent(c.name)}`}>
                {c.name}
              </NavLink>
            ))}
            <NavLink to="/categories">All categories</NavLink>
          </div>
        </div>
      </header>

      <UserDrawer
        isOpen={userDrawerOpen}
        onClose={() => setUserDrawerOpen(false)}
        user={user}
        onSuccess={(message) => setToast({ type: "success", message })}
      />
    </>
  );
}
