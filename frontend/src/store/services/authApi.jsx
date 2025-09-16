import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout } from '../slices/authSlice.jsx';
import { getCookie } from '../../shared/utils/cookies.js';

const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const baseQuery = fetchBaseQuery({
  baseUrl,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState()?.auth?.token || getCookie('auth_token');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  if (result?.error && result.error.status === 401) {
    api.dispatch(logout());
  }
  return result;
};

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    loginAdmin: builder.mutation({
      query: ({ email, password }) => ({
        url: '/auth/login',
        method: 'POST',
        body: { email, password },
      }),
      transformResponse: (response) => {
        return {
          token: response.token,
          user: response.user || { email: response.email || 'Admin' }
        };
      },
    }),
    registerAdmin: builder.mutation({
      query: ({ email, password }) => ({
        url: '/auth/register',
        method: 'POST',
        body: { email, password },
      }),
      transformResponse: (response) => {
        return {
          message: response.message,
          user: response.user
        };
      },
    }),
    forgotPassword: builder.mutation({
      query: ({ email }) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: { email },
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ token, newPassword }) => ({
        url: `/auth/reset-password/${token}`,
        method: 'PUT',
        body: { newPassword },
      }),
    }),
    verifyEmail: builder.query({
      query: ({ token }) => ({
        url: `/auth/verify/${token}`,
        method: 'GET',
      }),
    }),
    checkAuth: builder.query({
      query: () => ({
        url: '/auth/check',
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useLoginAdminMutation,
  useRegisterAdminMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLazyVerifyEmailQuery,
  useCheckAuthQuery,
} = authApi;


