import { useEffect, useMemo, useState } from 'react';

import { FILTERS } from '../data/products';

import ProductCard from './ProductCard';

import { BASE_URL } from '../config/api';
import ProductDetailsModal from './ProductDetailsModal';
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
const [selectedProduct, setSelectedProduct] = useState(null);
  useEffect(() => {
    fetch(`${BASE_URL}/api/products/AllProducts`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        return response.json();
      })
      .then((data) => {
        setProducts(data.products || []);
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

        {/* Section Header */}
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
                onClick={() => setActiveFilter(filter)}
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

          /* Error State */
          <div className="empty-products">
            <div className="empty-products-icon">
              <span>!</span>
            </div>

            <div className="empty-products-content">
              <span className="empty-products-kicker">
                Something went wrong
              </span>

              <h3>
                Unable to load products
              </h3>

              <p>
                We couldn't load the collection right now.
                <br />
                Please try again later.
              </p>
            </div>
          </div>

        ) : items.length === 0 ? (

          /* Empty Product State */
          <div className="empty-products">
            <div className="empty-products-icon">
              <span>◌</span>
            </div>

            <div className="empty-products-content">
              <span className="empty-products-kicker">
                Collection coming soon
              </span>

              <h3>
                No products available
              </h3>

              <p>
                We're preparing something special for you.
                <br />
                Check back soon for new bottles.
              </p>
            </div>
          </div>

        ) : (

          /* Products */
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
      <ProductDetailsModal
  product={selectedProduct}
  onClose={() => setSelectedProduct(null)}
/>
    </section>
  );
}