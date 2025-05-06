// src/app/cart/cartApi.js
export const placeOrder = async (cartItems, router) => {
  const response = await fetch('/api/order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ cartItems }),
  });

  // Check if the response is not OK
  if (!response.ok) {
    const responseData = await response.json();

    // Check if the error is due to not being logged in (Unauthorized)
    if (responseData.message === 'Unauthorized') {
      throw new Error('Please login first');
    } else {
      throw new Error('Failed to place the order');
    }
  }

  return await response.json(); // Return response after saving in the DB
};
