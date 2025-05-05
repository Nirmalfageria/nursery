// store.js
'use client'
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cardSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});
