import { Link, useLocation } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
import usePageTitle from "../hooks/usePageTitle";
import NotFound from "./NotFound";

// Edit the wording below to match your real business details and policies.
const PAGES = {
  "/about": {
    title: "About us",
    body: [
      ["Who we are", "Pivora is an online store bringing together quality products across categories — from electronics and home essentials to fashion and accessories — at fair prices."],
      ["What we promise", "Honest product information, secure checkout, quick dispatch and support from real people whenever you need it."],
    ],
  },
  "/contact": {
    title: "Contact us",
    body: [
      ["Customer support", "Email: support@yourstore.com (replace with your address)\nPhone: +91 00000 00000\nHours: Monday to Saturday, 10am – 7pm IST"],
      ["Order help", "Please include your order ID when you write to us so we can help faster. You can find it under My Orders."],
    ],
  },
  "/faq": {
    title: "Help & FAQs",
    body: [
      ["How do I track my order?", "Sign in and open My Orders to see the status of every order."],
      ["Which payment methods do you accept?", "UPI, cards, net banking and cash on delivery."],
      ["Can I cancel my order?", "Contact support before your order is shipped and we'll cancel it for you."],
      ["Do you deliver across India?", "Yes, we deliver to most PIN codes in India."],
    ],
  },
  "/shipping": {
    title: "Shipping & delivery",
    body: [
      ["Delivery charges", "Delivery is free on orders over ₹1499. A flat ₹79 fee applies to smaller orders."],
      ["Delivery time", "Most orders ship within 48 hours and arrive in 3–7 working days, depending on your location."],
    ],
  },
  "/returns": {
    title: "Returns & refunds",
    body: [
      ["Return window", "Eligible items can be returned within 7 days of delivery in their original condition and packaging."],
      ["Refunds", "Once we receive and check the item, refunds are processed to the original payment method within 5–7 working days. COD orders are refunded by bank transfer."],
    ],
  },
  "/privacy": {
    title: "Privacy policy",
    body: [
      ["What we collect", "Your name, contact details, delivery address and order history, used only to process and deliver your orders and support you."],
      ["How we protect it", "We never sell your personal data. Payment details are handled by our payment provider and never stored on our servers."],
    ],
  },
  "/terms": {
    title: "Terms of service",
    body: [
      ["Using this site", "By placing an order you agree to provide accurate information and to use the site lawfully."],
      ["Pricing", "Prices and availability may change without notice. If a pricing error occurs we will contact you before processing your order."],
    ],
  },
};

export default function InfoPage() {
  const { pathname } = useLocation();
  const page = PAGES[pathname];
  usePageTitle(page?.title);
  if (!page) return <NotFound />;

  return (
    <div className="page">
      <div className="wrap info-page">
        <Breadcrumbs items={[{ label: page.title }]} />
        <h1>{page.title}</h1>
        {page.body.map(([heading, text]) => (
          <section key={heading}>
            <h2>{heading}</h2>
            {text.split("\n").map((line, i) => <p key={i}>{line}</p>)}
          </section>
        ))}
        <p className="info-more">
          Still need help? <Link to="/contact">Contact us</Link>
        </p>
      </div>
    </div>
  );
}
