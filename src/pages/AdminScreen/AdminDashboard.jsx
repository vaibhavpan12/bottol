import { useEffect, useState } from "react";
import { Package, Users, AlertTriangle, TrendingUp } from "lucide-react";
import "../../css/Admin.css";

// Swap the mock call below for your real one:
// import { getAdminDashboard } from "../../services/adminApi";

const MOCK_DASHBOARD = {
  this_month_sales: 84320,
  total_products: 248,
  total_stock: 1204,
  total_customers: 532,
  pending_orders: 12,
  completed_orders: 340,
  cancelled_orders: 8,
  low_stock_count: 4,
  low_stock_products: [
    { _id: "1", name: "Ceramic Pour-Over Kettle", quantity: 3 },
    { _id: "2", name: "Walnut Cutting Board", quantity: 1 },
    { _id: "3", name: "Linen Napkin Set", quantity: 5 },
    { _id: "4", name: 'Cast Iron Skillet 10"', quantity: 2 },
  ],
  recent_orders: [
    { _id: "a", order_id: "ORD-1042", total: 2450, order_status: "pending" },
    { _id: "b", order_id: "ORD-1041", total: 899, order_status: "completed" },
    { _id: "c", order_id: "ORD-1040", total: 3200, order_status: "completed" },
    { _id: "d", order_id: "ORD-1039", total: 540, order_status: "cancelled" },
    { _id: "e", order_id: "ORD-1038", total: 1750, order_status: "pending" },
  ],
};

const fmt = (n) => new Intl.NumberFormat("en-IN").format(n ?? 0);

const STATUS_STYLES = {
  pending: { color: "var(--gold)", label: "Pending" },
  completed: { color: "var(--green)", label: "Completed" },
  cancelled: { color: "var(--clay)", label: "Cancelled" },
};

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      // Real usage:
      // const data = await getAdminDashboard();
      const data = await new Promise((resolve) =>
        setTimeout(
          () => resolve({ success: true, dashboard: MOCK_DASHBOARD }),
          500
        )
      );

      if (data.success) {
        setDashboard(data.dashboard);
      }
    } catch (err) {
      console.error(err);
      setError("Unable to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="admin-center">
        <div>
          <div className="admin-spinner" />
          <p className="admin-loading-text">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-center">
        <div className="admin-error">{error}</div>
      </div>
    );
  }

  const pipelineTotal =
    (dashboard.pending_orders || 0) +
      (dashboard.completed_orders || 0) +
      (dashboard.cancelled_orders || 0) || 1;

  return (
    <div className="admin-root">
      <div className="admin-container">
        {/* Header */}
        <div className="admin-header">
          <div>
            <p className="admin-eyebrow">Store admin</p>
            <h1 className="admin-title">Dashboard</h1>
          </div>
          <p className="admin-date">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "short",
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Hero sales figure + secondary metrics */}
        <div className="admin-hero-row">
          <div>
            <p className="admin-hero-label">This month's sales</p>
            <p className="admin-hero-value">₹{fmt(dashboard.this_month_sales)}</p>
            <p className="admin-hero-caption">
              <TrendingUp size={15} /> so far this month
            </p>
          </div>

          <div className="admin-metric-list">
            {[
              { icon: Package, label: "Products", value: dashboard.total_products },
              { icon: Package, label: "Stock", value: dashboard.total_stock },
              { icon: Users, label: "Customers", value: dashboard.total_customers },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="admin-metric-row">
                <span className="admin-metric-label">
                  <Icon size={15} /> {label}
                </span>
                <span className="admin-metric-value">{fmt(value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Order pipeline */}
        <div className="admin-pipeline">
          <div className="admin-pipeline-grid">
            {[
              { label: "Pending", value: dashboard.pending_orders, color: "var(--gold)" },
              { label: "Completed", value: dashboard.completed_orders, color: "var(--green)" },
              { label: "Cancelled", value: dashboard.cancelled_orders, color: "var(--clay)" },
              { label: "Low stock", value: dashboard.low_stock_count, color: "var(--clay)" },
            ].map(({ label, value, color }) => (
              <div key={label}>
                <p className="admin-pipeline-value" style={{ color }}>
                  {fmt(value)}
                </p>
                <p className="admin-pipeline-label">{label}</p>
              </div>
            ))}
          </div>
          <div className="admin-pipeline-bar">
            <div
              style={{
                width: `${(dashboard.pending_orders / pipelineTotal) * 100}%`,
                background: "var(--gold)",
              }}
            />
            <div
              style={{
                width: `${(dashboard.completed_orders / pipelineTotal) * 100}%`,
                background: "var(--green)",
              }}
            />
            <div
              style={{
                width: `${(dashboard.cancelled_orders / pipelineTotal) * 100}%`,
                background: "var(--clay)",
              }}
            />
          </div>
        </div>

        {/* Low stock + recent orders */}
        <div className="admin-lists">
          <div>
            <h2 className="admin-list-title">Low stock products</h2>
            {dashboard.low_stock_products.length === 0 ? (
              <p className="admin-empty-text">No low stock products right now.</p>
            ) : (
              <div>
                {dashboard.low_stock_products.map((product) => (
                  <div key={product._id} className="admin-list-row">
                    <span className="admin-stock-name">
                      <AlertTriangle size={14} color="var(--clay)" />
                      {product.name}
                    </span>
                    <span className="admin-stock-qty">{product.quantity} left</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="admin-list-title">Recent orders</h2>
            {dashboard.recent_orders.length === 0 ? (
              <p className="admin-empty-text">No orders yet.</p>
            ) : (
              <div>
                {dashboard.recent_orders.map((order) => {
                  const status =
                    STATUS_STYLES[order.order_status] || {
                      color: "var(--muted)",
                      label: order.order_status,
                    };
                  return (
                    <div key={order._id} className="admin-list-row">
                      <div className="admin-order-id">
                        <span
                          className="admin-status-dot"
                          style={{ background: status.color }}
                        />
                        <span>{order.order_id}</span>
                      </div>
                      <div className="admin-order-right">
                        <span style={{ color: status.color }}>{status.label}</span>
                        <span className="admin-order-total">₹{fmt(order.total)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;