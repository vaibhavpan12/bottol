import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="hero">
      <div className="wrap hero-layout">
        <div className="hero-main">
          <span className="hero-kicker">New season · Up to 40% off</span>
          <h1 className="hero-title">
            Everything you need,
            <br />
            <em>delivered to your door.</em>
          </h1>
          <p className="hero-sub">
            Shop electronics, home, fashion, accessories and more from one place.
            Fair prices, secure checkout and quick delivery across India.
          </p>
          <div className="hero-ctas">
            <Link to="/shop" className="btn btn-primary">Start shopping</Link>
            <Link to="/deals" className="btn btn-outline">See today's deals</Link>
          </div>
          <ul className="hero-points">
            <li>Free delivery over ₹1499</li>
            <li>Cash on delivery</li>
            <li>7-day returns</li>
          </ul>
        </div>

        <div className="hero-side">
          <Link to="/categories" className="hero-tile tile-a">
            <span className="tile-kicker">Browse</span>
            <b>Shop by category</b>
            <span className="tile-link">Explore →</span>
          </Link>
          <Link to="/deals" className="hero-tile tile-b">
            <span className="tile-kicker">Limited time</span>
            <b>Trending right now</b>
            <span className="tile-link">View deals →</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
