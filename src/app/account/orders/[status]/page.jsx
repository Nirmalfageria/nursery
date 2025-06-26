"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function StatusOrdersPage() {
  const { status } = useParams();
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/me", { credentials: "include" });
        if (res.status === 401) return router.replace("/login");

        const { user } = await res.json();
        setUser(user);

        const endpoint = user.role === "admin" ? "/api/admin/orders" : "/api/orders";
        const orderRes = await fetch(endpoint, { credentials: "include" });
        const { orders } = await orderRes.json();

        const filtered = orders.filter((o) => o.status === status);
        setOrders(filtered);
        setFilteredOrders(filtered);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrders();
  }, [status, router]);

  // Handle status change
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
        headers: { "Content-Type": "application/json" },
      });

      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
      setFilteredOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  // Search logic
  useEffect(() => {
    const q = query.toLowerCase();
    if (!q) {
      setFilteredOrders(orders);
      return;
    }

    setFilteredOrders(
      orders.filter((o) => {
        return (
          o._id.includes(q) ||
          o.status.toLowerCase().includes(q) ||
          o.items.length.toString().includes(q) ||
          o.totalAmount.toString().includes(q) ||
          new Date(o.createdAt).toLocaleString().toLowerCase().includes(q) ||
          (o.address &&
            `${o.address.street} ${o.address.city} ${o.address.state} ${o.address.pincode}`.toLowerCase().includes(q)) ||
          (user?.role === "admin" &&
            ((o.user?.fullName && o.user.fullName.toLowerCase().includes(q)) ||
              (o.user?.email && o.user.email.toLowerCase().includes(q)) ||
              (o.user?.phoneNumber && o.user.phoneNumber.includes(q))))
        );
      })
    );
  }, [query, orders, user]);

  if (isLoading)
    return (
      <div className="min-h-screen py-16 flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );

  return (
    <div className="min-h-screen px-6   py-20 max-w-4xl mx-auto bg-green-50 space-y-6">
      <h1 className="text-2xl font-bold text-green-800 capitalize">Orders - {status}</h1>

      {/* ✅ Search Bar */}
      <input
        type="text"
        placeholder="Search orders..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-3 rounded border shadow focus:outline-green-500"
      />

      {filteredOrders.length === 0 ? (
        <p>No matching orders found.</p>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((o) => (
            <div key={o._id} className="bg-white p-6 rounded-xl shadow">
              <p><strong>Order ID:</strong> {o._id}</p>

              {/* 👤 Customer Info for Admin */}
              {user?.role === "admin" && (
                <>
                  <p><strong>Customer:</strong> {o.user?.fullName || o.user?.username || "N/A"}</p>
                  <p><strong>Email:</strong> {o.user?.email || "N/A"}</p>
                  <p><strong>Phone:</strong> {o.user?.phoneNumber || "N/A"}</p>
                </>
              )}

              <p>
                <strong>Address:</strong>{" "}
                {o.address
                  ? `${o.address.street}, ${o.address.city}, ${o.address.state}, ${o.address.pincode}`
                  : "N/A"}
              </p>

              {/* 👇 Admin can change status */}
              {user?.role === "admin" ? (
                <p>
                  <strong>Status:</strong>{" "}
                  <select
                    value={o.status}
                    onChange={(e) => handleStatusChange(o._id, e.target.value)}
                    className="ml-2 border rounded px-2 py-1"
                  >
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </p>
              ) : (
                <p><strong>Status:</strong> {o.status}</p>
              )}

              <p><strong>Total Items:</strong> {o.items.length}</p>
              <p><strong>Total Amount:</strong> ₹{o.totalAmount}</p>
              <p className="text-sm text-gray-500 mt-2">Created at: {new Date(o.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
