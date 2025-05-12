// src/redux/store/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const existing = state.items.find(item => item._id === action.payload._id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },

    removeFromCart: (state, action) => {
      if (!window.confirm('Are you sure you want to remove this item from the cart?')) {
        return;
      }
      state.items = state.items.filter(item => item._id !== action.payload);
    },

    updateCartQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item._id === id);
      if (item && quantity > 0) {
        item.quantity = quantity;
      }
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateCartQuantity,
  clearCart
} = cartSlice.actions;

export const cartReducer = cartSlice.reducer;
