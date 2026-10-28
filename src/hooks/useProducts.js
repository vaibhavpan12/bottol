import { useEffect, useState } from "react";
import { BASE_URL } from "../config/api";

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

/** Unique, non-empty categories in catalogue order. */
export function getCategories(products) {
  const seen = new Map();
  products.forEach((p) => {
    const c = (p.category || "").trim();
    if (c) seen.set(c, (seen.get(c) || 0) + 1);
  });
  return [...seen.entries()].map(([name, count]) => ({ name, count }));
}
