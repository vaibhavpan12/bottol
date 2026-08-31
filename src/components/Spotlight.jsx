import { PRODUCTS } from '../data/products';
import { useCart } from '../context/CartContext';

const AURORA = PRODUCTS.find((p) => p.id === 1);

export default function Spotlight() {
  const { addToCart } = useCart();

  return (
    <section className="spotlight" id="spotlight">
      <div className="wrap spotlight-grid">
        <div className="spotlight-text">
          <span className="spotlight-eyebrow">Meet the flagship</span>
          <h2>
            The <em>Aurora</em>, built for the cup that never leaves your hand.
          </h2>
          <p>
            Double-walled 18/8 stainless steel, vacuum-sealed to hold cold for a full
            day and hot through your longest meeting. The lid seats with a soft click
            you can feel — no rattle, no drip, no second-guessing your bag.
          </p>
          <p>
            Not adapted from a bottle mould. The Aurora was drafted line-by-line by an
            engineer who was tired of tumblers that sweat through the afternoon.
          </p>

          <div className="spotlight-specs">
            <div>
              <b>710ml</b>
              <span>Capacity</span>
            </div>
            <div>
              <b>24h</b>
              <span>Cold retention</span>
            </div>
            <div>
              <b>12h</b>
              <span>Hot retention</span>
            </div>
          </div>

          <button className="btn btn-primary" onClick={() => addToCart(AURORA)}>
            Add the Aurora — ₹{AURORA.price}
          </button>
        </div>

        <div className="spotlight-visual">
          <svg viewBox="0 0 160 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="24" y="24" width="112" height="240" rx="30" fill="#FFFFFF" stroke="#221C15" strokeWidth="2.2" />
            <path d="M24 60 Q80 50 136 60 V250 Q80 260 24 250 Z" fill="#4B5A3F" opacity="0.14" />
            <ellipse cx="80" cy="24" rx="56" ry="9" fill="#EEE3D0" stroke="#221C15" strokeWidth="2.2" />
            <rect x="60" y="4" width="40" height="20" rx="7" fill="#221C15" />
            <circle cx="52" cy="140" r="2.4" fill="#221C15" opacity="0.4" />
            <circle cx="60" cy="165" r="1.8" fill="#221C15" opacity="0.3" />
          </svg>
        </div>
      </div>
    </section>
  );
}
