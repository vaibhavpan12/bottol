import Icon from './Icon';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="card">
      <div className="card-media">
        {product.badge && <span className="badge">{product.badge}</span>}
        <span className="icon-wrap">
          <Icon name={product.icon} />
        </span>
      </div>
      <div className="card-body">
        <span className="card-cat">{product.cat}</span>
        <span className="card-name">{product.name}</span>
        <span className="card-spec">{product.spec}</span>
        <div className="card-bottom">
          <span className="price">₹{product.price}</span>
          <button
            className="add-btn"
            aria-label={`Add ${product.name} to cart`}
            onClick={() => addToCart(product)}
          >
            <Icon name="plus" viewBox="0 0 24 24" stroke="white" />
          </button>
        </div>
      </div>
    </div>
  );
}
