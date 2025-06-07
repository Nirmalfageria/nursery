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
    <div className="max-w-7xl mx-auto px-4 py-15 text-black">
      <h2 className="text-2xl font-semibold">Your Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty!</p>
      ) : (
        <div>
          <div className={`grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-6 rounded-lg justify-items-center ${styles.cartGrid}`}>
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow">
                <img
                  src={item.imageUrl}
                  alt={item.common_name || "Plant image"}
                  className="w-full h-35 object-fill rounded-lg"
                />
                <h3 className="font-semibold text-lg text-center">{item.name}</h3>
                <p className="text-center">Price: ₹{item.price}</p>
                <div className="flex items-center justify-center w-full">
                  <button
                    onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                    className="px-2 py-1 bg-gray-300 rounded cursor-pointer flex items-center"
                  >
                    -
                  </button>
                  <span className="px-2">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                    className="px-2 py-1 bg-gray-300 rounded cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => dispatch(removeFromCart(item._id))}
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
              onClick={handleProceedToCheckout}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
