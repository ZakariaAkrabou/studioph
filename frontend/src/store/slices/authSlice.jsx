import { createSlice } from '@reduxjs/toolkit';
import { getCookie, setCookie, deleteCookie } from '../../shared/utils/cookies.js';

const tokenFromCookie = getCookie('auth_token');
const userFromCookie = getCookie('auth_user');

const initialState = {
  token: tokenFromCookie || null,
  user: userFromCookie ? JSON.parse(decodeURIComponent(userFromCookie)) : null,
  isAuthenticated: !!tokenFromCookie,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, user } = action.payload;
      state.token = token || null;
      state.user = user || null;
      state.isAuthenticated = !!token;
      
      if (token) {
        setCookie('auth_token', token, 7); 
        if (user) {
          setCookie('auth_user', encodeURIComponent(JSON.stringify(user)), 7);
        }
      } else {
        deleteCookie('auth_token');
        deleteCookie('auth_user');
      }
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      deleteCookie('auth_token');
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


