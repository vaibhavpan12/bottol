import { useEffect } from 'react';
import { BASE_URL } from '../config/api';
import { useCart } from '../context/CartContext';

export default function ProductDetailsModal({
  product,
  onClose,
}) {
  const {
    cart,
    addToCart,
    changeQty,
  } = useCart();

  useEffect(() => {
    if (!product) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [product, onClose]);

  if (!product) return null;

  const cartItem = cart.find(
    (item) => item._id === product._id
  );

  const qty = cartItem?.qty || 0;

  const imageUrl = product.image?.startsWith('/uploads/')
    ? `${BASE_URL}${product.image}`
    : product.image;

  const increaseQty = () => {
    if (qty < product.quantity) {
      if (qty === 0) {
        addToCart(product);
      } else {
        changeQty(product._id, 1);
      }
    }
  };

  const decreaseQty = () => {
    if (qty > 0) {
      changeQty(product._id, -1);
    }
  };

  return (
    <div
      className="product-modal-overlay"
      onClick={onClose}
    >
      <div
        className="product-modal"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Close */}
        <button
          className="product-modal-close"
          onClick={onClose}
          aria-label="Close product details"
        >
          ×
        </button>

        {/* Image */}
        <div className="product-modal-image-wrap">

          {product.trending && (
            <span className="badge product-modal-badge">
              Trending
            </span>
          )}

          <img
            src={imageUrl}
            alt={product.name}
            className="product-modal-image"
          />

        </div>

        {/* Details */}
        <div className="product-modal-content">

          <span className="product-modal-category">
            {product.category}
          </span>

          <h2>{product.name}</h2>

          <div className="product-modal-price">
            ₹{product.price}
          </div>

          <p className="product-modal-description">
            Designed with precision for everyday use.
            A perfect combination of style,
            functionality and comfort.
          </p>

          <div className="product-modal-stock">
            <span>Availability</span>

            <strong>
              {product.quantity > 0
                ? `${product.quantity} available`
                : 'Out of stock'}
            </strong>
          </div>

          {/* Cart controls */}
          {qty === 0 ? (
            <button
              className="product-modal-add"
              onClick={increaseQty}
              disabled={product.quantity <= 0}
            >
              {product.quantity > 0
                ? 'Add to cart'
                : 'Out of stock'}
            </button>
          ) : (
            <div className="product-modal-qty">

              <button
                onClick={decreaseQty}
                aria-label="Decrease quantity"
              >
                −
              </button>

              <span>{qty}</span>

              <button
                onClick={increaseQty}
                disabled={qty >= product.quantity}
                aria-label="Increase quantity"
              >
                +
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}