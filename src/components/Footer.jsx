import { Link } from "react-router-dom";
import Icon from "./Icon";

const SHOP_LINKS = [
  { label: "All products", to: "/shop" },
  { label: "Today's deals", to: "/deals" },
  { label: "Categories", to: "/categories" },
  { label: "Your cart", to: "/cart" },
];

const ACCOUNT_LINKS = [
  { label: "My orders", to: "/orders" },
  { label: "Shipping & delivery", to: "/shipping" },
  { label: "Returns & refunds", to: "/returns" },
  { label: "Help & FAQs", to: "/faq" },
];

const COMPANY_LINKS = [
  { label: "About us", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "Privacy policy", to: "/privacy" },
  { label: "Terms of service", to: "/terms" },
];

const SOCIALS = [
  { label: "Instagram", icon: "instagram", href: "#" },
  { label: "TikTok", icon: "tiktok", href: "#" },
  { label: "X", icon: "close", href: "#" },
];

function FooterLinkColumn({ title, links }) {
  return (
    <div className="foot-col">
      <h5>{title}</h5>
      <ul>
        {links.map((link) => (
          <li key={link.label}>
            {link.to ? <Link to={link.to}>{link.label}</Link> : <a href={link.href}>{link.label}</a>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="footer">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <Link to="/" className="logo">
              <span className="logo-mark">P</span>Pivora
            </Link>
            <p>
              Your everyday online store. Quality products across categories,
              fair prices and delivery you can count on.
            </p>
            <div className="pay-badges" aria-label="Payment options">
              <span>UPI</span><span>Cards</span><span>Net banking</span><span>COD</span>
            </div>
          </div>

          <FooterLinkColumn title="Shop" links={SHOP_LINKS} />
          <FooterLinkColumn title="Help" links={ACCOUNT_LINKS} />
          <FooterLinkColumn title="Company" links={COMPANY_LINKS} />
        </div>

        <div className="foot-bottom">
          <span>© {year} Pivora. All rights reserved.</span>
          <div className="socials">
            {SOCIALS.map((social) => (
              <a key={social.label} href={social.href} aria-label={social.label}>
                <Icon name={social.icon} viewBox="0 0 24 24" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
