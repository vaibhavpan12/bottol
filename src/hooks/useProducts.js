import { useEffect, useState } from "react";
import { BASE_URL } from "../config/api";
import { CATEGORIES } from "../data/categories";

// One shared request for the whole storefront, instead of every section
// fetching the full catalogue separately.
let cache = null;
let inflight = null;

function loadProducts() {
  if (cache) return Promise.resolve(cache);
  if (!inflight) {
    inflight = fetch(`${BASE_URL}/api/products/AllProducts`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        cache = data.products || [];
        return cache;
      })
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

export default function useProducts() {
  const [products, setProducts] = useState(cache || []);
  const [loading, setLoading] = useState(!cache);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    loadProducts()
      .then((list) => alive && setProducts(list))
      .catch((err) => {
        console.error(err);
        if (alive) setError("Unable to load products");
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  return { products, loading, error };
}

/**
 * The store's fixed categories (src/data/categories.js) with product counts.
 * Products whose category isn't in that list are still shown under "All products".
 */
export function getCategories(products) {
  const counts = new Map();
  products.forEach((p) => {
    const c = (p.category || "").trim();
    if (c) counts.set(c, (counts.get(c) || 0) + 1);
  });
  return CATEGORIES.map((c) => ({ ...c, count: counts.get(c.name) || 0 }));
}
