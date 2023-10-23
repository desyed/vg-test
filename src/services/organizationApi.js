import { rootApi } from './rootApi';

const organizationApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    searchOrganizationUsers: builder.query({
      query: (credentials) => ({
        url: '/organization/users',
        method: 'GET'
      })
    }),
    getVideoGiftExperiences: builder.query({
      query: (credentials) => ({
        url: '/organization/videogifts',
        method: 'GET'
      })
    })
  }),
  overrideExisting: false
});

export const {
  useSearchOrganizationUsersQuery,
  useGetVideoGiftExperiencesQuery
} = organizationApi;
