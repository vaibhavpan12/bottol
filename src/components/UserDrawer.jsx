import { useEffect, useState } from "react";
import { BASE_URL } from "../config/api";

export default function UserDrawer({ isOpen, onClose, user }) {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (!isOpen || !user?.id) return;

    const token = localStorage.getItem("token");

    if (!token) return;

    async function loadOrders() {
      try {
        setLoadingOrders(true);

        const response = await fetch(
          `${BASE_URL}/api/orders/user/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
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
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.dispatchEvent(new Event("auth-changed"));

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

              {user.phone && (
                <p>{user.phone}</p>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="user-divider" />

          {/* Orders */}
          <div className="user-orders">
            <div className="user-section-head">
              <h4>Order History</h4>

              {orders.length > 0 && (
                <span>{orders.length} orders</span>
              )}
            </div>

            {loadingOrders ? (
              <div className="user-orders-empty">
                <div className="user-loader" />
                <p>Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="user-orders-empty">
                <div className="empty-order-icon">
                  ⌁
                </div>

                <h5>No orders yet</h5>

                <p>
                  Your Pivora orders will appear here.
                </p>
              </div>
            ) : (
              <div className="user-order-list">
                {orders.map((order) => (
                  <div
                    className="user-order-card"
                    key={order.order_id}
                  >
                    <div className="user-order-top">
                      <strong>{order.order_id}</strong>

                      <span>
                        {order.order_status}
                      </span>
                    </div>

                    <div className="user-order-bottom">
                      <span>
                        {order.items?.length || 0} items
                      </span>

                      <strong>
                        ₹{order.total}
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="user-drawer-foot">
          <button
            className="user-logout"
            onClick={handleLogout}
          >
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}