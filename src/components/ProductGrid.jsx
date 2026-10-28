import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ProductCard from "./ProductCard";
import ProductDetailsModal from "./ProductDetailsModal";
import useProducts, { getCategories } from "../hooks/useProducts";

const SORTS = {
  featured: "Featured",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  name: "Name: A to Z",
};

export default function ProductGrid() {
  const { products, loading, error } = useProducts();
  const [params, setParams] = useSearchParams();
  const [sort, setSort] = useState("featured");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const activeFilter = params.get("cat") || "all";
  const query = (params.get("q") || "").trim().toLowerCase();

  const filters = useMemo(
    () => ["all", "Trending", ...getCategories(products).map((c) => c.name)],
    [products]
  );

  function setFilter(filter) {
    const next = new URLSearchParams(params);
    if (filter === "all") next.delete("cat");
    else next.set("cat", filter);
    setParams(next, { replace: true });
  }

  function clearSearch() {
    const next = new URLSearchParams(params);
    next.delete("q");
    setParams(next, { replace: true });
  }

  const items = useMemo(() => {
    let list = products;

    if (activeFilter === "Trending") list = list.filter((p) => p.trending === true);
    else if (activeFilter !== "all") list = list.filter((p) => p.category === activeFilter);

    if (query) {
      list = list.filter((p) =>
        [p.name, p.category, p.description]
          .filter(Boolean)
          .some((field) => String(field).toLowerCase().includes(query))
      );
    }

    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
  }, [products, activeFilter, query, sort]);

  return (
    <section className="section" id="shop">
      <div className="wrap">
        <div className="section-head split">
          <div>
            <span className="kicker">All products</span>
            <h2>
              {query
                ? `Results for "${params.get("q")}"`
                : activeFilter === "all"
                ? "Shop everything"
                : activeFilter}
            </h2>
            {!loading && !error && (
              <p className="result-count">
                {items.length} {items.length === 1 ? "product" : "products"}
                {query && (
                  <button className="clear-search" onClick={clearSearch}>
                    Clear search
                  </button>
                )}
              </p>
            )}
          </div>

          <label className="sort-select">
            <span>Sort by</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              {Object.entries(SORTS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="tabs">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`tab${activeFilter === filter ? " active" : ""}`}
              onClick={() => setFilter(filter)}
            >
              {filter === "all" ? "All" : filter}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <ProductCard key={`skeleton-${item}`} loading />
            ))}
          </div>
        ) : error ? (
          <div className="empty-products">
            <div className="empty-products-icon"><span>!</span></div>
            <div className="empty-products-content">
              <span className="empty-products-kicker">Something went wrong</span>
              <h3>Unable to load products</h3>
              <p>We couldn't load the store right now.<br />Please refresh or try again in a moment.</p>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="empty-products">
            <div className="empty-products-icon"><span>◌</span></div>
            <div className="empty-products-content">
              <span className="empty-products-kicker">No matches</span>
              <h3>No products found</h3>
              <p>Try a different search or category.<br />New products are added every week.</p>
            </div>
          </div>
        ) : (
          <div className="grid">
            {items.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onProductClick={() => setSelectedProduct(product)}
              />
            ))}
          </div>
        )}
      </div>

      <ProductDetailsModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </section>
  );
}
