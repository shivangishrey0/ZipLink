import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { checkAuth } from "../../api/User.api.jsx";

// Asks the backend who the cookie belongs to. A 401 just means nobody is logged in.
export const fetchCurrentUser = createAsyncThunk("auth/fetchCurrentUser", async () => {
  try {
    return await checkAuth();
  } catch {
    return null;
  }
});

const authSlice = createSlice({
  name: "auth",
  // checked is false until the first answer arrives, so the app does not flash a logged-out page.
  initialState: { user: null, checked: false },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.checked = true;
    },
    clearUser(state) {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.checked = true;
    });
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
