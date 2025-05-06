"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  updateCartQuantity,
} from "../../redux/store/cardSlice";
import { placeOrder } from "./cartApi";
export default function Cart() {
  const cartItems = useSelector((state) => state.cart.items); // Access the cart items from Redux store
  const [isPlacingOrder, setIsPlacingOrder] = useState(false); // Handle order placing state
  const dispatch = useDispatch();

  // Handle quantity change (increment/decrement)
  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity > 0) {
      dispatch(updateCartQuantity({ id, quantity: newQuantity })); // ✅ FIXED: pass object
    }
  };

  // Handle placing the order (send cart data to backend)
  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    try {
      const result = await placeOrder(cartItems); // ✅ Call directly
      console.log("Order placed:", result);
      alert("Order placed successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to place the order.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Calculate the total price of all cart items
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-black">
      <h2 className="text-2xl font-semibold">Your Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty!</p>
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-lg shadow">
                {item.default_image?.medium_url ? (
                  <img
                    src={item.default_image.medium_url}
                    alt={item.common_name || "Plant image"}
                    className="w-full h-40 object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500 rounded">
                    No Image
                  </div>
                )}
                <h3 className="font-semibold text-lg">{item.common_name}</h3>
                <p>Price: ₹{item.price}</p>
                <div className="flex items-center hover: cursor-pointer">
                  <button
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity - 1)
                    }
                    className="px-2 py-1 bg-gray-300 rounded  cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-2">{item.quantity}</span>
                  <button
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity + 1)
                    }
                    className="px-2 py-1 bg-gray-300 rounded  cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => dispatch(removeFromCart(item.id))}
                  className="mt-2 text-red-600 hover:underline cursor-pointer "
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between items-center  ">
            <h3 className="text-lg font-semibold">Total: ₹{totalPrice}</h3>
            <button
              onClick={handlePlaceOrder}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700  cursor-pointer"
              disabled={isPlacingOrder}
            >
              {isPlacingOrder ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
