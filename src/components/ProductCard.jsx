import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { BASE_URL } from "../config/api";

export default function ProductCard({
  product,
  loading = false,
  onProductClick,
}) {
  const { cart, addToCart, changeQty } = useCart();

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const navigate = useNavigate();
  const openProduct = () =>
    onProductClick ? onProductClick() : navigate(`/product/${product._id}`);

  const imageUrl = product?.image?.startsWith("/uploads/")
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
    <div
      className="card"
      onClick={openProduct}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          openProduct();
        }
      }}
    >
      <div className="card-media">
        {product.trending && <span className="badge">Trending</span>}

        {/* Image Skeleton */}
        {!imageLoaded && (
          <div className="image-loading-skeleton">
            <div className="skeleton skeleton-image" />
          </div>
        )}

        {imageFailed ? (
          <div className="image-fallback" aria-hidden="true">🛍️</div>
        ) : (
        <img
          src={imageUrl}
          alt={product.name}
          loading="lazy"
          className={`product-image ${
            imageLoaded ? "image-visible" : "image-hidden"
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageLoaded(true);
            setImageFailed(true);
          }}
        />
        )}
      </div>

      <div className="card-body">
        <span className="card-cat">{product.category}</span>

        <span className="card-name">{product.name}</span>

        <span className={`card-spec${product.quantity <= 0 ? " out" : ""}`}>
          {product.quantity <= 0 ? "Out of stock" : product.quantity <= 5 ? `Only ${product.quantity} left` : "In stock"}
        </span>

        <div className="card-bottom">
          <span className="price">₹{product.price}</span>

          {(() => {
            const cartItem = cart.find((item) => item._id === product._id);

            {
              /* Add button */
            }
            if (!cartItem) {
              return (
                <button
                  className="add-btn"
                  aria-label={`Add ${product.name} to cart`}
                  disabled={product.quantity <= 0}
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                  }}
                >
                  <span>+</span>
                </button>
              );
            }

            {
              /* Quantity control */
            }
            return (
              <div className="card-qty-control">
                <button
                  className="qty-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    changeQty(product._id, -1);
                  }}
                  aria-label="Decrease quantity"
                >
                  −
                </button>

                <span className="qty-value">{cartItem.qty}</span>

                <button
                  className="qty-btn"
                  onClick={(e) => {
                    e.stopPropagation();

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
