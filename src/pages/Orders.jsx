import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BASE_URL } from "../config/api";
import { useShopUI } from "../context/ShopUIContext";
import usePageTitle from "../hooks/usePageTitle";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(Boolean(localStorage.getItem("token")));
  const { openLogin } = useShopUI();
  usePageTitle("My orders");

  useEffect(() => {
    const sync = () => setSignedIn(Boolean(localStorage.getItem("token")));
    window.addEventListener("auth-changed", sync);
    return () => window.removeEventListener("auth-changed", sync);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    let user = null;
    try {
      user = JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      user = null;
    }

    if (!token || !user?.id) {
      setOrders([]);
      setLoading(false);
      return;
    }
    setLoading(true);

    fetch(`${BASE_URL}/api/orders/AllOrder/user/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setOrders(data.orders || []))
      .catch((err) => console.error("Failed to load orders:", err))
      .finally(() => setLoading(false));
  }, [signedIn]);

  if (!signedIn) {
    return (
      <div className="page">
        <div className="wrap page-state">
          <h1>My orders</h1>
          <p>Sign in to see your orders and their delivery status.</p>
          <button className="btn btn-primary" onClick={openLogin}>Sign in</button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="orders-page">Loading orders...</div>;
  }

  return (
    <section className="orders-page">
      <div className="wrap">

        <div className="orders-header">
          <h1>My Orders</h1>
          <p>{orders.length} Orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="empty-orders">
            <h2>No orders yet</h2>
            <p>When you place an order, it will appear here.</p>
            <Link to="/shop" className="btn btn-primary">Start shopping</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div className="order-card" key={order.order_id}>

                <div className="order-top">
                  <div>
                    <span className="order-id">
                      {order.order_id}
                    </span>

                    <span className="order-date">
                      {new Date(
                        order.created_at
                      ).toLocaleDateString()}
                    </span>
                  </div>

                  <span className="order-status">
                    {order.order_status}
                  </span>
                </div>

                <div className="order-items">
                  {order.items.map((item) => (
                    <div
                      className="order-item"
                      key={item.product_id}
                    >
                      <img
                        src={
                          item.image?.startsWith("/uploads/")
                            ? `${BASE_URL}${item.image}`
                            : item.image
                        }
                        alt={item.name}
                      />

                      <div>
                        <h4>{item.name}</h4>

                        <p>
                          Qty {item.quantity} × ₹
                          {item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-bottom">
                  <span>Total</span>

                  <strong>₹{order.total}</strong>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}