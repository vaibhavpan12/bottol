import { Link } from "react-router-dom";
import useProducts from "../hooks/useProducts";
import ProductCard from "./ProductCard";

// "Today's deals" — trending products from the catalogue (falls back to the first few).
export default function Spotlight() {
  const { products, loading } = useProducts();

  const trending = products.filter((p) => p.trending);
  const deals = (trending.length ? trending : products).slice(0, 4);

  if (!loading && deals.length === 0) return null;

  return (
    <section className="section deals" id="deals">
      <div className="wrap">
        <div className="deals-banner">
          <div>
            <span className="kicker">Today's deals</span>
            <h2>Trending picks at great prices</h2>
            <p>Our most popular products this week, while stocks last.</p>
          </div>
          <Link to="/deals" className="btn btn-light">See all deals</Link>
        </div>

        <div className="grid">
          {loading
            ? [1, 2, 3, 4].map((i) => <ProductCard key={i} loading />)
            : deals.map((product) => (
<ProductCard key={product._id} product={product} />
              ))}
        </div>
      </div>
    </section>
  );
}
