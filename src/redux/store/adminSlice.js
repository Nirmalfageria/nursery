import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    isAdmin: false, // default is false
  },
  reducers: {
    setAdmin: (state, action) => {
      state.isAdmin = action.payload;
      // Optionally store in localStorage if in browser
      if (typeof window !== "undefined") {
        localStorage.setItem("isAdmin", action.payload ? "true" : "false");
      }
    },
  },
});

export const { setAdmin } = adminSlice.actions;
export const adminReducer = adminSlice.reducer;
