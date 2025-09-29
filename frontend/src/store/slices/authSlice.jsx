import { createSlice } from '@reduxjs/toolkit';
import { getCookie, setCookie, deleteCookie } from '../../shared/utils/cookies.js';

const tokenFromCookie = null; // token now stored HttpOnly, not readable in JS
const userFromCookie = getCookie('auth_user');

const initialState = {
  token: tokenFromCookie || null,
  user: userFromCookie ? JSON.parse(decodeURIComponent(userFromCookie)) : null,
  // After moving to HttpOnly tokens, treat presence of user cookie as logged-in on refresh
  isAuthenticated: !!(userFromCookie),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, user } = action.payload;
      state.token = token || null;
      state.user = user || null;
      // With HttpOnly cookies, presence of user implies authenticated
      state.isAuthenticated = !!user || !!token;
      
      // Store only non-sensitive user data in a readable cookie
      if (user) {
        setCookie('auth_user', encodeURIComponent(JSON.stringify(user)), 7);
      } else {
        deleteCookie('auth_user');
      }
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      deleteCookie('auth_user');
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      if (state.user) {
        setCookie('auth_user', encodeURIComponent(JSON.stringify(state.user)), 7);
      }
    },
  },
});

export const { setCredentials, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;


