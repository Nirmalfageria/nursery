"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Capitalize helper
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

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

        const filtered = orders.filter(
          (o) => o.status.toLowerCase() === status.toLowerCase()
        );

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

  useEffect(() => {
    const q = query.toLowerCase();
    if (!q) {
      setFilteredOrders(orders);
      return;
    }

    setFilteredOrders(
      orders.filter((o) => {
        return (
          o._id.toLowerCase().includes(q) ||
          o.status.toLowerCase().includes(q) ||
          o.paymentStatus?.toLowerCase().includes(q) ||
          o.items.length.toString().includes(q) ||
          o.totalAmount.toString().includes(q) ||
          new Date(o.createdAt).toLocaleString().toLowerCase().includes(q) ||
          (o.address &&
            `${o.address.street} ${o.address.city} ${o.address.state} ${o.address.pincode}`
              .toLowerCase()
              .includes(q)) ||
          (user?.role === "admin" &&
            ((o.user?.fullName && o.user.fullName.toLowerCase().includes(q)) ||
              (o.user?.email && o.user.email.toLowerCase().includes(q)) ||
              (o.user?.phoneNumber && o.user.phoneNumber.includes(q))))
        );
      })
    );
  }, [query, orders, user]);

  const handleUpdate = async (orderId, changes) => {
    const confirmChange = confirm("Are you sure you want to update the order?");
    if (!confirmChange) return;

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        body: JSON.stringify(changes),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success) {
        window.location.reload();
      } else {
        alert("Update failed: " + data.message);
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("An error occurred while updating.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-16 flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-20 max-w-4xl mx-auto bg-green-50 space-y-6">
      <h1 className="text-2xl font-bold text-green-800 capitalize">
        Orders - {capitalize(status)}
      </h1>

      <input
        type="text"
        placeholder="Search by name, ID, status, payment, etc."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-3 rounded border shadow focus:outline-green-500"
      />

      {filteredOrders.length === 0 ? (
        <p>No matching orders found.</p>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((o) => (
            <div key={o._id} className="bg-white p-6 rounded-xl shadow space-y-2">
              {user?.role === "admin" && (
                <>
                  <p>
                    <strong>Customer:</strong> {o.user?.fullName || o.user?.username || "N/A"}
                  </p>
                  <p>
                    <strong>Email:</strong> {o.user?.email || "N/A"}
                  </p>
                  <p>
                    <strong>Phone:</strong> {o.user?.phoneNumber || "N/A"}
                  </p>
                </>
              )}

              <p>
                <strong>Address:</strong>{" "}
                {o.address
                  ? `${o.address.street}, ${o.address.city}, ${o.address.state}, ${o.address.pincode}`
                  : "N/A"}
              </p>

              <p>
                <strong>Payment Method:</strong> {o.paymentMethod || "N/A"}
              </p>

              {user?.role === "admin" ? (
                <div className="space-y-2">
                  <p>
                    <strong>Status:</strong>{" "}
                    <select
                      value={o.status}
                      onChange={(e) =>
                        handleUpdate(o._id, { status: e.target.value })
                      }
                      className="ml-2 border rounded px-2 py-1"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </p>

                  <p>
                    <strong>Payment Status:</strong>{" "}
                    <select
                      value={o.paymentStatus || "Pending"}
                      onChange={(e) =>
                        handleUpdate(o._id, { paymentStatus: e.target.value })
                      }
                      className="ml-2 border rounded px-2 py-1"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                  
                    </select>
                  </p>
                </div>
              ) : (
                <>
                  <p>
                    <strong>Status:</strong> {o.status}
                  </p>
                  <p>
                    <strong>Payment Status:</strong> {o.paymentStatus || "Pending"}
                  </p>
                </>
              )}

              <p>
                <strong>Total Items:</strong> {o.items.length}
              </p>
              <p>
                <strong>Total Amount:</strong> ₹{o.totalAmount || 0}
              </p>
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
