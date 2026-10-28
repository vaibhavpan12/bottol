import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import FeaturedStrip from "../components/FeaturedStrip";
import Spotlight from "../components/Spotlight";
import Perks from "../components/Perks";
import Testimonial from "../components/Testimonial";
import Marquee from "../components/Marquee";
import ProductCard from "../components/ProductCard";
import useProducts from "../hooks/useProducts";
import usePageTitle from "../hooks/usePageTitle";

function NewArrivals() {
  const { products, loading } = useProducts();
  const latest = [...products].reverse().slice(0, 8);
  if (!loading && latest.length === 0) return null;

  return (
    <section className="section">
      <div className="wrap">
        <div className="section-head split">
          <div>
            <span className="kicker">Just in</span>
            <h2>New arrivals</h2>
          </div>
          <Link to="/shop" className="view-all">View all products →</Link>
        </div>
        <div className="grid">
          {loading
            ? Array.from({ length: 4 }, (_, i) => <ProductCard key={i} loading />)
            : latest.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  usePageTitle(null);
  return (
    <>
      <Hero />
      <FeaturedStrip limit={8} />
      <Spotlight />
      <NewArrivals />
      <Marquee text="Free delivery over ₹1499 · Easy returns · Secure checkout" repeat={4} />
      <Perks />
      <Testimonial />
    </>
  );
}
