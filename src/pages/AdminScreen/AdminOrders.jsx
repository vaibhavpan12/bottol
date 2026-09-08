import { useEffect, useMemo, useState } from "react";
import { BASE_URL } from "../../config/api";
import "../../css/Admin.css";

const STATUS_FILTERS = [
  { key: "all", label: "All" },
  { key: "placed", label: "Placed" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

const getInitials = (name) => {
  if (!name) return "?";

  const parts = name.trim().split(/\s+/);

  const initials =
    parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : parts[0].slice(0, 2);

  return initials.toUpperCase();
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // =====================================
  // FETCH ORDERS
  // =====================================

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("adminToken");

      if (!token) {
        throw new Error(
          "Admin session expired. Please login again."
        );
      }

      const response = await fetch(
        `${BASE_URL}/api/admin/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to fetch orders"
        );
      }

      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // =====================================
  // FORMAT DATE
  // =====================================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =====================================
  // STATUS COUNTS
  // =====================================

  const statusCounts = useMemo(() => {
    const counts = {
      all: orders.length,
      placed: 0,
      processing: 0,
      shipped: 0,
      completed: 0,
      cancelled: 0,
    };

    orders.forEach((order) => {
      const status = order.order_status || "placed";

      if (counts[status] !== undefined) {
        counts[status]++;
      }
    });

    return counts;
  }, [orders]);

  // =====================================
  // FILTER ORDERS
  // =====================================

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const status = order.order_status || "placed";

      const matchesStatus =
        statusFilter === "all" ||
        status === statusFilter;

      if (!matchesStatus) {
        return false;
      }

      if (!query.trim()) {
        return true;
      }

      const q = query.trim().toLowerCase();

      const customer = order.customer || {};

      const haystack = `
        ${order.order_id || ""}
        ${customer.name || ""}
        ${customer.email || ""}
        ${customer.phone || ""}
        ${customer.address || ""}
        ${customer.city || ""}
        ${customer.pin || ""}
      `.toLowerCase();

      return haystack.includes(q);
    });
  }, [orders, query, statusFilter]);

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <div className="admin-page">

        <div className="admin-page-header">
          <div>
            <h1>Orders</h1>
            <p>Manage all customer orders</p>
          </div>
        </div>

        <div className="admin-orders-skeleton">
          {[0, 1, 2].map((i) => (
            <div
              className="admin-skeleton-card"
              key={i}
            />
          ))}
        </div>

      </div>
    );
  }

  // =====================================
  // ERROR
  // =====================================

  if (error) {
    return (
      <div className="admin-page">

        <div className="admin-page-header">
          <div>
            <h1>Orders</h1>
            <p>Manage all customer orders</p>
          </div>
        </div>

        <div className="admin-error">
          <p>{error}</p>

          <button onClick={fetchOrders}>
            Retry
          </button>
        </div>

      </div>
    );
  }

  // =====================================
  // UI
  // =====================================

  return (
    <div className="admin-page">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="admin-page-header">

        <div>
          <h1>Orders</h1>

          <p>
            Manage all customer orders
          </p>
        </div>

        <div className="admin-order-count">
          <span className="admin-order-count-dot" />
          {orders.length} orders
        </div>

      </div>

      {/* =====================================
          SEARCH + FILTER
      ===================================== */}

      <div className="admin-orders-toolbar">

        <div className="admin-order-search">

          <svg
            viewBox="0 0 20 20"
            fill="none"
          >
            <circle
              cx="9"
              cy="9"
              r="6.5"
              stroke="currentColor"
              strokeWidth="1.6"
            />

            <path
              d="M18 18L14 14"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>

          <input
            type="text"
            placeholder="Search order, customer, email, phone, city or PIN"
            value={query}
            onChange={(e) =>
              setQuery(e.target.value)
            }
            style={{outline:"none"}}    
          />

          {query && (
            <button
              className="admin-order-search-clear"
              onClick={() => setQuery("")}
              aria-label="Clear search"
            >
              ×
            </button>
          )}

        </div>

        <div className="admin-status-tabs">

          {STATUS_FILTERS.map((filter) => (

            <button
              key={filter.key}
              className={`admin-status-tab ${
                statusFilter === filter.key
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setStatusFilter(filter.key)
              }
            >

              {filter.label}

              {statusCounts[filter.key] > 0 && (
                <span className="admin-status-tab-count">
                  {statusCounts[filter.key]}
                </span>
              )}

            </button>

          ))}

        </div>

      </div>

      {/* =====================================
          ORDERS
      ===================================== */}

      <div className="admin-orders-list">

        {filteredOrders.length === 0 ? (

          <div className="admin-empty">

            <div className="admin-empty-icon">

              <svg
                viewBox="0 0 48 48"
                fill="none"
              >

                <rect
                  x="8"
                  y="16"
                  width="32"
                  height="24"
                  rx="3"
                  stroke="currentColor"
                  strokeWidth="2"
                />

                <path
                  d="M8 22h32"
                  stroke="currentColor"
                  strokeWidth="2"
                />

                <path
                  d="M17 16v-3a7 7 0 0114 0v3"
                  stroke="currentColor"
                  strokeWidth="2"
                />

              </svg>

            </div>

            <h3>
              {orders.length === 0
                ? "No orders found"
                : "No matching orders"}
            </h3>

            <p>
              {orders.length === 0
                ? "Customer orders will appear here."
                : "Try a different search term or status filter."}
            </p>

          </div>

        ) : (

          filteredOrders.map((order) => {

            const customer =
              order.customer || {};

            return (
              <div
                className={`admin-order-card status-${
                  order.order_status || "placed"
                }`}
                key={order.order_id}
              >

                {/* =====================================
                    ORDER HEADER
                ===================================== */}

                <div className="admin-order-header">

                  {/* ORDER */}

                  <div className="admin-order-id-block">

                    <span className="admin-order-label">
                      Order
                    </span>

                    <h3>
                      {order.order_id}
                    </h3>

                    <p>
                      {formatDate(
                        order.created_at
                      )}
                    </p>

                  </div>

                  {/* CUSTOMER */}

                  <div className="admin-order-customer">

                    <span className="admin-avatar-chip">
                      {getInitials(
                        customer.name
                      )}
                    </span>

                    <div>

                      <span className="admin-order-label">
                        Customer
                      </span>

                      <strong>
                        {customer.name ||
                          "Unknown Customer"}
                      </strong>

                      <small>
                        {customer.email || "-"}
                      </small>

                      <small>
                        {customer.phone || "-"}
                      </small>

                    </div>

                  </div>

                  {/* PAYMENT */}

                  <div>

                    <span className="admin-order-label">
                      Payment
                    </span>

                    <span
                      className={`admin-status ${
                        order.payment_status ||
                        "pending"
                      }`}
                    >

                      <i className="admin-status-dot" />

                      {order.payment_status ||
                        "pending"}

                    </span>

                  </div>

                  {/* STATUS */}

                  <div>

                    <span className="admin-order-label">
                      Status
                    </span>

                    <span
                      className={`admin-status ${
                        order.order_status ||
                        "placed"
                      }`}
                    >

                      <i className="admin-status-dot" />

                      {order.order_status ||
                        "placed"}

                    </span>

                  </div>

                </div>

                {/* =====================================
                    CUSTOMER SHIPPING DETAILS
                ===================================== */}

                <div className="admin-order-shipping">

                  <div className="admin-order-shipping-title">
                    Shipping Details
                  </div>

                  <div className="admin-order-shipping-grid">

                    <div>
                      <span className="admin-order-label">
                        Address
                      </span>

                      <strong>
                        {customer.address || "-"}
                      </strong>
                    </div>

                    <div>
                      <span className="admin-order-label">
                        City / Area
                      </span>

                      <strong>
                        {customer.city || "-"}
                      </strong>
                    </div>

                    <div>
                      <span className="admin-order-label">
                        PIN Code
                      </span>

                      <strong>
                        {customer.pin || "-"}
                      </strong>
                    </div>

                  </div>

                </div>

                {/* =====================================
                    PRODUCTS
                ===================================== */}

                <div className="admin-order-products">

                  {order.items?.map(
                    (item, index) => (

                      <div
                        className="admin-order-product"
                        key={`${order.order_id}-${index}`}
                      >

                        <div className="admin-product-info">

                          <strong>
                            {item.name}
                          </strong>

                          <span>
                            Qty {item.quantity}
                          </span>

                        </div>

                        <div className="admin-product-price">

                          ₹
                          {Number(
                            item.price || 0
                          ).toLocaleString(
                            "en-IN"
                          )}

                        </div>

                        <div className="admin-product-total">

                          ₹
                          {(
                            Number(
                              item.price || 0
                            ) *
                            Number(
                              item.quantity || 0
                            )
                          ).toLocaleString(
                            "en-IN"
                          )}

                        </div>

                      </div>

                    )
                  )}

                </div>

                {/* =====================================
                    ORDER FOOTER
                ===================================== */}

                <div className="admin-order-footer">

                  <div>

                    <span>
                      Subtotal
                    </span>

                    <strong>
                      ₹
                      {Number(
                        order.subtotal || 0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                  </div>

                  <div>

                    <span>
                      Shipping
                    </span>

                    <strong>
                      ₹
                      {Number(
                        order.shipping || 0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                  </div>

                  <div className="admin-order-grand-total">

                    <span>
                      Total received
                    </span>

                    <strong>
                      ₹
                      {Number(
                        order.total || 0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                  </div>

                </div>

              </div>
            );
          })
        )}

      </div>

    </div>
  );
};

export default AdminOrders;