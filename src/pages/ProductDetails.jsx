import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { BASE_URL } from '../config/api';
import { useCart } from '../context/CartContext';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { cart, addToCart, changeQty } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${BASE_URL}/api/products/AllProducts`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }

        return response.json();
      })
      .then((data) => {
        const foundProduct = (data.products || []).find(
          (item) => item._id === id
        );

        if (!foundProduct) {
          throw new Error('Product not found');
        }

        setProduct(foundProduct);
      })
      .catch((error) => {
        console.error(error);
        setError('Unable to load product');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="product-details-page">
        <div className="wrap">
          <div className="product-details-loading">
            Loading product...
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-details-page">
        <div className="wrap">
          <button
            className="product-back-btn"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

          <div className="product-details-error">
            <h2>Product not found</h2>
            <p>{error}</p>

            <button
              className="details-continue-btn"
              onClick={() => navigate('/')}
            >
              Back to shop
            </button>
          </div>
        </div>
      </div>
    );
  }

  const cartItem = cart.find(
    (item) => item._id === product._id
  );

  const quantityInCart = cartItem?.qty || 0;

  const imageUrl = product.image?.startsWith('/uploads/')
    ? `${BASE_URL}${product.image}`
    : product.image;

  const handleAdd = () => {
    if (quantityInCart < product.quantity) {
      addToCart(product);
    }
  };

  return (
    <div className="product-details-page">

      <div className="wrap">

        {/* Back */}
        {/* <button
          className="product-back-btn"
          onClick={() => navigate(-1)}
        >
          ← Back to collection
        </button> */}

        <div className="product-details">

          {/* Product Image */}
          <div className="product-details-image-wrap">

            {product.trending && (
              <span className="badge product-details-badge">
                Trending
              </span>
            )}

            <img
              src={imageUrl}
              alt={product.name}
              className="product-details-image"
            />

          </div>

          {/* Product Info */}
          <div className="product-details-info">

            <span className="product-details-category">
              {product.category}
            </span>

            <h1>{product.name}</h1>

            <div className="product-details-price">
              ₹{product.price}
            </div>

            <div className="product-details-divider" />

            <div className="product-details-stock">
              <span>Availability</span>

              <strong>
                {product.quantity > 0
                  ? `${product.quantity} available`
                  : 'Out of stock'}
              </strong>
            </div>

            <p className="product-details-description">
              Designed with precision and made for everyday
              use. Explore the perfect combination of style,
              comfort and functionality.
            </p>

            {/* Quantity */}
            {quantityInCart > 0 ? (
              <div className="details-qty-control">

                <button
                  onClick={() =>
                    changeQty(product._id, -1)
                  }
                  aria-label="Decrease quantity"
                >
                  −
                </button>

                <span>{quantityInCart}</span>

                <button
                  onClick={handleAdd}
                  disabled={
                    quantityInCart >= product.quantity
                  }
                  aria-label="Increase quantity"
                >
                  +
                </button>

              </div>
            ) : (
              <button
                className="details-add-btn"
                onClick={handleAdd}
                disabled={product.quantity <= 0}
              >
                {product.quantity > 0
                  ? 'Add to cart'
                  : 'Out of stock'}
              </button>
            )}

            {/* Product highlights */}
            <div className="product-highlights">

              <div className="product-highlight">
                <span>✓</span>
                <div>
                  <strong>Premium quality</strong>
                  <small>Built for everyday use</small>
                </div>
              </div>

              <div className="product-highlight">
                <span>✓</span>
                <div>
                  <strong>Fast delivery</strong>
                  <small>Carefully packed and shipped</small>
                </div>
              </div>

              <div className="product-highlight">
                <span>✓</span>
                <div>
                  <strong>Easy checkout</strong>
                  <small>Simple and secure ordering</small>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}