"use client";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setAdmin } from "../../redux/store/adminSlice";
import { UserCircle, Mail, Phone, LogOut, Pencil } from "lucide-react";

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
        if (!success || !user) throw new Error("Invalid user");

        setUserData(user);
        dispatch(setAdmin(user.role === "admin"));

        const [ordersRes, bookingsRes] = await Promise.all([
          fetch(user.role === "admin" ? "/api/admin/orders" : "/api/orders", {
            credentials: "include",
          }),
          fetch(user.role === "admin" ? "/api/admin/bookings" : "/api/admin/bookings", {
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
        router.push("/home");
      } else {
        throw new Error("Logout failed");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = () => {
    // You can open a modal or navigate to an edit page here
    router.push("/account/edit");
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

  // --- Status color mapping for orders ---
  const statusStyles = {
    pending: { color: "bg-yellow-100 text-yellow-700", label: "Pending" },
    shipped: { color: "bg-blue-100 text-blue-700", label: "Shipped" },
    delivered: { color: "bg-green-100 text-green-700", label: "Delivered" },
    cancelled: { color: "bg-red-100 text-red-700", label: "Cancelled" },
  };

  return (
    <div className="min-h-screen bg-green-50 py-6">
      {/* Top nav */}
      
      <main className="max-w-5xl mx-auto px-6 py-10 space-y-12">
        {/* Profile Card */}
        <section className="bg-white rounded-xl shadow p-6 flex flex-col sm:flex-row gap-8 items-center">
          <div className="flex-shrink-0">
            <UserCircle className="w-24 h-24 text-green-400 bg-green-100 rounded-full p-2" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-green-800 mb-1">
              {userData.fullName || userData.username}
            </h2>
            <p className="text-gray-600 mb-2 capitalize">
              {userData.role === "admin" ? "Admin" : "Customer"}
            </p>
            <div className="flex flex-col gap-1 text-gray-700 text-sm mb-2">
              <span className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {userData.email}
              </span>
              {userData.phoneNumber && (
                <span className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {userData.phoneNUmber}
                </span>
              )}
            </div>
            <div className="flex gap-4 mt-4">
              <button
                onClick={handleEdit}
                className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                <Pencil className="w-4 h-4" /> Edit Details
              </button>
              <button
                onClick={handleLogout}
                className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded hover:bg-red-100 transition"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        </section>

        {/* Orders Section */}
        <section>
          <h2 className="text-xl font-semibold text-green-800 mb-4">
            {isAdmin ? "All Orders" : "Your Orders"}
          </h2>
          {orders.length === 0 ? (
            <p className="text-gray-600">No orders found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {orders.map((order) => {
                const status = statusStyles[order.status] || statusStyles.pending;
                const total =
                  order.totalAmount ||
                  order.items.reduce(
                    (sum, i) => sum + (i.price * i.quantity),
                    0
                  );
                return (
                  <div
                    key={order._id}
                    className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200 flex flex-col p-4"
                  >
                    {/* Status and Date */}
                    <div className="flex items-center justify-between mb-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        {status.label}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {/* Items */}
                    <div className="flex flex-col gap-2 mb-2">
                      {order.items.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          {item.imageUrl && (
                            <img
                              src={item.imageUrl}
                              alt={item.common_name}
                              className="w-8 h-8 rounded object-cover border"
                            />
                          )}
                          <span className="font-medium text-gray-800 truncate">{item.common_name || item.name}</span>
                          <span className="text-xs text-gray-500 ml-auto">x{item.quantity}</span>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <div className="text-xs text-gray-400 pl-10">
                          +{order.items.length - 2} more
                        </div>
                      )}
                    </div>
                    {/* Address */}
                    <div className="text-xs text-gray-500 mb-1">
                      {order.address?.street}, {order.address?.city} {order.address?.pincode}
                    </div>
                    {/* User info for admin */}
                    {isAdmin && order.user && (
                      <div className="text-xs text-gray-400 mb-1">
                        <span className="font-medium text-gray-700">By:</span>{" "}
                        {order.user.fullName || order.user.username || "Unknown"}
                      </div>
                    )}
                    {/* Total and Payment */}
                    <div className="flex items-center justify-between mt-auto pt-2">
                      <span className="font-bold text-green-700 text-lg">
                        ₹{total}
                      </span>
                      <span className="text-xs text-gray-400 uppercase">
                        {order.paymentMethod || "COD"}
                      </span>
                    </div>
                    {/* Status dropdown for admin */}
                    {isAdmin && (
                      <div className="mt-2">
                        <select
                          className="border rounded px-2 py-1 text-xs"
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
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Bookings Section */}
        <section>
          <h2 className="text-xl font-semibold text-green-800 mb-4">
            {isAdmin ? "All Bookings" : "Your Bookings"}
          </h2>
          {bookings.length === 0 ? (
            <p className="text-gray-600">No bookings found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {bookings.map((booking) => (
                <div key={booking._id} className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200 flex flex-col p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-green-700 font-semibold">{booking.serviceName}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(booking.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mb-1">
                    Status: <span className="capitalize">{booking.status}</span>
                  </div>
                  {isAdmin && booking.user && (
                    <div className="text-xs text-gray-400 mb-1">
                      <span className="font-medium text-gray-700">By:</span>{" "}
                      {booking.user.fullName || booking.user.username || "Unknown"}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
