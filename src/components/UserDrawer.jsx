import { useEffect, useState } from "react";
import { BASE_URL } from "../config/api";
import { useCart } from "../context/CartContext";
export default function UserDrawer({ isOpen, onClose, user, onSuccess }) {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const { resetCartOnLogout } = useCart();
  useEffect(() => {
    if (!isOpen || !user?.id) return;

    const token = localStorage.getItem("token");

    if (!token) return;

    async function loadOrders() {
      try {
        setLoadingOrders(true);

        const response = await fetch(
          `${BASE_URL}/api/orders/AllOrder/user/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (response.ok) {
          setOrders(data.orders || []);
        }
      } catch (error) {
        console.error("Failed to load orders:", error);
      } finally {
        setLoadingOrders(false);
      }
    }

    loadOrders();
  }, [isOpen, user]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!user) return null;

  function handleLogout() {
    resetCartOnLogout();

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.dispatchEvent(new Event("auth-changed"));

    onSuccess?.("You have been logged out successfully.");

    onClose();
  }

  return (
    <>
      <div
        className={`user-overlay ${isOpen ? "show" : ""}`}
        onClick={onClose}
      />

      <aside className={`user-drawer ${isOpen ? "show" : ""}`}>
        <div className="user-drawer-head">
          <div>
            <h3>Your Account</h3>
            <span>Manage your Pivora account</span>
          </div>

          <button
            className="user-close"
            onClick={onClose}
            aria-label="Close account"
          >
            ×
          </button>
        </div>

        <div className="user-drawer-body">
          {/* Profile */}
          <div className="user-profile">
            <div className="user-avatar">
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="user-profile-info">
              <h4>{user.name}</h4>
              <p>{user.email}</p>

              {user.phone && <p>{user.phone}</p>}
            </div>
          </div>

          {/* Divider */}
          <div className="user-divider" />

          {/* Orders */}
          <div className="user-orders">
            <div className="user-section-head">
              <h4>Order History</h4>

              {orders.length > 0 && <span>{orders.length} orders</span>}
            </div>

            {loadingOrders ? (
              <div className="user-orders-empty">
                <div className="user-loader" />
                <p>Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="user-orders-empty">
                <div className="empty-order-icon">⌁</div>

                <h5>No orders yet</h5>

                <p>Your Pivora orders will appear here.</p>
              </div>
            ) : (
              <div className="user-order-list">
                {orders.map((order) => {
                  const isExpanded = expandedOrder === order.order_id;

                  const formattedDate = order.created_at
                    ? new Date(order.created_at).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "";

                  return (
                    <div
                      className={`user-order-card ${
                        isExpanded ? "expanded" : ""
                      }`}
                      key={order.order_id}
                    >
                      {/* ORDER HEADER */}
                      <button
                        className="user-order-header"
                        onClick={() =>
                          setExpandedOrder(isExpanded ? null : order.order_id)
                        }
                      >
                        <div className="order-main-info">
                          <div className="order-icon">
                            <span>⌁</span>
                          </div>

                          <div>
                            <strong>{order.order_id}</strong>

                            <span className="order-date">{formattedDate}</span>
                          </div>
                        </div>

                        <div className="order-header-right">
                          <span
                            className={`order-status ${order.order_status?.toLowerCase()}`}
                          >
                            {order.order_status}
                          </span>

                          <span
                            className={`order-chevron ${
                              isExpanded ? "rotate" : ""
                            }`}
                          >
                            ↓
                          </span>
                        </div>
                      </button>

                      {/* ORDER ITEMS */}
                      {isExpanded && (
                        <div className="order-details">
                          <div className="order-items">
                            {order.items?.map((item, index) => (
                              <div
                                className="order-item"
                                key={`${order.order_id}-${item.product_id}-${index}`}
                              >
                                <div className="order-item-image">
                                  {item.image ? (
                                    <img
                                      src={
                                        item.image.startsWith("/uploads/")
                                          ? `${BASE_URL}${item.image}`
                                          : item.image
                                      }
                                      alt={item.name}
                                    />
                                  ) : (
                                    <div className="order-item-placeholder">
                                      P
                                    </div>
                                  )}
                                </div>

                                <div className="order-item-info">
                                  <h5>{item.name}</h5>

                                  <div className="order-item-meta">
                                    <span>Qty × {item.quantity}</span>

                                    <span>₹{item.price}</span>
                                  </div>
                                </div>

                                <div className="order-item-total">
                                  ₹{item.price * item.quantity}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* PRICE SUMMARY */}
                          <div className="order-summary">
                            <div className="summary-row">
                              <span>Subtotal</span>
                              <strong>₹{order.subtotal}</strong>
                            </div>

                            <div className="summary-row">
                              <span>Shipping</span>
                              <strong>
                                {order.shipping === 0
                                  ? "FREE"
                                  : `₹${order.shipping}`}
                              </strong>
                            </div>

                            <div className="summary-divider" />

                            <div className="summary-row total-row">
                              <span>Total</span>
                              <strong>₹{order.total}</strong>
                            </div>
                          </div>

                          {/* PAYMENT INFO */}
                          <div className="order-payment-info">
                            <div>
                              <span>Payment</span>
                              <strong>{order.payment_status}</strong>
                            </div>

                            <div>
                              <span>Items</span>
                              <strong>
                                {order.items?.reduce(
                                  (sum, item) => sum + item.quantity,
                                  0,
                                )}
                              </strong>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="user-drawer-foot">
          <button className="user-logout" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}
