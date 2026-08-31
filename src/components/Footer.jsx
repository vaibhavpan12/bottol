import { useState } from 'react';
import Icon from './Icon';

const SHOP_LINKS = [
  { label: 'Tumblers', href: '#shop' },
  { label: 'Trending', href: '#shop' },
  { label: 'New drops', href: '#shop' },
];

const SUPPORT_LINKS = [
  { label: 'Track order', href: '#' },
  { label: 'Returns', href: '#' },
  { label: 'FAQs', href: '#' },
];

const SOCIALS = [
  { label: 'Instagram', icon: 'instagram', href: '#' },
  { label: 'TikTok', icon: 'tiktok', href: '#' },
  { label: 'X', icon: 'close', href: '#' },
];

function FooterLinkColumn({ title, links }) {
  return (
    <div className="foot-col">
      <h5>{title}</h5>
      <ul>
        {links.map((link) => (
          <li key={link.label}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) return;
    // Wire this up to a real ESP (Klaviyo, Mailchimp, etc.) when available.
    setSubmitted(true);
    setEmail('');
  }

  return (
    <div className="foot-col">
      <h5>Join the ritual</h5>
      <form className="news-input" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Your email"
          aria-label="Email for newsletter"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">{submitted ? 'Joined' : 'Join'}</button>
      </form>
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
            <a href="#" className="logo">
              <span className="mark">P</span>Pivora
            </a>
            <p>
              A new standard for the daily carry. Engineered tumblers and considered
              gear, built quietly and made to last.
            </p>
          </div>

          <FooterLinkColumn title="Shop" links={SHOP_LINKS} />
          <FooterLinkColumn title="Support" links={SUPPORT_LINKS} />
          <NewsletterForm />
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
