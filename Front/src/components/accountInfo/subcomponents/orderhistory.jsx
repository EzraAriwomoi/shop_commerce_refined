import React from "react";
import "../../../css/myaccount/orderhistory.css";

function EyeIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export default function OrderHistory() {
  const orders = [
    { id: "#12345", date: "2023-04-15", total: "kes 176.00", status: "Delivered" },
    { id: "#12346", date: "2023-10-20", total: "kes 429.79", status: "Processing" },
    { id: "#12347", date: "2024-02-10", total: "kes 7000.00", status: "Cancelled" }
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "text-green-600";
      case "processing":
        return "text-yellow-600";
      case "cancelled":
        return "text-red-600";
      default:
        return "";
    }
  };

  return (
    <div className="order-history">
      <h2 className="text-xl font-semibold mb-4">Order History</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Order #</th>
            <th>Date</th>
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>
                <a href="#" className="text-primary hover:underline">
                  {order.id}
                </a>
              </td>
              <td>{order.date}</td>
              <td>{order.total}</td>
              <td>
                <span className={`status ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </td>
              <td>
                <button size="sm">
                  <EyeIcon className="h-4 w-4" />
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
