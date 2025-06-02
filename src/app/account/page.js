"use client";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setAdmin } from "../../redux/store/adminSlice";
import { User } from "lucide-react";

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const userRes = await fetch("/api/me", {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (!userRes.ok) throw new Error("Failed to fetch user data");

        const { user, success } = await userRes.json();
        // console.log(user)
        if (!success || !user) throw new Error("Invalid user");

        setUserData(user);
        
        dispatch(setAdmin(user.role === "admin"));

        const [ordersRes, bookingsRes] = await Promise.all([
          fetch(user.role === "admin" ? "/api/admin/orders" : "/api/orders", {
            credentials: "include",
          }),
          fetch(user.role === "admin" ? "/api/admin/bookings" : "/api/bookings", {
            credentials: "include",
          }),
        ]);

        const ordersData = await ordersRes.json();
        const bookingsData = await bookingsRes.json();

        setOrders(ordersData?.orders || []);
        setBookings(bookingsData?.bookings || []);
      } catch (err) {
        setError(err.message || "Unexpected error");
        Cookies.remove("session");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router, dispatch]);
  console.log(userData)
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        setUserData(null);
        Cookies.remove("isAdmin");
        dispatch(setAdmin(false));
        router.push("/login");
      } else {
        throw new Error("Logout failed");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  if (isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-red-700">Error</h2>
          <p>{error}</p>
          <button
            onClick={() => router.push("/login")}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );

  const isAdmin = userData?.role === "admin";

  return (
    <div className="min-h-screen bg-green-50 py-14">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between">
          <h1 className="text-xl font-bold text-green-700">Dashboard</h1>
          <div className="flex gap-4 items-center">
            <span className="text-sm text-gray-600">
              Hello, <strong>{userData.fullName || userData.username}</strong>
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:underline"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-12">
        <section className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-green-800 mb-4">
            {isAdmin ? "All Orders" : "Your Orders"}
          </h2>
          {orders.length === 0 ? (
            <p className="text-gray-600">No orders found.</p>
          ) : (
            <ul className="space-y-4">
              {orders.map((order) => (
                <li key={order._id} className="border rounded-lg p-4 bg-green-50">
                  <div className="flex flex-col sm:flex-row justify-between">
                    <div>
                      <p>
                        <strong>Status:</strong>{" "}
                        {isAdmin ? (
                          <select
                            className="border rounded px-2 py-1"
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order._id, e.target.value)
                            }
                          >
                            <option value="pending">Pending</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        ) : (
                          order.status
                        )}
                      </p>
                      <p>
                        <strong>Placed on:</strong>{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      {isAdmin && (
                        <p>
                          <strong>Placed by:</strong>{" "}
                          {order.user?.fullName || order.user?.username || "Unknown"}
                        </p>
                      )}
                    </div>
                    <div>
                      <p>
                        <strong>Address:</strong>{" "}
                        {order.address?.street}, {order.address?.city} -{" "}
                        {order.address?.pincode}
                      </p>
                    </div>
                  </div>
                  <ul className="mt-2 pl-5 list-disc text-sm">
                    {order.items.map((item, i) => (
                      <li key={i}>
                        {item.common_name} (x{item.quantity}) - ₹{item.price}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-green-800 mb-4">
            {isAdmin ? "All Bookings" : "Your Bookings"}
          </h2>
          {bookings.length === 0 ? (
            <p className="text-gray-600">No bookings found.</p>
          ) : (
            <ul className="space-y-4">
              {bookings.map((booking) => (
                <li key={booking._id} className="border rounded-lg p-4 bg-green-50">
                  <p>
                    <strong>Service:</strong> {booking.serviceName}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(booking.date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Status:</strong> {booking.status}
                  </p>
                  {isAdmin && (
                    <p>
                      <strong>Booked by:</strong>{" "}
                      {booking.user?.fullName || booking.user?.username || "Unknown"}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
