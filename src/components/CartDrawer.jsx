import Icon from './Icon';
import { useCart } from '../context/CartContext';

function EmptyCart() {
  return (
    <div className="empty-cart">
      <span className="pi">
        <Icon name="tumbler" />
      </span>
      <p>
        Your cart is empty.
        <br />
        Add something built to last.
      </p>
    </div>
  );
}

function CartItem({ item, onChangeQty, onRemove }) {
  return (
    <div className="cart-item">
      <div className="ci-media">
        <span className="icon-wrap">
          <Icon name={item.icon || 'tumbler'} />
        </span>
      </div>

      <div className="ci-info">
        <span className="ci-name">{item.name}</span>
        <span className="ci-price">₹{item.price}</span>

        <div className="qty-row">
          <button
            className="qty-btn"
            onClick={() => onChangeQty(item._id, -1)}
            aria-label="Decrease quantity"
          >
            −
          </button>

          <span className="qty-val">{item.qty}</span>

          <button
            className="qty-btn"
            onClick={() => onChangeQty(item._id, 1)}
            aria-label="Increase quantity"
          >
            +
          </button>

          <button
            className="remove-link"
            onClick={() => onRemove(item._id)}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CartDrawer({ onCheckout }) {
  const { cart, isDrawerOpen, totals, changeQty, removeItem, closeDrawer } = useCart();

  return (
    <>
      <div className={`overlay${isDrawerOpen ? ' show' : ''}`} onClick={closeDrawer} />
      <aside className={`drawer${isDrawerOpen ? ' show' : ''}`} aria-label="Shopping cart" aria-hidden={!isDrawerOpen}>
        <div className="drawer-head">
          <h3>Your cart</h3>
          <button className="close-x" onClick={closeDrawer} aria-label="Close cart">
            ✕
          </button>
        </div>

        <div className="drawer-body">
          {cart.length === 0 ? (
            <EmptyCart />
          ) : (
            cart.map((item) => (
              <CartItem
                key={item._id}
                item={item}
                onChangeQty={changeQty}
                onRemove={removeItem}
              />
            ))
          )}
        </div>

        <div className="drawer-foot">
          <div className="sub-row">
            <span>Subtotal</span>
            <span>₹{totals.subtotal}</span>
          </div>
          <div className="sub-row">
            <span>Shipping</span>
            <span>{totals.shipping === 0 ? (totals.subtotal === 0 ? '₹0' : 'Free') : `₹${totals.shipping}`}</span>
          </div>
          <div className="sub-row total">
            <span>Total</span>
            <span>₹{totals.total}</span>
          </div>
          <button className="checkout-btn" disabled={cart.length === 0} onClick={onCheckout}>
            Checkout
          </button>
        </div>
      </aside>
    </>
  );
}
