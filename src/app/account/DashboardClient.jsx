"use client";

import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setAdmin } from "../../redux/store/adminSlice";
import Link from "next/link";
import { UserCircle, Mail, Phone } from "lucide-react";

export default function DashboardClient() {
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/me", { credentials: "include" });
        if (res.status === 401) return router.replace("/login");

        const { user } = await res.json();
        setUserData(user);
        dispatch(setAdmin(user.role === "admin"));

        const orderRes = await fetch(user.role === "admin" ? "/api/admin/orders" : "/api/orders", {
          credentials: "include",
        });
        const { orders } = await orderRes.json();
        setOrders(orders);
      } catch (err) {
        console.error(err);
        setError("Authentication failed");
        Cookies.remove("session");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [dispatch, router]);

  if (isLoading)
    return <div className="min-h-screen flex justify-center items-center">Loading...</div>;

  if (error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-red-600">
        <p>{error}</p>
        <button onClick={() => router.push("/login")} className="mt-4 bg-green-600 text-white px-4 py-2 rounded">Go to Login</button>
      </div>
    );

  const getCount = (status) => orders.filter((o) => o.status === status).length;

  return (
    <div className="min-h-screen bg-green-50 py-6 px-6 max-w-5xl mx-auto space-y-8">
      <div className="bg-white p-6 rounded-xl flex items-center gap-4 shadow">
        <UserCircle className="w-16 h-16 text-green-400 bg-green-100 p-2 rounded-full" />
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-green-800">{userData.fullName || userData.username}</h2>
          <p className="capitalize">{userData.role}</p>
          <p><Mail className="inline w-4 h-4" /> {userData.email}</p>
          {userData.phoneNumber && <p><Phone className="inline w-4 h-4" /> {userData.phoneNumber}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {["pending", "shipped", "delivered", "cancelled"].map((status) => (
          <Link key={status} href={`/account/orders/${status}`}>
            <div className="bg-white rounded-xl shadow p-4 hover:bg-green-100 cursor-pointer text-center">
              <h3 className="text-lg font-semibold capitalize">{status}</h3>
              <p className="text-2xl font-bold text-green-700">{getCount(status)}</p>
              <p className="text-sm text-gray-500">Orders</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
