"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function StatusOrdersPage() {
  const { status } = useParams();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrders();
  }, [status, router]);

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
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen py-16 flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );

  return (
    <div className="min-h-screen px-6 py-16 max-w-4xl mx-auto bg-green-50 space-y-6">
      <h1 className="text-2xl font-bold text-green-800 capitalize">Orders - {status}</h1>

      {orders.length === 0 ? (
        <p>No orders found for this status.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((o) => (
            <div key={o._id} className="bg-white p-6 rounded-xl shadow">
              <p>
                <strong>Order ID:</strong> {o._id}
              </p>

              {/* User View */}
              {user?.role !== "admin" ? (
                <>
                  <p><strong>Status:</strong> {o.status}</p>
                  <p><strong>Total Items:</strong> {o.items.length}</p>
                  <p><strong>Total Amount:</strong> ₹{o.totalAmount}</p>
                  <p>
                    <strong>Address:</strong>{" "}
                    {o.address
                      ? `${o.address.street}, ${o.address.city}, ${o.address.state}, ${o.address.pincode}`
                      : "N/A"}
                  </p>
                </>
              ) : (
                <>
                  {/* Admin View */}
                  <p>
                    <strong>Customer:</strong>{" "}
                    {o.user?.fullName || o.user?.username || "N/A"}
                  </p>
                  <p><strong>Email:</strong> {o.user?.email || "N/A"}</p>
                  <p><strong>Phone:</strong> {o.user?.phoneNumber || "N/A"}</p>
                  <p>
                    <strong>Address:</strong>{" "}
                    {o.address
                      ? `${o.address.street}, ${o.address.city}, ${o.address.state}, ${o.address.pincode}`
                      : "N/A"}
                  </p>
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
                  <p><strong>Total Items:</strong> {o.items.length}</p>
                  <p><strong>Total Amount:</strong> ₹{o.totalAmount}</p>
                </>
              )}

              <p className="text-sm text-gray-500 mt-2">
                Created at: {new Date(o.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
