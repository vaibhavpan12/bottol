import Icon from "./Icon";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";
import AuthModal from "./AuthModal";
import UserDrawer from "./UserDrawer";

const NAV_LINKS = [
  { label: "Shop All", href: "#shop" },
  { label: "The Ritual", href: "#spotlight" },
  { label: "Why Pivora", href: "#perks" },
  { label: "Contact", href: "#footer" },
];

const MARQUEE_ITEMS = [
  "Free shipping over ₹1499",
  "Order by 2pm, ships same day",
  "24hr cold · 12hr hot retention",
  "New — Holo Wave Tumbler",
];

function MarqueeBand() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

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

export default function Navbar() {
  const { totals, openDrawer } = useCart();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userDrawerOpen, setUserDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    function loadUser() {
      const savedUser = localStorage.getItem("user");

      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    }

    loadUser();

    window.addEventListener("auth-changed", loadUser);

    return () => {
      window.removeEventListener("auth-changed", loadUser);
    };
  }, []);

  return (
    <>
      <header>
        <MarqueeBand />

        <nav className="nav wrap">

          <a href="#" className="logo">
            Pivora
          </a>

          <div className="nav-links">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </div>

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
              </button>
            ) : (
              <button
                className="login-btn"
                onClick={() => setAuthModalOpen(true)}
              >
                Login
              </button>
            )}

            <button
              className="icon-btn"
              aria-label="Open cart"
              onClick={openDrawer}
            >
              <Icon name="cart" viewBox="0 0 24 24" />

              {totals.itemCount > 0 && (
                <span className="cart-count">
                  {totals.itemCount}
                </span>
              )}
            </button>

          </div>
        </nav>
      </header>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      <UserDrawer
        isOpen={userDrawerOpen}
        onClose={() => setUserDrawerOpen(false)}
        user={user}
      />
    </>
  );
}