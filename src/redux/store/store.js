import { configureStore } from '@reduxjs/toolkit';
import { cartReducer } from './cardSlice';
import { adminReducer } from './adminSlice';

const store = configureStore({
  reducer: {
    cart: cartReducer,
    admin: adminReducer,
  },
});

export default store;
