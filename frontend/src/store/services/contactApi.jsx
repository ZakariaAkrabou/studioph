import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const contactApi = createApi({
  reducerPath: 'contactApi',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    submitContact: builder.mutation({
      query: ({ name, email, service, preferredDate, message }) => ({
        url: '/contact',
        method: 'POST',
        body: { name, email, service, preferredDate, message },
      }),
    }),
  }),
});

export const { useSubmitContactMutation } = contactApi;
