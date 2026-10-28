import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useParams, useSearchParams } from "react-router-dom";
import useSlidingIndicator from "../hooks/useSlidingIndicator";

import ProductCard from "../components/ProductCard";
import Breadcrumbs from "../components/Breadcrumbs";
import useProducts, { getCategories } from "../hooks/useProducts";
import usePageTitle from "../hooks/usePageTitle";

const PAGE_SIZE = 24;

const SORTS = {
  featured: "Featured",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  name: "Name: A to Z",
};

/**
 * Product listing page. Used for:
 *   /shop                 all products (supports ?q= search)
 *   /category/:category   one category
 *   /deals                trending products
 */
export default function Shop({ mode = "all" }) {
  const { category: categoryParam } = useParams();
  const category = categoryParam ? decodeURIComponent(categoryParam) : null;
  const { products, loading, error } = useProducts();
  const [params, setParams] = useSearchParams();
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const query = (params.get("q") || "").trim();
  const sort = params.get("sort") || "featured";
  const minPrice = params.get("min") || "";
  const maxPrice = params.get("max") || "";
  const inStock = params.get("stock") === "1";

  const title =
    mode === "deals" ? "Today's deals" : category ? category : query ? `Search: ${query}` : "All products";
  usePageTitle(title);

  const categories = useMemo(() => getCategories(products), [products]);
  const { pathname } = useLocation();
  const catListRef = useRef(null);
  useSlidingIndicator(catListRef, [pathname, categories.length, filtersOpen], "a.active");

  function setParam(key, value) {
    const next = new URLSearchParams(params);
    if (value === "" || value === null || value === false) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  }

  function clearFilters() {
    const next = new URLSearchParams();
    if (query) next.set("q", query);
    setParams(next, { replace: true });
  }

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [category, mode, query, sort, minPrice, maxPrice, inStock]);

  const items = useMemo(() => {
    let list = products;
    if (mode === "deals") list = list.filter((p) => p.trending);
    if (category) list = list.filter((p) => p.category === category);

    if (query) {
      const q = query.toLowerCase();
      list = list.filter((p) =>
        [p.name, p.category, p.description].filter(Boolean).some((f) => String(f).toLowerCase().includes(q))
      );
    }
    if (minPrice !== "") list = list.filter((p) => p.price >= Number(minPrice));
    if (maxPrice !== "") list = list.filter((p) => p.price <= Number(maxPrice));
    if (inStock) list = list.filter((p) => p.quantity > 0);

    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
  }, [products, mode, category, query, minPrice, maxPrice, inStock, sort]);

  const hasFilters = minPrice !== "" || maxPrice !== "" || inStock;
  const crumbs =
    mode === "deals"
      ? [{ label: "Today's deals" }]
      : category
      ? [{ label: "Shop", to: "/shop" }, { label: category }]
      : [{ label: "Shop" }];

  return (
    <div className="page shop-page">
      <div className="wrap">
        <Breadcrumbs items={crumbs} />

        <div className="page-head">
          <div>
            <h1>{title}</h1>
            {!loading && !error && (
              <p className="result-count">
                {items.length} {items.length === 1 ? "product" : "products"}
                {query && (
                  <button className="clear-search" onClick={() => setParam("q", "")}>
                    Clear search
                  </button>
                )}
              </p>
            )}
          </div>

          <div className="page-head-actions">
            <button className="filter-toggle" onClick={() => setFiltersOpen((o) => !o)}>
              Filters{hasFilters ? " •" : ""}
            </button>
            <label className="sort-select">
              <span>Sort by</span>
              <select value={sort} onChange={(e) => setParam("sort", e.target.value === "featured" ? "" : e.target.value)}>
                {Object.entries(SORTS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="shop-layout">
          <aside className={`shop-filters${filtersOpen ? " open" : ""}`}>
            <div className="filter-block">
              <h4>Categories</h4>
              <ul className="glass-tabs vertical" ref={catListRef}>
                <li>
                  <Link to="/shop" className={mode === "all" && !category ? "active" : ""}>All products</Link>
                </li>
                <li>
                  <Link to="/deals" className={mode === "deals" ? "active" : ""}>Today's deals</Link>
                </li>
                {categories.map((c) => (
                  <li key={c.name}>
                    <Link
                      to={`/category/${encodeURIComponent(c.name)}`}
                      className={category === c.name ? "active" : ""}
                    >
                      {c.name} <span>{c.count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="filter-block">
              <h4>Price (₹)</h4>
              <div className="price-inputs">
                <input
                  type="number" min="0" placeholder="Min" value={minPrice}
                  onChange={(e) => setParam("min", e.target.value)} aria-label="Minimum price"
                />
                <span>–</span>
                <input
                  type="number" min="0" placeholder="Max" value={maxPrice}
                  onChange={(e) => setParam("max", e.target.value)} aria-label="Maximum price"
                />
              </div>
            </div>

            <div className="filter-block">
              <label className="check-row">
                <input type="checkbox" checked={inStock} onChange={(e) => setParam("stock", e.target.checked ? "1" : "")} />
                In stock only
              </label>
            </div>

            {hasFilters && (
              <button className="clear-filters" onClick={clearFilters}>Clear filters</button>
            )}
          </aside>

          <div className="shop-results">
            {loading ? (
              <div className="grid">
                {Array.from({ length: 8 }, (_, i) => <ProductCard key={i} loading />)}
              </div>
            ) : error ? (
              <div className="page-state">
                <h2>Unable to load products</h2>
                <p>Please refresh the page or try again in a moment.</p>
              </div>
            ) : items.length === 0 ? (
              <div className="page-state">
                <h2>No products found</h2>
                <p>Try a different search, category or price range.</p>
                <Link to="/shop" className="btn btn-primary">View all products</Link>
              </div>
            ) : (
              <>
                <div className="grid">
                  {items.slice(0, visible).map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
                {visible < items.length && (
                  <div className="load-more">
                    <p>Showing {visible} of {items.length}</p>
                    <button className="btn btn-outline" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                      Load more
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
