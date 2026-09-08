import { useEffect, useMemo, useState } from "react";
import { BASE_URL } from "../../config/api";
import "../../css/Admin.css";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================
  // FETCH CUSTOMERS
  // =====================================

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("adminToken");

      const response = await fetch(`${BASE_URL}/api/admin/customers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to fetch customers");
      }

      setCustomers(data.customers || []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // =====================================
  // CUSTOMER DETAILS
  // =====================================

  const openCustomerDetails = async (customer) => {
    try {
      setDetailsLoading(true);
      setSelectedCustomer(null);

      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `${BASE_URL}/api/admin/customers/${customer.user_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to fetch customer details");
      }

      setSelectedCustomer(data);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setDetailsLoading(false);
    }
  };

  // =====================================
  // SEARCH
  // =====================================

  const filteredCustomers = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return customers;
    }

    return customers.filter((customer) =>
      [
        customer.name,
        customer.email,
        customer.phone,
        customer.city,
        customer.pin,
      ]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(value)),
    );
  }, [customers, search]);

  // =====================================
  // STATS
  // =====================================

  const totalCustomers = customers.length;

  const totalOrders = customers.reduce(
    (sum, customer) => sum + Number(customer.total_orders || 0),
    0,
  );

  const totalSpent = customers.reduce(
    (sum, customer) => sum + Number(customer.total_spent || 0),
    0,
  );

  // =====================================
  // DATE FORMAT
  // =====================================

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <div className="admin-customers-page">
        <div className="admin-loading">Loading customers...</div>
      </div>
    );
  }

  return (
    <div className="admin-customers-page">
      {/* =================================
          HEADER
      ================================= */}

      <div className="admin-page-header">
        <div>
          <h1>Products</h1>
          <p>Manage your product inventory.</p>
        </div>

        <button
          type="button"
          className="admin-add-product-btn"
          onClick={() => {
            // Yahan tumhara Add Product modal open hoga
            setShowAddModal(true);
          }}
        >
          <span>+</span>
          Add Product
        </button>
      </div>

      {/* =================================
          ERROR
      ================================= */}

      {error && <div className="admin-customer-error">{error}</div>}

      {/* =================================
          STATS
      ================================= */}

      <div className="admin-customer-stats">
        <div className="admin-customer-stat-card">
          <span>Total Customers</span>
          <strong>{totalCustomers}</strong>
        </div>

        <div className="admin-customer-stat-card">
          <span>Total Orders</span>
          <strong>{totalOrders}</strong>
        </div>

        <div className="admin-customer-stat-card">
          <span>Total Spent</span>
          <strong>₹{totalSpent.toLocaleString("en-IN")}</strong>
        </div>
      </div>

      {/* =================================
          SEARCH
      ================================= */}

      <div className="admin-customer-toolbar">
        <div className="admin-customer-search">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Search by name, email, phone, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* =================================
          CUSTOMER LIST
      ================================= */}

      {filteredCustomers.length === 0 ? (
        <div className="admin-customer-empty">
          <h3>No customers found</h3>

          <p>
            {search
              ? "Try another search."
              : "No customers have registered yet."}
          </p>
        </div>
      ) : (
        <div className="admin-customers-table-wrapper">
          <table className="admin-customers-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact</th>
                <th>Location</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Joined</th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.map((customer) => {
                const initials =
                  customer.name
                    ?.split(" ")
                    .map((word) => word[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase() || "?";

                return (
                  <tr
                    key={customer.user_id}
                    onClick={() => openCustomerDetails(customer)}
                    className="admin-customer-row"
                  >
                    {/* CUSTOMER */}

                    <td>
                      <div className="admin-customer-info">
                        <div className="admin-customer-avatar">{initials}</div>

                        <div>
                          <strong>{customer.name || "Unknown"}</strong>

                          <small>{customer.email || "—"}</small>
                        </div>
                      </div>
                    </td>

                    {/* CONTACT */}

                    <td>
                      <div className="admin-customer-contact">
                        <strong>{customer.phone || "—"}</strong>

                        <small>{customer.email || "—"}</small>
                      </div>
                    </td>

                    {/* LOCATION */}

                    <td>
                      <div className="admin-customer-location">
                        <strong>{customer.city || "—"}</strong>

                        <small>PIN: {customer.pin || "—"}</small>
                      </div>
                    </td>

                    {/* ORDERS */}

                    <td>
                      <span className="admin-customer-orders-count">
                        {customer.total_orders || 0}
                      </span>
                    </td>

                    {/* SPENT */}

                    <td>
                      <strong>
                        ₹
                        {Number(customer.total_spent || 0).toLocaleString(
                          "en-IN",
                        )}
                      </strong>
                    </td>

                    {/* JOINED */}

                    <td>
                      <span className="admin-customer-date">
                        {formatDate(customer.created_at)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* =================================
          LOADING CUSTOMER DETAILS
      ================================= */}

      {detailsLoading && (
        <div
          className="admin-customer-modal-overlay"
          onClick={() => setSelectedCustomer(null)}
        >
          <div
            className="admin-customer-modal-loading"
            onClick={(e) => e.stopPropagation()}
          >
            Loading customer details...
          </div>
        </div>
      )}

      {/* =================================
          CUSTOMER DETAILS MODAL
      ================================= */}

      {selectedCustomer && (
        <CustomerDetailsModal
          data={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          formatDate={formatDate}
        />
      )}
    </div>
  );
}

/* =====================================================
   CUSTOMER DETAILS MODAL
===================================================== */

function CustomerDetailsModal({ data, onClose, formatDate }) {
  const { customer, orders } = data;

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const initials =
    customer.name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  return (
    <div className="admin-customer-modal-overlay" onClick={onClose}>
      <div
        className="admin-customer-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}

        <div className="admin-customer-modal-header">
          <div>
            <h2>Customer Details</h2>

            <p>Complete customer information</p>
          </div>

          <button className="admin-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        {/* CUSTOMER PROFILE */}

        <div className="admin-customer-profile">
          <div className="admin-customer-profile-avatar">{initials}</div>

          <div className="admin-customer-profile-info">
            <h3>{customer.name || "Unknown"}</h3>

            <p>{customer.email || "—"}</p>

            <p>{customer.phone || "—"}</p>
          </div>
        </div>

        {/* CUSTOMER INFORMATION */}

        <div className="admin-customer-detail-grid">
          <div>
            <span>Address</span>
            <strong>{customer.address || "—"}</strong>
          </div>

          <div>
            <span>City / Area</span>
            <strong>{customer.city || "—"}</strong>
          </div>

          <div>
            <span>PIN Code</span>
            <strong>{customer.pin || "—"}</strong>
          </div>

          <div>
            <span>Joined</span>
            <strong>{formatDate(customer.created_at)}</strong>
          </div>
        </div>

        {/* STATS */}

        <div className="admin-customer-modal-stats">
          <div>
            <span>Total Orders</span>
            <strong>{customer.total_orders || 0}</strong>
          </div>

          <div>
            <span>Total Spent</span>
            <strong>
              ₹{Number(customer.total_spent || 0).toLocaleString("en-IN")}
            </strong>
          </div>
        </div>

        {/* ORDERS */}

        <div className="admin-customer-orders">
          <div className="admin-customer-orders-header">
            <h3>Order History</h3>

            <span>{orders.length} orders</span>
          </div>

          {orders.length === 0 ? (
            <div className="admin-customer-no-orders">
              No orders placed yet.
            </div>
          ) : (
            <div className="admin-customer-order-list">
              {orders.map((order) => (
                <div className="admin-customer-order-card" key={order.order_id}>
                  <div className="admin-customer-order-top">
                    <div>
                      <strong>{order.order_id}</strong>

                      <small>{formatDate(order.created_at)}</small>
                    </div>

                    <strong>
                      ₹{Number(order.total || 0).toLocaleString("en-IN")}
                    </strong>
                  </div>

                  <div className="admin-customer-order-meta">
                    <span>{order.items?.length || 0} products</span>

                    <span
                      className={`admin-order-status status-${order.order_status}`}
                    >
                      {order.order_status || "—"}
                    </span>

                    <span>Payment: {order.payment_status || "—"}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
