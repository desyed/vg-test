import { rootApi } from './rootApi';

export interface User {
  id?: string | number;
  image?: string;
  email?: string;
  name?: string;
  description?: string;
  role?: 'ADMIN' | 'USER';
  active?: boolean;
}

const organizationApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    searchOrganizationUsers: builder.query({
      providesTags: ['OrganizationsUsers'],
      query: (credentials) => ({
        url: '/organization/users',
        method: 'GET'
      })
    }),
    getOrgUserById: builder.query({
      providesTags: ['OrganizationsUsers'],
      query: (id) => ({
        url: `/organization/users/${id}`,
        method: 'GET'
      })
    }),
    createOrgUser: builder.mutation({
      invalidatesTags: ['OrganizationsUsers'],
      query: (body: User) => ({
        url: '/organization/users',
        method: 'POST',
        body
      })
    }),
    updateOrgUser: builder.mutation({
      invalidatesTags: ['OrganizationsUsers'],
      query: (body : User) => ({
        url: `/organization/users`,
        method: 'PATCH',
        body
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
  useGetVideoGiftExperiencesQuery,
  useCreateOrgUserMutation,
  useUpdateOrgUserMutation,
  useGetOrgUserByIdQuery
} = organizationApi;
