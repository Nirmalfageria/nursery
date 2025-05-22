"use client";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { setAdmin } from "../../redux/store/adminSlice";
export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUserDataAndOrders = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const userRes = await fetch("/api/me", {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (!userRes.ok) {
          throw new Error(
            userRes.status === 401
              ? "Unauthorized"
              : "Failed to fetch user data"
          );
        }

        const { user, success } = await userRes.json();
        if (!success) throw new Error("Invalid user data");
        setUserData(user);
        // console.log(user)
        const orderRes = await fetch("/api/orders", {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        const orderData = await orderRes.json();
        setOrders(orderData.orders || []);
        // console.log(orderData)
      } catch (err) {
        console.error("Dashboard error:", err);
        setError(err.message);
        document.cookie =
          "session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDataAndOrders();
  }, [router]);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setUserData(null);

        Cookies.remove("isAdmin");
        dispatch(setAdmin(false));
        router.push("/login");
      } else {
        throw new Error("Logout failed");
      }
    } catch (err) {
      console.error("Logout error:", err);
      setError(err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <img
          src="/temp/5FCA.gif"
          alt="Loading animation"
          className="w-48 h-48 object-contain"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold ">Please Login First </h2> 
          {/* <p className="text-gray-700">{error}</p> */}
          <button
            onClick={() => router.push("/login")}
            className="mt-2 px-5 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition cursor-pointer"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-green-700">Dashboard</h1>
          <div className="flex items-center gap-4">
            {userData && (
              <span className="text-sm text-gray-700">
                Hello,{" "}
                <span className="font-medium">
                  {userData.fullName || userData.username}
                </span>
              </span>
            )}
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:underline"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-10">
        <div className="bg-white shadow rounded-xl p-6">
          {userData ? (
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold text-green-800">
                Account Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-lg p-4 border">
                  <h3 className="text-lg font-semibold text-green-700 mb-3">
                    Profile
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700 break-words">
                    <li>
                      <strong>Full Name:</strong> {userData.fullName}
                    </li>
                    <li>
                      <strong>Username:</strong> @{userData.username}
                    </li>
                    <li>
                      <strong>Email:</strong> {userData.email}
                    </li>
                    <li>
                      <strong>Mobile:</strong> {userData.phoneNumber}
                    </li>
                    <li>
                      <strong>Role:</strong> {userData.role}
                    </li>
                    <li>
                      <strong>Verified:</strong>{" "}
                      {userData.isVerified ? (
                        "Yes"
                      ) : (
                        <span className="text-red-600">
                          No —{" "}
                          <Link
                            href={{
                              pathname: "/verify",
                              query: {
                                email: userData.email || "",
                                phoneNumber: userData.phoneNumber || "",
                              },
                            }}
                            className="text-blue-600 hover:underline"
                          >
                            Verify Now
                          </Link>
                        </span>
                      )}
                    </li>
                  </ul>
                </div>

                <div className="bg-green-50 rounded-lg p-4 border">
                  <h3 className="text-lg font-semibold text-green-700 mb-3">
                    Actions
                  </h3>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-800">
                No user data found
              </h3>
              <p className="text-gray-600 mt-2">
                Please login to view your dashboard
              </p>
              <Link
                href="/login"
                className="inline-block mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Go to Login
              </Link>
            </div>
          )}
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-semibold text-green-800 mb-4">
            Order Summary
          </h2>
          {orders.length === 0 ? (
            <p className="text-gray-600">No orders found.</p>
          ) : (
            <ul className="space-y-4">
              {orders.map((order) => (
                <li
                  key={order._id}
                  className="border p-4 rounded-lg bg-green-50 break-words"
                >
                  <div className="flex flex-col justify-between items-center sm:flex-row">
                    <div>
                      <p className="text-sm text-gray-600">
                        Status: {order.status}
                      </p>
                      <p className="text-sm text-gray-600">
                        Placed on:{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <span className="text-sm text-gray-600">
                      {order.address.street},{order.address.city},
                      {order.address.pincode}
                    </span>
                  </div>
                  <ul className="mt-3 text-sm text-gray-700 space-y-1 pl-4 list-disc break-words">
                    {order.items.map((item, i) => (
                      <li key={i}>
                        {item.common_name} (quantity: {item.quantity}) - ₹
                        {item.price}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
