import Icon from './Icon';
import { useCart } from '../context/CartContext';

const NAV_LINKS = [
  { label: 'Shop All', href: '#shop' },
  { label: 'The Ritual', href: '#spotlight' },
  { label: 'Why Pivora', href: '#perks' },
  { label: 'Contact', href: '#footer' },
];

const MARQUEE_ITEMS = [
  'Free shipping over ₹1499',
  'Order by 2pm, ships same day',
  '24hr cold · 12hr hot retention',
  'New — Holo Wave Tumbler',
];

function MarqueeBand() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="marquee clay">
      <div className="marquee-track">
        {items.map((text, i) => (
          <span key={i}>{text}</span>
        ))}
      </div>
    </div>
  );
}

export default function Navbar() {
  const { totals, openDrawer } = useCart();

  return (
    <header>
      <MarqueeBand />
      <nav className="nav wrap">
        <a href="#" className="logo">Pivora</a>

        <div className="nav-links">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </div>

        <div className="nav-actions">
          <button className="icon-btn" aria-label="Open cart" onClick={openDrawer}>
            <Icon name="cart" viewBox="0 0 24 24" />
            <span className="cart-count">{totals.itemCount}</span>
          </button>
        </div>
      </nav>
    </header>
  );
}
