export default function Hero() {
  return (
    <section className="hero">
      <div className="wrap hero-inner">
        <span className="rating-line">
          <span className="stars">★★★★★</span> 4.9 average, 2,400+ reviews
        </span>
        <h1 className="hero-title">
          Carry it well,
          <br />
          <em>carry it daily.</em>
        </h1>
        <p className="hero-sub">
          Pivora is a small batch of insulated tumblers and desk-grade carry gear —
          engineered for the pour, finished for the ritual of your morning.
        </p>
        <div className="hero-ctas">
          <a href="#shop" className="btn btn-primary">Shop the collection</a>
          <a href="#spotlight" className="btn btn-outline">Meet the Aurora</a>
        </div>
      </div>

      <div className="hero-stage">
        <div className="hero-floor" />
        <svg viewBox="0 0 160 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="80" cy="284" rx="46" ry="10" fill="rgba(34,28,21,0.10)" />
          <rect x="24" y="24" width="112" height="240" rx="30" fill="#FFFFFF" stroke="#221C15" strokeWidth="2.2" />
          <path d="M24 54 Q80 44 136 54 V254 Q80 264 24 254 Z" fill="#8B4530" opacity="0.13" />
          <ellipse cx="80" cy="24" rx="56" ry="9" fill="#F7F2E7" stroke="#221C15" strokeWidth="2.2" />
          <rect x="60" y="4" width="40" height="20" rx="7" fill="#221C15" />
          <circle cx="55" cy="150" r="3" fill="#8B4530" opacity="0.5" />
          <circle cx="45" cy="120" r="2" fill="#8B4530" opacity="0.35" />
        </svg>
      </div>
    </section>
  );
}
