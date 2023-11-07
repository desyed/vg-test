import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
console.info(
  '1) process.env.EXPO_PUBLIC_API_URL ',
  process.env.EXPO_PUBLIC_API_URL
);
// Define a service using a base URL and expected endpoints
export const rootApi = createApi({
  reducerPath: 'videoGiftApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.EXPO_PUBLIC_API_URL }),
  prepareHeaders: (headers, { getState }) => {
    // By default, if we have a token in the store, let's use that for authenticated requests
    const token = getState().auth.token;
    if (token) {
      headers.set('authentication', `Bearer ${token}`);
    }
    console.info(
      ' process.env.EXPO_PUBLIC_API_URL ',
      process.env.EXPO_PUBLIC_API_URL
    );
    return headers;
  },
  tagTypes: ['Customers', 'VideoGifts', 'SelectedMedia'],

  endpoints: () => ({})
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {} = rootApi;
