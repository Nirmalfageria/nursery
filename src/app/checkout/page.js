"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from 'next/navigation';
import { clearCart } from "../../redux/store/cardSlice";

export default function CheckoutPage() {
  const cartItems = useSelector((state) => state.cart.items);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const dispatch = useDispatch();
  const router = useRouter();

  // Check authentication using utils/session.js
  useEffect(() => {
    const checkAuthAndGetUser = async () => {
      try {
        const response = await fetch('/api/me', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          router.push('/login');
          return;
        }

        const data = await response.json();
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndGetUser();
  }, [router]);

  // Redirect if cart is empty
  useEffect(() => {
    if (!isLoading && cartItems.length === 0) {
      router.push("/cart");
    }
  }, [cartItems, isLoading, router]);

  const handlePlaceOrder = async () => {
    if (!street || !pincode || !city || !state) {
      alert("Please fill in all address fields.");
      return;
    }

    if (pincode.length !== 6 || !/^\d+$/.test(pincode)) {
      alert("Please enter a valid 6-digit pincode.");
      return;
    }

    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    setIsPlacingOrder(true);
    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          cartItems: cartItems, // Changed from 'items' to 'cartItems'
          address: { 
            street, 
            city, 
            state, 
            pincode 
          },
          paymentMethod: paymentMethod
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert("Order placed successfully!");
        dispatch(clearCart());
        router.push('/home');
      } else {
        if (result.message === 'Unauthorized') {
          router.push('/login');
        } else {
          alert(result.message || "Failed to place order");
        }
      }
    } catch (error) {
      console.error('Order placement error:', error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
    0
  );

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-15 text-black flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!user) {
    return null;
  }

  // Show empty cart message
  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-15 text-black text-center">
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty!</h2>
        <button
          onClick={() => router.push('/plants')}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-15 text-black">
      <h2 className="text-3xl font-semibold mb-6">Checkout</h2>

      {/* Order Summary with Card Design */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Order Summary</h3>
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {/* Cart Items as Cards */}
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center space-x-4">
                {/* Product Image */}
                <div className="flex-shrink-0">
                  <img
                    src={item.imageUrl}
                    alt={item.common_name || "Plant image"}
                    className="w-20 h-20 object-cover rounded-lg border-2 border-white shadow-sm"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-semibold text-gray-900 truncate">
                    {item.name}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {item.common_name && `Common name: ${item.common_name}`}
                  </p>
                  <div className="flex items-center mt-2 space-x-4">
                    <span className="text-sm text-gray-500">
                      Price: <span className="font-medium text-gray-700">₹{item.price}</span>
                    </span>
                    <span className="text-sm text-gray-500">
                      Qty: <span className="font-medium text-gray-700">{item.quantity}</span>
                    </span>
                  </div>
                </div>

                {/* Price Section */}
                <div className="text-right">
                  <p className="text-xl font-bold text-green-600">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    ₹{item.price} × {item.quantity}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total Section */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-left">
              <p className="text-sm text-gray-600">Subtotal ({cartItems.length} items)</p>
              <p className="text-xs text-gray-500 mt-1">Delivery charges may apply</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-900">₹{totalPrice.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Payment Method</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Cash on Delivery */}
          <div 
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
              paymentMethod === 'cod' 
                ? 'border-green-500 bg-green-50 shadow-md' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setPaymentMethod('cod')}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                paymentMethod === 'cod' ? 'border-green-500' : 'border-gray-300'
              }`}>
                {paymentMethod === 'cod' && (
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                )}
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Cash on Delivery</h4>
                <p className="text-sm text-gray-600">Pay when you receive your order</p>
              </div>
            </div>
          </div>

          {/* Credit/Debit Card */}
          <div 
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
              paymentMethod === 'card' 
                ? 'border-blue-500 bg-blue-50 shadow-md' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setPaymentMethod('card')}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                paymentMethod === 'card' ? 'border-blue-500' : 'border-gray-300'
              }`}>
                {paymentMethod === 'card' && (
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                )}
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Credit/Debit Card</h4>
                <p className="text-sm text-gray-600">Visa, Mastercard, RuPay</p>
              </div>
            </div>
          </div>

          {/* UPI */}
          <div 
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
              paymentMethod === 'upi' 
                ? 'border-purple-500 bg-purple-50 shadow-md' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setPaymentMethod('upi')}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                paymentMethod === 'upi' ? 'border-purple-500' : 'border-gray-300'
              }`}>
                {paymentMethod === 'upi' && (
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                )}
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">UPI Payment</h4>
                <p className="text-sm text-gray-600">PhonePe, Google Pay, Paytm</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Delivery Address Form */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Delivery Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Street Address - Full Width */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Street Address *
            </label>
            <input
              type="text"
              placeholder="Enter your complete street address"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
              required
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              City *
            </label>
            <input
              type="text"
              placeholder="Enter city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
              required
            />
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              State *
            </label>
            <input
              type="text"
              placeholder="Enter state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
              required
            />
          </div>

          {/* Pincode */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Pincode *
            </label>
            <input
              type="text"
              placeholder="6-digit pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              maxLength="6"
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
              required
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between">
          <button
            onClick={() => router.push("/cart")}
            className="px-8 py-4 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors duration-200 flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Cart
          </button>
          
          <button
            onClick={handlePlaceOrder}
            className="px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            disabled={isPlacingOrder || !street || !city || !state || !pincode || !paymentMethod}
          >
            {isPlacingOrder ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Placing Order...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                {paymentMethod === 'cod' ? 'Place Order (COD)' : 'Proceed to Payment'} - ₹{totalPrice.toFixed(2)}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
