import { Link } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
import { useCart } from "../context/CartContext";
import { useShopUI } from "../context/ShopUIContext";
import usePageTitle from "../hooks/usePageTitle";
import { productImage } from "../utils/image";
import { FREE_SHIPPING_THRESHOLD } from "../data/products";

export default function Cart() {
  usePageTitle("Your cart");
  const { cart, totals, changeQty, removeItem } = useCart();
  const { openCheckout } = useShopUI();

  const remaining = FREE_SHIPPING_THRESHOLD - totals.subtotal;

  return (
    <div className="page">
      <div className="wrap">
        <Breadcrumbs items={[{ label: "Cart" }]} />
        <div className="page-head">
          <h1>Your cart</h1>
        </div>

        {cart.length === 0 ? (
          <div className="page-state">
            <h2>Your cart is empty</h2>
            <p>Browse the store and add products you love.</p>
            <Link to="/shop" className="btn btn-primary">Start shopping</Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-list">
              {cart.map((item) => (
                <div className="cart-row" key={item._id}>
                  <Link to={`/product/${item._id}`} className="cart-row-img">
                    {item.image && <img src={productImage(item.image)} alt={item.name} />}
                  </Link>
                  <div className="cart-row-info">
                    <Link to={`/product/${item._id}`} className="cart-row-name">{item.name}</Link>
                    {item.category && <span className="cart-row-cat">{item.category}</span>}
                    <span className="cart-row-price">₹{item.price}</span>
                    <div className="cart-row-actions">
                      <div className="pd-qty small">
                        <button onClick={() => changeQty(item._id, -1)} aria-label="Decrease quantity">−</button>
                        <span>{item.qty}</span>
                        <button
                          onClick={() => changeQty(item._id, 1)}
                          disabled={item.quantity !== undefined && item.qty >= item.quantity}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <button className="remove-link" onClick={() => removeItem(item._id)}>Remove</button>
                    </div>
                  </div>
                  <div className="cart-row-total">₹{item.price * item.qty}</div>
                </div>
              ))}
            </div>

            <aside className="cart-summary">
              <h3>Order summary</h3>
              {remaining > 0 ? (
                <p className="ship-note">Add ₹{remaining} more for free delivery</p>
              ) : (
                <p className="ship-note ok">You've unlocked free delivery</p>
              )}
              <div className="sub-row"><span>Items ({totals.itemCount})</span><span>₹{totals.subtotal}</span></div>
              <div className="sub-row"><span>Delivery</span><span>{totals.shipping === 0 ? "Free" : `₹${totals.shipping}`}</span></div>
              <div className="sub-row total"><span>Total</span><span>₹{totals.total}</span></div>
              <button className="checkout-btn" onClick={openCheckout}>Proceed to checkout</button>
              <Link to="/shop" className="view-cart-link">Continue shopping</Link>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
