// src/redux/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import { cartReducer } from './cardSlice';

const store = configureStore({
  reducer: {
    cart: cartReducer, // <- Make sure this matches the key you use in useSelector
  },
});

export default store;
