import { useState } from 'react';
import Icon from './Icon';
import { useCart } from '../context/CartContext';

const STEPS = {
  SHIPPING: 'shipping',
  PAYMENT: 'payment',
  SUCCESS: 'success',
};

const PAYMENT_METHODS = [
  { id: 'card', label: 'Card' },
  { id: 'upi', label: 'UPI' },
  { id: 'cod', label: 'Cash on delivery' },
];

function PaymentFields({ method }) {
  if (method === 'card') {
    return (
      <>
        <div className="field">
          <label>Card number</label>
          <input type="text" placeholder="1234 5678 9012 3456" />
        </div>
        <div className="field-row">
          <div className="field">
            <label>Expiry</label>
            <input type="text" placeholder="MM/YY" />
          </div>
          <div className="field">
            <label>CVV</label>
            <input type="text" placeholder="•••" />
          </div>
        </div>
      </>
    );
  }
  if (method === 'upi') {
    return (
      <div className="field">
        <label>UPI ID</label>
        <input type="text" placeholder="yourname@upi" />
      </div>
    );
  }
  return (
    <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '14px' }}>
      Pay in cash when your order arrives. A small COD fee may apply.
    </p>
  );
}

export default function CheckoutModal({ isOpen, onClose }) {
  const { totals, clearCart } = useCart();
  const [step, setStep] = useState(STEPS.SHIPPING);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  function handleClose() {
    onClose();
    // Reset the flow for next time, after the close transition would settle.
    setTimeout(() => {
      setStep(STEPS.SHIPPING);
      setIsProcessing(false);
    }, 300);
  }

  function handlePay(e) {
    e.preventDefault();
    setIsProcessing(true);
    // Simulated processing delay — swap for a real payment gateway call
    // (Razorpay, Stripe, etc.) when this storefront goes live.
    setTimeout(() => {
      setIsProcessing(false);
      setStep(STEPS.SUCCESS);
    }, 1400);
  }

  function handleFinishDemo() {
    clearCart();
    handleClose();
  }

  return (
    <div className={`modal-overlay${isOpen ? ' show' : ''}`} onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="modal" role="dialog" aria-modal="true">
        {step === STEPS.SHIPPING && (
          <>
            <div className="modal-head">
              <h3>Shipping details</h3>
              <button className="close-x" onClick={handleClose} aria-label="Close">
                ✕
              </button>
            </div>
            <p className="step-label">Step 1 of 2 — Delivery info</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStep(STEPS.PAYMENT);
              }}
            >
              <div className="field">
                <label>Full name</label>
                <input type="text" placeholder="Priya Sharma" required />
              </div>
              <div className="field">
                <label>Address</label>
                <input type="text" placeholder="Flat, street, area" required />
              </div>
              <div className="field-row">
                <div className="field">
                  <label>City</label>
                  <input type="text" placeholder="Mumbai" required />
                </div>
                <div className="field">
                  <label>PIN code</label>
                  <input type="text" placeholder="400001" required />
                </div>
              </div>
              <div className="field">
                <label>Phone</label>
                <input type="tel" placeholder="10-digit number" required />
              </div>
              <button className="checkout-btn" type="submit">
                Continue to payment →
              </button>
            </form>
          </>
        )}

        {step === STEPS.PAYMENT && (
          <>
            <div className="modal-head">
              <h3>Payment</h3>
              <button className="close-x" onClick={handleClose} aria-label="Close">
                ✕
              </button>
            </div>
            <p className="step-label">Step 2 of 2 — Total ₹{totals.total}</p>

            <div className="pay-methods">
              {PAYMENT_METHODS.map((pm) => (
                <div
                  key={pm.id}
                  className={`pm${paymentMethod === pm.id ? ' active' : ''}`}
                  onClick={() => setPaymentMethod(pm.id)}
                >
                  {pm.label}
                </div>
              ))}
            </div>

            <form onSubmit={handlePay}>
              <PaymentFields method={paymentMethod} />
              <button className="checkout-btn" type="submit" disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <span className="spinner" /> Processing...
                  </>
                ) : (
                  `Pay ₹${totals.total}`
                )}
              </button>
            </form>

            <div className="trust">
              <span className="icon-wrap" style={{ width: '13px', height: '13px', display: 'inline-block' }}>
                <Icon name="shield" viewBox="0 0 24 24" />
              </span>
              Payments are encrypted end-to-end
            </div>
          </>
        )}

        {step === STEPS.SUCCESS && (
          <div className="success-view">
            <span className="pi">
              <Icon name="checkCircle" />
            </span>
            <h3>Demo checkout complete</h3>
            <p>
              This storefront&apos;s checkout flow is fully built — connecting it to a live
              payment gateway (like Razorpay or Stripe) is the last step to accept real payments.
            </p>
            <button className="checkout-btn" style={{ marginTop: '22px' }} onClick={handleFinishDemo}>
              Back to shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
