// src/app/cart/cartApi.js
export const placeOrder = async (cartItems) => {
    const response = await fetch('/api/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cartItems }),
    });
   console.log(response)
    if (!response.ok) {
      throw new Error('Failed to place the order');
    }
  
    return await response.json(); // Return response after saving in the DB
  };
  