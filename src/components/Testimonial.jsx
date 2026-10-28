// Membership / newsletter call-to-action (replaces the single-product testimonial).
import { useState } from "react";

export default function Testimonial() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO: connect to your email provider (Mailchimp, Klaviyo, etc.)
    setDone(true);
    setEmail("");
  }

  return (
    <section className="club">
      <div className="wrap club-inner">
        <div>
          <span className="kicker">Pivora Club</span>
          <h2>Get early access to deals and new arrivals</h2>
          <p>One email a week. No spam, unsubscribe any time.</p>
        </div>
        <form className="club-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            aria-label="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary">
            {done ? "You're in ✓" : "Subscribe"}
          </button>
        </form>
      </div>
    </section>
  );
}
