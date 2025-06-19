"use client";

import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, updateCartQuantity } from "../../redux/store/cardSlice";
import { RiDeleteBin5Line } from "react-icons/ri";
import styles from "../plants/plants.module.css";

export default function Cart() {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity > 0) {
      dispatch(updateCartQuantity({ id, quantity: newQuantity }));
    }
  };

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    router.push("/checkout");
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
    0
  );

  return (
    <div className="min-h-screen pt-15 pb-24 bg-white">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-green-700 mb-8">🛒 Your Cart</h2>

        {cartItems.length === 0 ? (
          <p className="text-gray-600">Your cart is empty!</p>
        ) : (
          <>
            <div
              className={`grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 justify-items-center ${styles.plantGrid}`}
            >
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-xl shadow-md flex flex-col p-2 w-full"
                >
                  {/* Image */}
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-35 sm:h-40 object-fill rounded-lg"
                  />

                  {/* Name */}
                  <h3 className="text-lg font-semibold text-green-800 mt-1">{item.name}</h3>

                  {/* Price */}
                  <span className="text-green-700 font-bold text-md ">
                    ₹{item.price * item.quantity}
                  </span>

                  {/* Quantity controls */}
                  <div className="flex justify-center items-center gap-3 mt-1">
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                      className="cursor-pointer px-2  bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                    >
                      −
                    </button>
                    <span className="text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                      className="cursor-pointer px-2  bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => dispatch(removeFromCart(item._id))}
                    className="flex items-center justify-center gap-1 mt-1 text-sm text-red-500 hover:text-red-600"
                    title="Remove"
                  >
                    <RiDeleteBin5Line className="text-base" />
                    <span>Delete</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Total + Checkout */}
            <div className="mt-10 flex flex-col sm:flex-row justify-around items-center  sm:px-0">
              <h3 className="text-lg font-semibold text-gray-800  sm:mb-0">
                Total: ₹{totalPrice}
              </h3>
              <button
                onClick={handleProceedToCheckout}
                className="cursor-pointer px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
