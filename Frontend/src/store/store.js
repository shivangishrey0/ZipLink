import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice.js";

// Redux holds only who is logged in. Server data (links, analytics) lives in TanStack Query.
export const store = configureStore({
  reducer: { auth: authReducer },
});
