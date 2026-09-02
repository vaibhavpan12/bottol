import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { BASE_URL } from '../config/api';
export default function ProductCard({ product, loading = false }) {
  const {
    cart,
    addToCart,
    changeQty,
    removeItem,
  } = useCart();
  const [imageLoaded, setImageLoaded] = useState(false);

  const imageUrl = product?.image?.startsWith('/uploads/')
    ? `${BASE_URL}${product.image}`
    : product?.image;

  // Skeleton card
  if (loading) {
    return (
      <div className="card product-skeleton-card">

        <div className="card-media skeleton-media">
          <div className="skeleton skeleton-image" />
        </div>

        <div className="card-body">

          <div className="skeleton skeleton-category" />

          <div className="skeleton skeleton-name" />

          <div className="skeleton skeleton-spec" />

          <div className="card-bottom">

            <div className="skeleton skeleton-price" />

            <div className="skeleton skeleton-button" />

          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="card">

      <div className="card-media">

        {product.trending && (
          <span className="badge">Trending</span>
        )}

        {/* Image Skeleton */}
        {!imageLoaded && (
          <div className="image-loading-skeleton">
            <div className="skeleton skeleton-image" />
          </div>
        )}

        <img
          src={imageUrl}
          alt={product.name}
          className={`product-image ${imageLoaded ? 'image-visible' : 'image-hidden'
            }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(true)}
        />

      </div>

      <div className="card-body">

        <span className="card-cat">
          {product.category}
        </span>

        <span className="card-name">
          {product.name}
        </span>

        <span className="card-spec">
          {product.quantity} available
        </span>

        <div className="card-bottom">
          <span className="price">
            ₹{product.price}
          </span>

          {(() => {
            const cartItem = cart.find(
              (item) => item._id === product._id
            );

            if (!cartItem) {
              return (
                <button
                  className="add-btn"
                  aria-label={`Add ${product.name} to cart`}
                  disabled={product.quantity <= 0}
                  onClick={() => addToCart(product)}
                >
                  <span>+</span>
                </button>
              );
            }

            return (
              <div className="card-qty-control">
                <button
                  className="qty-btn"
                  onClick={() => changeQty(product._id, -1)}
                  aria-label="Decrease quantity"
                >
                  −
                </button>

                <span className="qty-value">
                  {cartItem.qty}
                </span>

                <button
                  className="qty-btn"
                  onClick={() => {
                    if (cartItem.qty < product.quantity) {
                      changeQty(product._id, 1);
                    }
                  }}
                  disabled={cartItem.qty >= product.quantity}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            );
          })()}
        </div>

      </div>

    </div>
  );
}