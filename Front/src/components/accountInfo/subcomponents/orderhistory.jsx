/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import "../../../css/myaccount/orderhistory.css";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://back-server-1.onrender.com/orders/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status !== 200) {
        throw new Error("Failed to fetch orders");
      }
      // Sort orders by created_at date in descending order
      const sortedOrders = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setOrders(sortedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "Delivered";
      case "Processing":
        return "Processing"; // Waiting to be delivered
      case "Cancelled":
        return "Cancelled";
      case "Pending":
        return "Pending"; // Waiting for payment
      default:
        return "";
    }
  };

  const OrderItem = ({ item, status }) => {
    return (
      <div className="order-item">
        <img src={item.image_url} alt={`Image of ${item.product_name}`} className="order-item-image" />
        <div className="order-item-details">
          <span className="order-item-name">{item.product_name}</span>
          <span className="order-item-qty">{`x${item.quantity}`}</span>
          <span className="order-item-price">{`Ksh: ${item.price}`}</span>
        </div>
        {status === "Pending" && (
          <button className="pay-now-HIST" onClick={() => handlePayNow(item.order_id)}>Pay Now</button>
        )}
      </div>
    );
  };

  const handlePayNow = (orderId) => {
    navigate("/checkout", { state: { orderId } });
  };

  return (
    <div className="order-table-summary">
      {orders.length > 0 && (
        <h2 className="header-order-hist">Order History</h2>
      )}
      {orders.length === 0 ? (
        <div className="displayed-no-order">
          <div className="pan-effect">
            <img
              src="no-orders.jpg"
              alt="No orders placed"
              className="empty-order-image"
            />
          </div>
          <p>You have placed no orders yet!</p>
        </div>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="order-history-item">
            <div className="order-hist-summary">
              <div className="order-summary-header">
                <span className="order-id">Order #{order.id}</span>
                <span className="order-date">{new Date(order.created_at).toLocaleDateString()}</span>
                <span className="order-total">{`Ksh: ${order.total_price}`}</span>
                <span className={`order-status ${getStatusColor(order.status)}`}>{order.status}</span>
              </div>
              <div className="order-items">
                {order.items.map((item) => (
                  <OrderItem key={item.product_id} item={item} status={order.status} />
                ))}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;
