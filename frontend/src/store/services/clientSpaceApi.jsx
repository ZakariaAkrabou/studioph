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

export const clientSpaceApi = createApi({
  reducerPath: 'clientSpaceApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['ClientSpace'],
  endpoints: (builder) => ({
    getPublicSpaces: builder.query({
      query: () => ({ url: '/client-space/public', method: 'GET' }),
      transformResponse: (response) => response?.spaces || [],
      providesTags: [{ type: 'ClientSpace', id: 'PUBLIC' }],
    }),
    getSpaces: builder.query({
      query: () => ({ url: '/client-space/all-space', method: 'GET' }),
      transformResponse: (response) => response?.spaces || [],
      providesTags: (result) =>
        result && Array.isArray(result)
          ? [
              ...result.map((s) => ({ type: 'ClientSpace', id: s._id })),
              { type: 'ClientSpace', id: 'LIST' },
            ]
          : [{ type: 'ClientSpace', id: 'LIST' }],
    }),
    createSpace: builder.mutation({
      query: ({ name, key }) => ({
        url: '/client-space/create',
        method: 'POST',
        body: { name, key },
      }),
      transformResponse: (response) => response?.space,
      invalidatesTags: [{ type: 'ClientSpace', id: 'LIST' }],
    }),
    uploadImages: builder.mutation({
      query: ({ id, files }) => {
        const form = new FormData();
        files.forEach((file) => form.append('images', file));
        return {
          url: `/client-space/upload/${id}/images`,
          method: 'POST',
          body: form,
        };
      },
      invalidatesTags: (_r, _e, { id }) => [{ type: 'ClientSpace', id }, { type: 'ClientSpace', id: 'LIST' }],
    }),
    updateSpace: builder.mutation({
      query: ({ id, name, key }) => {
        const body = { };
        if (typeof name === 'string') body.name = name;
        if (key && key.trim().length > 0) body.key = key;
        return {
          url: `/client-space/update/${id}`,
          method: 'PUT',
          body,
        };
      },
      invalidatesTags: (_r, _e, { id }) => [{ type: 'ClientSpace', id }, { type: 'ClientSpace', id: 'LIST' }],
    }),
    deleteImage: builder.mutation({
      query: ({ id, index }) => ({
        url: `/client-space/${id}/image?index=${index}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'ClientSpace', id }, { type: 'ClientSpace', id: 'LIST' }],
    }),
    replaceImage: builder.mutation({
      query: ({ id, index, file }) => {
        const form = new FormData();
        form.append('image', file);
        return {
          url: `/client-space/${id}/image/${index}`,
          method: 'PUT',
          body: form,
        };
      },
      invalidatesTags: (_r, _e, { id }) => [{ type: 'ClientSpace', id }, { type: 'ClientSpace', id: 'LIST' }],
    }),
    accessSpace: builder.mutation({
      query: ({ id, key }) => ({
        url: `/client-space/${id}/access`,
        method: 'POST',
        body: { key },
      }),
      transformResponse: (response) => response,
    }),
    deleteSpace: builder.mutation({
      query: (id) => ({ url: `/client-space/delete/${id}`, method: 'DELETE' }),
      invalidatesTags: (_r, _e, id) => [{ type: 'ClientSpace', id }, { type: 'ClientSpace', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetPublicSpacesQuery,
  useGetSpacesQuery,
  useCreateSpaceMutation,
  useUploadImagesMutation,
  useUpdateSpaceMutation,
  useDeleteImageMutation,
  useReplaceImageMutation,
  useAccessSpaceMutation,
  useDeleteSpaceMutation,
} = clientSpaceApi;
