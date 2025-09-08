import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from './services/authApi.jsx';
import { categoryApi } from './services/categoryApi.jsx';
import { portfolioApi } from './services/portfolioApi.jsx';
import { clientSpaceApi } from './services/clientSpaceApi.jsx';
import { contactApi } from './services/contactApi.jsx';
import authReducer from './slices/authSlice.jsx';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [portfolioApi.reducerPath]: portfolioApi.reducer,
    [clientSpaceApi.reducerPath]: clientSpaceApi.reducer,
    [contactApi.reducerPath]: contactApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, categoryApi.middleware, portfolioApi.middleware, clientSpaceApi.middleware, contactApi.middleware),
});

setupListeners(store.dispatch);

export default store;


