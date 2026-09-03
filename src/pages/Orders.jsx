import { useEffect, useState } from "react";
import { BASE_URL } from "../config/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Temporary user id (baad me login se aayega)
  const userId = "USER001";

  useEffect(() => {
    fetch(`${BASE_URL}/api/orders/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.orders || []);
      })
      .finally(() => setLoading(false));
  }, []);

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
            <p>Your completed orders will appear here.</p>
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
                          item.image.startsWith("/uploads/")
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