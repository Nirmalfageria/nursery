"use client";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  updateCartQuantity,
  clearCart
} from "../../redux/store/cardSlice";
import { placeOrder } from "./cartApi";

export default function Cart() {
  const cartItems = useSelector((state) => state.cart.items);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity > 0) {
      dispatch(updateCartQuantity({ id, quantity: newQuantity }));
    }
  };

  const handlePlaceOrder = async () => {
    if (!street || !pincode || !city || !state) {
      alert("Please enter both address and pincode.");
      return;
    }

    setIsPlacingOrder(true);
    try {
      const result = await placeOrder(cartItems, { street,city,state, pincode }, router);
      console.log("Order placed:", result);
      alert("Order placed successfully!");
      dispatch(clearCart());
    } catch (error) {
      console.error(error);
      if (error.message === "Please login first") {
        router.push("/login");
      }
      alert(error.message);
    } finally {
      setIsPlacingOrder(false);
    }
  };

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
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6 rounded-lg">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow">
                <img
                  src={item.imageUrl}
                  alt={item.common_name || "Plant image"}
                  className="w-full h-40 object-fill rounded-lg"
                />
                <h3 className="font-semibold text-lg text-center">{item.name}</h3>
                <p className="text-center">Price: ₹{item.price}</p>
                <div className="flex items-center justify-center w-full">
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    className="px-2 py-1 bg-gray-300 rounded cursor-pointer flex items-center"
                  >
                    -
                  </button>
                  <span className="px-2">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="px-2 py-1 bg-gray-300 rounded cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => dispatch(removeFromCart(item.id))}
                  className="flex items-center justify-center w-full mt-1 text-red-600 hover:underline cursor-pointer text-center"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-between">
            <h3 className="text-lg font-semibold mr-4">Total: ₹{totalPrice}</h3>
            <button
              onClick={handlePlaceOrder}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer"
              disabled={isPlacingOrder}
            >
              {isPlacingOrder ? "Placing Order..." : "Place Order"}
            </button>
          </div>
          {/* Address Input Section */}
          <div className="mt-6 space-y-2 max-w-md">
            <input
              type="text"
              placeholder="Enter delivery address"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Enter city address"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Enter State address"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Enter pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

         
        </div>
      )}
    </div>
  );
}
