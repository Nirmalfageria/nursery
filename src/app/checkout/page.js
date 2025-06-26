"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { clearCart } from "../../redux/store/cardSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CheckoutPage() {
  const cartItems = useSelector((state) => state.cart.items);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();
  const router = useRouter();

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
    0
  );

  // Auth check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/me", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          router.push("/login");
          return;
        }

        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          router.push("/login");
        }
      } catch (err) {
        console.error("Auth failed", err);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Redirect if cart is empty
  useEffect(() => {
    if (!isLoading && cartItems.length === 0) {
      router.push("/cart");
    }
  }, [isLoading, cartItems, router]);

  // Handle place order
  const handlePlaceOrder = async () => {
    if (!street || !city || !stateName || !pincode) {
      toast.error("Please fill in all address fields.");
      return;
    }

    if (pincode.length !== 6 || !/^\d+$/.test(pincode)) {
      toast.error("Enter a valid 6-digit pincode.");
      return;
    }

    if (!["COD", "UPI"].includes(paymentMethod)) {
      toast.error("Invalid payment method.");
      return;
    }

    setIsPlacingOrder(true);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          cartItems,
          address: {
            street,
            city,
            state: stateName,
            pincode,
          },
          paymentMethod,
          totalAmount: totalPrice,
        }),
      });

      const result = await res.json();

      if (result.success) {
        toast.success("🎉 Order placed successfully!", {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
        });

        dispatch(clearCart());

        // Wait until toast finishes showing
        setTimeout(() => router.push("/"), 3500);
      } else {
        if (result.message === "Unauthorized") {
          router.push("/login");
        } else {
          toast.error(result.message || "Order failed.");
        }
      }
    } catch (err) {
      console.error("Order error", err);
      toast.error("Something went wrong.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (isLoading) return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
  if (!user || cartItems.length === 0) return null;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 text-black">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        theme="colored"
        pauseOnHover
        draggable
      />

      <h2 className="text-3xl font-bold mb-6">Checkout</h2>

      {/* Payment Method */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Payment Method</h3>
        <div className="flex gap-6">
          {["COD", "UPI"].map((method) => (
            <label
              key={method}
              className={`cursor-pointer border-2 px-4 py-2 rounded-lg ${
                paymentMethod === method ? "border-green-600 bg-green-50" : "border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="payment"
                value={method}
                checked={paymentMethod === method}
                onChange={() => setPaymentMethod(method)}
                className="mr-2"
              />
              {method === "COD" ? "Cash on Delivery" : "UPI Payment"}
            </label>
          ))}
        </div>
      </div>

      {/* Address Form */}
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Street Address"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          className="w-full p-3 border rounded"
        />
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full p-3 border rounded"
        />
        <input
          type="text"
          placeholder="State"
          value={stateName}
          onChange={(e) => setStateName(e.target.value)}
          className="w-full p-3 border rounded"
        />
        <input
          type="text"
          placeholder="Pincode"
          maxLength={6}
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          className="w-full p-3 border rounded"
        />
      </div>

      {/* Total and Button */}
      <div className="mt-8">
        <h4 className="text-xl font-bold mb-3">Total: ₹{totalPrice.toFixed(2)}</h4>
        <button
          onClick={handlePlaceOrder}
          disabled={isPlacingOrder}
          className={`w-full py-3 rounded text-white font-semibold ${
            isPlacingOrder ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isPlacingOrder ? "Placing Order..." : `Place Order - ₹${totalPrice.toFixed(2)}`}
        </button>
      </div>
    </div>
  );
}
