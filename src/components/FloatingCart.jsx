import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import Icon from "./Icon";

export default function FloatingCart({ isHidden }) {
  const { cart, totals, openDrawer } = useCart();

  const [isCartVisible, setIsCartVisible] = useState(false);

  // Slide in on every page once the cart has items (drawer/checkout/cart page hide it).
  useEffect(() => {
    if (!cart.length) {
      setIsCartVisible(false);
      return;
    }
    const id = requestAnimationFrame(() => setIsCartVisible(true));
    return () => cancelAnimationFrame(id);
  }, [cart.length]);

  // Tell the rest of the page (AI chat button) that the bar is on screen,
  // so it can move up instead of overlapping.
  const barShown = cart.length > 0 && isCartVisible && !isHidden;
  useEffect(() => {
    document.body.classList.toggle("has-floating-cart", barShown);
    return () => document.body.classList.remove("has-floating-cart");
  }, [barShown]);

  if (cart.length === 0) {
    return null;
  }

  const firstItem = cart[0];

  return (
    <div
      className={`floating-cart ${
        isCartVisible && !isHidden
          ? "floating-cart-visible"
          : "floating-cart-hidden"
      }`}
      onClick={openDrawer}
    >
      <div className="floating-cart-icon">
        <Icon name="cart" />

        <span className="floating-cart-count">{totals.itemCount}</span>
      </div>

      <div className="floating-cart-info">
        <span className="floating-cart-title">
          {cart.length === 1 ? firstItem.name : `${cart.length} products`}
        </span>

        <span className="floating-cart-items">{totals.itemCount} items</span>
      </div>

      <div className="floating-cart-total">₹{totals.total}</div>

      <div className="floating-cart-arrow">→</div>
    </div>
  );
}
