"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function OrderStatusPage({ params }) {
  const status = params.status;
  const router = useRouter();
  const searchParams = useSearchParams();

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/admin/orders", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch orders");

        const data = await res.json();
        const filtered = (data?.orders || []).filter(
          (order) => order.status === status
        );

        setOrders(filtered);
      } catch (err) {
        setError("Failed to load orders");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [status]);

  const groupedByDate = orders.reduce((acc, order) => {
    const dateKey = new Date(order.createdAt).toISOString().split("T")[0];
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(order);
    return acc;
  }, {});

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (error)
    return (
      <div className="p-6 text-red-600 text-center">
        <p>{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-green-50 py-10 px-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-green-800 mb-6">
        {status.toUpperCase()} Orders (Grouped by Date)
      </h2>

      {orders.length === 0 ? (
        <p className="text-gray-600">No orders found.</p>
      ) : (
        <div className="space-y-10">
          {Object.entries(groupedByDate).map(([date, ordersOnDate]) => (
            <div key={date}>
              <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-1">
                {new Date(date).toDateString()}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {ordersOnDate.map((order) => (
                  <div
                    key={order._id}
                    className="bg-white rounded-xl shadow p-4 border border-gray-100 hover:shadow-md transition"
                  >
                    <div className="mb-2 text-sm text-gray-600">
                      <span className="font-medium text-gray-800">Order ID:</span>{" "}
                      {order._id}
                    </div>
                    <div className="mb-1 text-sm text-gray-600">
                      <span className="font-medium">Name:</span>{" "}
                      {order.user?.fullName || "Unknown"}
                    </div>
                    <div className="mb-1 text-sm text-gray-600">
                      <span className="font-medium">Items:</span> {order.items.length}
                    </div>
                    <div className="mb-1 text-sm text-gray-600">
                      <span className="font-medium">Total:</span> ₹
                      {order.totalAmount ||
                        order.items.reduce((sum, i) => sum + i.price * i.quantity, 0)}
                    </div>
                    <div className="mb-3 text-sm text-gray-600">
                      <span className="font-medium">Payment:</span>{" "}
                      {order.paymentMethod || "COD"}
                    </div>
                    <Link
                      href={`/account/orders/details/${order._id}`}
                      className="inline-flex items-center text-sm text-blue-600 hover:underline font-medium"
                    >
                      View Full Details →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Only needed for static site generation (optional for app router)
export async function generateStaticParams() {
  return ["pending", "shipped", "delivered", "cancelled"].map((status) => ({
    status,
  }));
}
