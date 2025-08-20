import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState, endpoint, type }) => {
      const token = getState()?.auth?.token;
      if (token) headers.set('authorization', `Bearer ${token}`);
      // Do not set JSON content-type here; we send FormData for create/update
      return headers;
    },
  }),
  tagTypes: ['Category'],
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => ({ url: '/category/all', method: 'GET' }),
      transformResponse: (res) => res?.data || [],
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Category', id: _id })),
              { type: 'Category', id: 'LIST' },
            ]
          : [{ type: 'Category', id: 'LIST' }],
    }),
    createCategory: builder.mutation({
      query: ({ name, description, image }) => {
        const form = new FormData();
        form.append('name', name);
        if (description) form.append('description', description);
        // Backend upload middleware requires a file
        if (image) form.append('image', image);
        return {
          url: '/category/create',
          method: 'POST',
          body: form,
        };
      },
      invalidatesTags: [{ type: 'Category', id: 'LIST' }],
    }),
    updateCategory: builder.mutation({
      query: ({ id, name, description, image }) => {
        const form = new FormData();
        if (name) form.append('name', name);
        if (description) form.append('description', description);
        if (image) form.append('image', image);
        return {
          url: `/category/update/${id}`,
          method: 'PUT',
          body: form,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'Category', id },
        { type: 'Category', id: 'LIST' },
      ],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({ url: `/category/delete/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [
        { type: 'Category', id },
        { type: 'Category', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;


