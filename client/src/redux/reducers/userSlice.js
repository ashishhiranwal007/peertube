import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  role: null,
  googleToken: ""
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.googleToken = action.payload.googleToken;
    },
    logout: (state) => {
      state.user = null;
      state.role = null;
      state.googleToken = "";
    },
    updateUserDetails:(state, action) => {
        state.user = {...action.payload}
    },
    updateUserRole: (state, action) => {
      state.role = action.payload;
    },
  },
});

export const { login, logout, updateUserRole } = userSlice.actions;
export default userSlice.reducer;
