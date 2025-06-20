"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { FaShoppingCart } from "react-icons/fa";

export default function CartSnackbar() {
  const cartItems = useSelector((state) => state.cart.items);
  const [show, setShow] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (cartItems.length > 0) {
      setShow(true);
      const timeout = setTimeout(() => setShow(false), 4000);
      return () => clearTimeout(timeout);
    }
  }, [cartItems.length]);

  if (!show) return null;

  return (
    <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50 w-[80%] px-4 sm:px-0 sm:w-auto">
      <div className="bg-green-600 text-white shadow-lg rounded-full flex items-center justify-around gap-3 py-2 px-5 sm:px-4 sm:py-2 sm:rounded-full sm:gap-2 sm:w-auto w-full max-w-md mx-auto animate-fade-in-up">
        <span className="text-sm font-medium  sm:inline"> Product added to cart</span>

        <button
          onClick={() => router.push("/cart")}
          aria-label="Go to Cart"
          className=" bg-white text-green-700 p-2 sm:p-2 rounded-full hover:bg-gray-100 transition"
        >
          <FaShoppingCart className="cursor-pointer text-base sm:text-lg" />
        </button>
      </div>
    </div>
  );
}
