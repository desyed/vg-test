import { rootApi } from './rootApi';

export interface User {
  id?: string | number;
  organizationId: string;
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
      query: ({organizationId}) => ({
        url: `/organization/${organizationId}/users`,
        method: 'GET'
      })
    }),
    getOrgUserById: builder.query({
      providesTags: ['OrganizationsUsers'],
      query: ({ id, organizationId }) => ({
        url: `/organization/${organizationId}/users/${id}`,
        method: 'GET'
      })
    }),
    createOrgUser: builder.mutation({
      invalidatesTags: ['OrganizationsUsers'],
      query: ({ organizationId, ...body }: User) => ({
        url: `/organization/${organizationId}/users`,
        method: 'POST',
        body
      })
    }),
    updateOrgUser: builder.mutation({
      invalidatesTags: ['OrganizationsUsers'],
      query: ({ organizationId, ...body } : User) => ({
        url: `/organization/${organizationId}/users`,
        method: 'PATCH',
        body
      })
    }),
    getVideoGiftExperiences: builder.query({
      query: ({organizationId}) => ({
        url: `/organization/${organizationId}/videogifts`,
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
