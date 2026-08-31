import { useMemo, useState } from 'react';
import { FILTERS, PRODUCTS } from '../data/products';
import ProductCard from './ProductCard';

const FILTER_LABELS = {
  all: 'All',
  Tumblers: 'Tumblers',
  Trending: 'Trending',
  New: 'New drops',
};

export default function ProductGrid() {
  const [activeFilter, setActiveFilter] = useState('all');

  const items = useMemo(
    () => (activeFilter === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.cat === activeFilter)),
    [activeFilter]
  );

  return (
    <section className="section" id="shop">
      <div className="wrap">
        <div className="section-head split">
          <div>
            <span className="kicker">Full catalog</span>
            <h2>Shop the collection</h2>
          </div>

          <div className="tabs">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                className={`tab${activeFilter === filter ? ' active' : ''}`}
                onClick={() => setActiveFilter(filter)}
              >
                {FILTER_LABELS[filter]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
