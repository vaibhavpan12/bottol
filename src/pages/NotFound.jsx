import { Link } from "react-router-dom";
import usePageTitle from "../hooks/usePageTitle";

export default function NotFound() {
  usePageTitle("Page not found");
  return (
    <div className="page">
      <div className="wrap page-state">
        <span className="big-code">404</span>
        <h1>Page not found</h1>
        <p>The page you're looking for doesn't exist or has moved.</p>
        <div className="hero-ctas" style={{ justifyContent: "center" }}>
          <Link to="/" className="btn btn-primary">Go home</Link>
          <Link to="/shop" className="btn btn-outline">Browse products</Link>
        </div>
      </div>
    </div>
  );
}
