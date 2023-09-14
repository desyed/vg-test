import { rootApi } from './rootApi';

const organizationApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    searchOrganizationUsers: builder.query({
      query: (credentials) => ({
        url: '/organization/users',
        method: 'GET'
      })
    })
  }),
  overrideExisting: false
});

export const { useSearchOrganizationUsersQuery } = organizationApi;
