import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("token") || null,
  userInfo: JSON.parse(localStorage.getItem("user")) || null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.token = action.payload.token;
      state.userInfo = action.payload.user;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    clearUser(state) {
      state.token = null;
      state.userInfo = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});


export const { setUser, clearUser } = userSlice.actions;


export default userSlice.reducer;
