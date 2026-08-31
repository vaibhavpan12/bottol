import Icon from './Icon';
import { PRODUCTS } from '../data/products';
import { useCart } from '../context/CartContext';

// The three products that make up "the daily ritual" — pour, carry, protect.
const FEATURED_IDS = [1, 5, 12];

export default function FeaturedStrip() {
  const { addToCart } = useCart();
  const items = FEATURED_IDS.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean);

  return (
    <section className="featured-strip">
      <div className="wrap">
        {items.map((product) => (
          <button
            key={product.id}
            className="featured-item"
            onClick={() => addToCart(product)}
            aria-label={`Add ${product.name} to cart, ₹${product.price}`}
          >
            <span className="featured-media">
              <span className="icon-wrap">
                <Icon name={product.icon} />
              </span>
            </span>
            <span className="featured-info">
              <b>{product.name}</b>
              <span>₹{product.price} · Build your ritual</span>
            </span>
            <span className="featured-arrow">
              <span style={{ width: 18, height: 18, display: 'block' }}>
                <Icon name="arrowRight" viewBox="0 0 24 24" />
              </span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
