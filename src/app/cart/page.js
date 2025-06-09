"use client";
import styles from "../plants/plants.module.css";
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  updateCartQuantity
} from "../../redux/store/cardSlice";

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
    <div className="min-h-screen px-6 pt-15 bg-white">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-green-700 mb-8">🛒 Your Cart</h2>

        {cartItems.length === 0 ? (
          <p className="text-gray-600">Your cart is empty!</p>
        ) : (
          <>
            <div
              className={`grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 rounded-lg justify-items-center ${styles.plantGrid}`}
            >
              {cartItems.map((item) => (
                <div key={item._id} className="bg-white rounded-lg shadow-md flex flex-col">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-42 h-35 sm:h-40 object-fill rounded-lg"
                  />

                  <h3 className="text-xl font-semibold text-green-800 mb-1">
                    {item.name}
                  </h3>

                  <p className="text-gray-600 text-sm">
                    Quantity: {item.quantity}
                  </p>

                  <span className="text-green-700 font-bold text-lg">
                    ₹{item.price * item.quantity}
                  </span>

                  <div className="flex items-center justify-center gap-2 mt-2">
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                      className="cursor-pointer px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                    >
                      −
                    </button>
                    <span className="text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                      className="cursor-pointer px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => dispatch(removeFromCart(item._id))}
                    className="cursor-pointer text-red-600 hover:underline mt-2 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 sm:mb-0">
                Total: ₹{totalPrice}
              </h3>
              <button
                onClick={handleProceedToCheckout}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
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
