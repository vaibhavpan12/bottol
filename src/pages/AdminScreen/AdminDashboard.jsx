import { useEffect, useState } from "react";
import {
  Package,
  Users,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import "../../css/Admin.css";
import {BASE_URL} from "../../config/api";

const fmt = (n) =>
  new Intl.NumberFormat("en-IN").format(n ?? 0);

const STATUS_STYLES = {
  placed: {
    color: "var(--gold)",
    label: "Placed",
  },
  processing: {
    color: "var(--gold)",
    label: "Processing",
  },
  shipped: {
    color: "var(--clay)",
    label: "Shipped",
  },
  pending: {
    color: "var(--gold)",
    label: "Pending",
  },
  completed: {
    color: "var(--green)",
    label: "Completed",
  },
  cancelled: {
    color: "var(--clay)",
    label: "Cancelled",
  },
};

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("adminToken");

      if (!token) {
        throw new Error("Admin session expired. Please login again.");
      }

      const response = await fetch(
        `${BASE_URL}/api/admin/dashboard`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to load dashboard"
        );
      }

      if (data.success) {
        setDashboard(data.dashboard);
      } else {
        throw new Error("Unable to load dashboard");
      }
    } catch (err) {
      console.error("Dashboard error:", err);
      setError(err.message || "Unable to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  /* ================================
     LOADING
  ================================= */

  if (loading) {
    return (
      <div className="admin-center">
        <div>
          <div className="admin-spinner" />
          <p className="admin-loading-text">
            Loading dashboard…
          </p>
        </div>
      </div>
    );
  }

  /* ================================
     ERROR
  ================================= */

  if (error) {
    return (
      <div className="admin-center">
        <div className="admin-error">
          {error}
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return null;
  }

  /* ================================
     ORDER TOTAL
  ================================= */

  const pipelineTotal =
    (dashboard.pending_orders || 0) +
      (dashboard.completed_orders || 0) +
      (dashboard.cancelled_orders || 0) || 1;

  return (
    <div className="admin-root">
      <div className="admin-container">

        {/* =================================
            HEADER
        ================================= */}

        <div className="admin-header">
          <div>
            <p className="admin-eyebrow">
              Store admin
            </p>

            <h1 className="admin-title">
              Dashboard
            </h1>
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


        {/* =================================
            SALES + MAIN METRICS
        ================================= */}

        <div className="admin-hero-row">

          {/* SALES */}

          <div>
            <p className="admin-hero-label">
              This month's sales
            </p>

            <p className="admin-hero-value">
              ₹{fmt(dashboard.this_month_sales)}
            </p>

            <p className="admin-hero-caption">
              <TrendingUp size={15} />
              so far this month
            </p>
          </div>


          {/* METRICS */}

          <div className="admin-metric-list">

            {/* PRODUCTS */}

            <div className="admin-metric-row">
              <span className="admin-metric-label">
                <Package size={15} />
                Products
              </span>

              <span className="admin-metric-value">
                {fmt(dashboard.total_products)}
              </span>
            </div>


            {/* STOCK */}

            <div className="admin-metric-row">
              <span className="admin-metric-label">
                <Package size={15} />
                Total Stock
              </span>

              <span className="admin-metric-value">
                {fmt(dashboard.total_stock)}
              </span>
            </div>


            {/* CUSTOMERS */}

            <div className="admin-metric-row">
              <span className="admin-metric-label">
                <Users size={15} />
                Customers
              </span>

              <span className="admin-metric-value">
                {fmt(dashboard.total_customers)}
              </span>
            </div>

          </div>
        </div>


        {/* =================================
            ORDER PIPELINE
        ================================= */}

        <div className="admin-pipeline">

          <div className="admin-pipeline-grid">

            {/* PENDING */}

            <div>
              <p
                className="admin-pipeline-value"
                style={{ color: "var(--gold)" }}
              >
                {fmt(dashboard.pending_orders)}
              </p>

              <p className="admin-pipeline-label">
                Pending
              </p>
            </div>


            {/* COMPLETED */}

            <div>
              <p
                className="admin-pipeline-value"
                style={{ color: "var(--green)" }}
              >
                {fmt(dashboard.completed_orders)}
              </p>

              <p className="admin-pipeline-label">
                Completed
              </p>
            </div>


            {/* CANCELLED */}

            <div>
              <p
                className="admin-pipeline-value"
                style={{ color: "var(--clay)" }}
              >
                {fmt(dashboard.cancelled_orders)}
              </p>

              <p className="admin-pipeline-label">
                Cancelled
              </p>
            </div>


            {/* LOW STOCK */}

            <div>
              <p
                className="admin-pipeline-value"
                style={{ color: "var(--clay)" }}
              >
                {fmt(dashboard.low_stock_count)}
              </p>

              <p className="admin-pipeline-label">
                Low stock
              </p>
            </div>

          </div>


          {/* ORDER BAR */}

          <div className="admin-pipeline-bar">

            <div
              style={{
                width: `${
                  (dashboard.pending_orders /
                    pipelineTotal) *
                  100
                }%`,
                background: "var(--gold)",
              }}
            />

            <div
              style={{
                width: `${
                  (dashboard.completed_orders /
                    pipelineTotal) *
                  100
                }%`,
                background: "var(--green)",
              }}
            />

            <div
              style={{
                width: `${
                  (dashboard.cancelled_orders /
                    pipelineTotal) *
                  100
                }%`,
                background: "var(--clay)",
              }}
            />

          </div>
        </div>


        {/* =================================
            LOW STOCK + RECENT ORDERS
        ================================= */}

        <div className="admin-lists">

          {/* LOW STOCK */}

          <div>

            <h2 className="admin-list-title">
              Low stock products
            </h2>

            {dashboard.low_stock_products?.length === 0 ? (

              <p className="admin-empty-text">
                No low stock products right now.
              </p>

            ) : (

              <div>

                {dashboard.low_stock_products?.map(
                  (product) => (

                    <div
                      key={product._id}
                      className="admin-list-row"
                    >

                      <span className="admin-stock-name">

                        <AlertTriangle
                          size={14}
                          color="var(--clay)"
                        />

                        {product.name}

                      </span>

                      <span className="admin-stock-qty">
                        {fmt(product.quantity)} left
                      </span>

                    </div>

                  )
                )}

              </div>

            )}

          </div>


          {/* RECENT ORDERS */}

          <div>

            <h2 className="admin-list-title">
              Recent orders
            </h2>

            {dashboard.recent_orders?.length === 0 ? (

              <p className="admin-empty-text">
                No orders yet.
              </p>

            ) : (

              <div>

                {dashboard.recent_orders?.map(
                  (order) => {

                    const status =
                      STATUS_STYLES[
                        order.order_status
                      ] || {
                        color: "var(--muted)",
                        label:
                          order.order_status ||
                          "Unknown",
                      };

                    return (
                      <div
                        key={order._id}
                        className="admin-list-row"
                      >

                        <div className="admin-order-id">

                          <span
                            className="admin-status-dot"
                            style={{
                              background:
                                status.color,
                            }}
                          />

                          <span>
                            {order.order_id}
                          </span>

                        </div>


                        <div className="admin-order-right">

                          <span
                            style={{
                              color:
                                status.color,
                            }}
                          >
                            {status.label}
                          </span>

                          <span className="admin-order-total">
                            ₹{fmt(order.total)}
                          </span>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>

            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;