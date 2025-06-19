"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export default function CartSnackbar() {
  const cartItems = useSelector((state) => state.cart.items);
  const [show, setShow] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (cartItems.length > 0) {
      setShow(true);
      const timeout = setTimeout(() => setShow(false), 5000);
      return () => clearTimeout(timeout);
    }
  }, [cartItems.length]);

  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-fit max-w-[95%]">
      <div className="bg-green-600 text-white px-5 py-3 rounded-full shadow-xl flex items-center gap-4">
        Product added to cart
        <button
          onClick={() => router.push("/cart")}
          className="cursor-pointer underline font-semibold hover:text-green-200"
        >
          View Cart
        </button>
      </div>
    </div>
  );
}
