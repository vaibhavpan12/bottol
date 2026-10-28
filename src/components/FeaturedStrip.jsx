import { Link } from "react-router-dom";
import useProducts, { getCategories } from "../hooks/useProducts";
import { productImage } from "../utils/image";

// "Shop by category" tiles, built from whatever categories exist in the catalogue.
export default function FeaturedStrip({ limit = 8, showAll = false, title = "Shop by category" }) {
  const { products, loading } = useProducts();
  const categories = getCategories(products);
  const shown = showAll ? categories : categories.slice(0, limit);

  if (!loading && categories.length === 0) return null;


  return (
    <section className="section categories" id="categories">
      <div className="wrap">
        <div className="section-head split">
          <div>
            <span className="kicker">Browse</span>
            <h2>{title}</h2>
          </div>
          {!showAll && categories.length > shown.length && (
            <Link to="/categories" className="view-all">All categories →</Link>
          )}
        </div>

        <div className="cat-grid">
          {loading
            ? [1, 2, 3, 4].map((i) => (
                <div key={i} className="cat-tile">
                  <div className="skeleton cat-tile-img" />
                  <div className="skeleton skeleton-name" />
                </div>
              ))
            : shown.map((c) => {
                const sample = products.find((p) => p.category === c.name && p.image);
                return (
                  <Link key={c.name} className="cat-tile" to={`/category/${encodeURIComponent(c.name)}`}>
                    <span className="cat-tile-img">
                      {sample ? (
                        <img src={productImage(sample.image)} alt="" loading="lazy" />
                      ) : (
                        <span className="cat-initial">{c.name.charAt(0)}</span>
                      )}
                    </span>
                    <b>{c.name}</b>
                    <span>{c.count} {c.count === 1 ? "item" : "items"}</span>
                  </Link>
                );
              })}
        </div>
      </div>
    </section>
  );
}
