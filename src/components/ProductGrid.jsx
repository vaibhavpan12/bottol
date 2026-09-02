import { useEffect, useMemo, useState } from 'react';
import { FILTERS } from '../data/products';
import ProductCard from './ProductCard';

const FILTER_LABELS = {
  all: 'All',
  Tumblers: 'Tumblers',
  Trending: 'Trending',
  New: 'New drops',
};

export default function ProductGrid() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/products/AllProducts')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        return response.json();
      })
      .then((data) => {
        setProducts(data.products);
      })
      .catch((error) => {
        console.error(error);
        setError('Unable to load products');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const items = useMemo(() => {
    if (activeFilter === 'all') {
      return products;
    }

    if (activeFilter === 'Trending') {
      return products.filter(
        (product) => product.trending === true
      );
    }

    return products.filter(
      (product) => product.category === activeFilter
    );
  }, [products, activeFilter]);

  return (
    <section className="section" id="shop">
      <div className="wrap">

        <div className="section-head split">

          <div>
            <span className="kicker">
              Full catalog
            </span>

            <h2>
              Shop the collection
            </h2>
          </div>

          <div className="tabs">

            {FILTERS.map((filter) => (
              <button
                key={filter}
                className={`tab${activeFilter === filter
                  ? ' active'
                  : ''
                  }`}
                onClick={() =>
                  setActiveFilter(filter)
                }
              >
                {FILTER_LABELS[filter]}
              </button>
            ))}

          </div>

        </div>


        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid">

            {[1, 2, 3, 4].map((item) => (
              <ProductCard
                key={`skeleton-${item}`}
                loading={true}
              />
            ))}

          </div>

        ) : error ? (

          <p>{error}</p>

        ) : (

          <div className="grid">

            {items.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}

          </div>

        )}

      </div>
    </section>
  );
}