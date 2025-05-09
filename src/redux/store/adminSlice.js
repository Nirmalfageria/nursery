import { createSlice } from '@reduxjs/toolkit';

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    isAdmin: false,
  },
  reducers: {
    setAdmin: (state, action) => {
      state.isAdmin = action.payload;
    },
  },
});

export const { setAdmin } = adminSlice.actions;
export const adminReducer = adminSlice.reducer;
