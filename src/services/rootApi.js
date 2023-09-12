import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define a service using a base URL and expected endpoints
export const rootApi = createApi({
  reducerPath: 'videoGiftApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://50779eac1cc2.ngrok.app/api' }),
  prepareHeaders: (headers, { getState }) => {
    // By default, if we have a token in the store, let's use that for authenticated requests
    const token = getState().auth.token;
    if (token) {
      headers.set('authentication', `Bearer ${token}`);
    }
    return headers;
  },
  endpoints: () => ({})
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {} = rootApi;
