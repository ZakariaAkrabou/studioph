import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout } from '../slices/authSlice.jsx';

const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const baseQuery = fetchBaseQuery({
  baseUrl,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState()?.auth?.token;
    if (token) headers.set('authorization', `Bearer ${token}`);
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

export const portfolioApi = createApi({
  reducerPath: 'portfolioApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Portfolio'],
  endpoints: (builder) => ({
    getPortfolios: builder.query({
      query: () => ({ url: '/portfolio/all', method: 'GET' }),
      providesTags: (result) =>
        result && Array.isArray(result)
          ? [
              ...result.map((p) => ({ type: 'Portfolio', id: p._id })),
              { type: 'Portfolio', id: 'LIST' },
            ]
          : [{ type: 'Portfolio', id: 'LIST' }],
      transformResponse: (response) => {
        const data = response?.data || [];
        return data.map((it) => ({
          ...it,
          categoryLabel: typeof it.category === 'string' ? it.category : (it.category?.name || ''),
        }));
      },
    }),
    createPortfolio: builder.mutation({
      query: ({ title, description, category, image }) => {
        const formData = new FormData();
        formData.append('title', title);
        if (description) formData.append('description', description);
        formData.append('category', category);
        if (image) formData.append('image', image);
        return {
          url: '/portfolio/create',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: [{ type: 'Portfolio', id: 'LIST' }],
    }),
    updatePortfolio: builder.mutation({
      query: ({ id, title, description, category, image }) => {
        const formData = new FormData();
        if (title) formData.append('title', title);
        if (description) formData.append('description', description);
        if (category) formData.append('category', category);
        if (image) formData.append('image', image);
        return {
          url: `/portfolio/update/${id}`,
          method: 'PUT',
          body: formData,
        };
      },
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Portfolio', id }, { type: 'Portfolio', id: 'LIST' }],
    }),
    deletePortfolio: builder.mutation({
      query: (id) => ({ url: `/portfolio/delete/${id}`, method: 'DELETE' }),
      invalidatesTags: (_r, _e, id) => [{ type: 'Portfolio', id }, { type: 'Portfolio', id: 'LIST' }],
    }),
    getPortfolioById: builder.query({
      query: (id) => ({ url: `/portfolio/image/${id}`, method: 'GET' }),
    }),
  }),
});

export const {
  useGetPortfoliosQuery,
  useCreatePortfolioMutation,
  useUpdatePortfolioMutation,
  useDeletePortfolioMutation,
  useGetPortfolioByIdQuery,
} = portfolioApi;
