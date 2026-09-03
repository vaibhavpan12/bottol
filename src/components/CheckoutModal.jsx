import { useEffect, useState } from "react";
import Icon from "./Icon";
import { useCart } from "../context/CartContext";
import { BASE_URL } from "../config/api";

const STEPS = {
  PAYMENT: "payment",
  SUCCESS: "success",
};

const PAYMENT_METHODS = [
  { id: "card", label: "Card" },
  { id: "upi", label: "UPI" },
  { id: "cod", label: "Cash on delivery" },
];

function PaymentFields({ method }) {
  if (method === "card") {
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

  if (method === "upi") {
    return (
      <div className="field">
        <label>UPI ID</label>
        <input type="text" placeholder="yourname@upi" />
      </div>
    );
  }

  return (
    <p
      style={{
        fontSize: "13px",
        color: "var(--muted)",
        marginBottom: "14px",
      }}
    >
      Pay in cash when your order arrives. A small COD fee may apply.
    </p>
  );
}

export default function CheckoutModal({ isOpen, onClose }) {
const { cart, totals, clearCart } = useCart();

  const [step, setStep] = useState(STEPS.PAYMENT);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);

  const [shippingData, setShippingData] = useState({
    name: "",
    address: "",
    city: "",
    pin: "",
    phone: "",
  });

  // Load logged-in user's details
  useEffect(() => {
    if (!isOpen) return;

    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);

        setShippingData({
          name: user.name || "",
          address: user.address || "",
          city: user.city || "",
          pin: user.pin || "",
          phone: user.phone || "",
        });
      } catch (error) {
        console.error("Failed to load user details:", error);
      }
    }
  }, [isOpen]);

  function handleClose() {
    onClose();

    setTimeout(() => {
      setStep(STEPS.SHIPPING);
      setIsProcessing(false);
    }, 300);
  }

  function handleShippingChange(e) {
    const { name, value } = e.target;

    setShippingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleShippingSubmit(e) {
    e.preventDefault();

    setStep(STEPS.PAYMENT);
  }
async function handlePay(e) {
  e.preventDefault();

  const token = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");

  if (!token || !savedUser) {
    alert("Please login before placing an order.");
    return;
  }

  try {
    const user = JSON.parse(savedUser);

    setIsProcessing(true);

    const orderPayload = {
      user_id: user.id,

      items: cart.map((item) => ({
        product_id: item._id,
        name: item.name,
        image: item.image || null,
        price: item.price,
        quantity: item.qty,
      })),

      subtotal: totals.subtotal,
      shipping: totals.shipping,
      total: totals.total,

      payment_status: paymentMethod === "cod" ? "pending" : "paid",
      order_status: "placed",
    };

    const response = await fetch(
      `${BASE_URL}/api/orders/createUserOrder`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderPayload),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail || "Failed to create order"
      );
    }

    console.log("Order created:", data);

    setStep(STEPS.SUCCESS);
  } catch (error) {
    console.error("Order creation failed:", error);
    alert(error.message);
  } finally {
    setIsProcessing(false);
  }
}

  function handleFinishDemo() {
    clearCart();
    handleClose();
  }

  return (
    <div
      className={`modal-overlay${isOpen ? " show" : ""}`}
      onClick={(e) =>
        e.target === e.currentTarget && handleClose()
      }
    >
      <div className="modal" role="dialog" aria-modal="true">

        {/* SHIPPING */}
        {step === STEPS.SHIPPING && (
          <>
            <div className="modal-head">
              <h3>Shipping details</h3>

              <button
                className="close-x"
                onClick={handleClose}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <p className="step-label">
              Step 1 of 2 — Delivery info
            </p>

            <form onSubmit={handleShippingSubmit}>

              <div className="field">
                <label>Full name</label>

                <input
                  type="text"
                  name="name"
                  placeholder="Priya Sharma"
                  value={shippingData.name}
                  onChange={handleShippingChange}
                  required
                />
              </div>

              <div className="field">
                <label>Address</label>

                <input
                  type="text"
                  name="address"
                  placeholder="Flat, street, area"
                  value={shippingData.address}
                  onChange={handleShippingChange}
                  required
                />
              </div>

              <div className="field-row">

                <div className="field">
                  <label>City</label>

                  <input
                    type="text"
                    name="city"
                    placeholder="Mumbai"
                    value={shippingData.city}
                    onChange={handleShippingChange}
                    required
                  />
                </div>

                <div className="field">
                  <label>PIN code</label>

                  <input
                    type="text"
                    name="pin"
                    placeholder="400001"
                    value={shippingData.pin}
                    onChange={handleShippingChange}
                    required
                  />
                </div>

              </div>

              <div className="field">
                <label>Phone</label>

                <input
                  type="tel"
                  name="phone"
                  placeholder="10-digit number"
                  value={shippingData.phone}
                  onChange={handleShippingChange}
                  required
                />
              </div>

              <button
                className="checkout-btn"
                type="submit"
              >
                Continue to payment →
              </button>

            </form>
          </>
        )}

        {/* PAYMENT */}
        {step === STEPS.PAYMENT && (
          <>
            <div className="modal-head">
              <h3>Payment</h3>

              <button
                className="close-x"
                onClick={handleClose}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <p className="step-label">
              Step 2 of 2 — Total ₹{totals.total}
            </p>

            <div className="pay-methods">
              {PAYMENT_METHODS.map((pm) => (
                <div
                  key={pm.id}
                  className={`pm${
                    paymentMethod === pm.id ? " active" : ""
                  }`}
                  onClick={() => setPaymentMethod(pm.id)}
                >
                  {pm.label}
                </div>
              ))}
            </div>

            <form onSubmit={handlePay}>

              <PaymentFields method={paymentMethod} />

              <button
                className="checkout-btn"
                type="submit"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <span className="spinner" />
                    Processing...
                  </>
                ) : (
                  `Pay ₹${totals.total}`
                )}
              </button>

            </form>

            <div className="trust">
              <span
                className="icon-wrap"
                style={{
                  width: "13px",
                  height: "13px",
                  display: "inline-block",
                }}
              >
                <Icon name="shield" viewBox="0 0 24 24" />
              </span>

              Payments are encrypted end-to-end
            </div>
          </>
        )}

        {/* SUCCESS */}
        {step === STEPS.SUCCESS && (
          <div className="success-view">

            <span className="pi">
              <Icon name="checkCircle" />
            </span>

            <h3>Demo checkout complete</h3>

            <p>
              This storefront&apos;s checkout flow is fully built —
              connecting it to a live payment gateway (like Razorpay
              or Stripe) is the last step to accept real payments.
            </p>

            <button
              className="checkout-btn"
              style={{ marginTop: "22px" }}
              onClick={handleFinishDemo}
            >
              Back to shopping
            </button>

          </div>
        )}

      </div>
    </div>
  );
}