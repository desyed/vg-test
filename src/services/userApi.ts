import { rootApi } from './rootApi';

interface IUpdateProfile {
  name?: string;
  image?: string;
  image64?: string;
}
interface IUpdatePassword {
  originalPassword?: string;
  newPassword?: string;
}

const api = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query({
      providesTags: ['Me'],
      query: () => ({
        url: '/user/me',
        method: 'GET'
      })
    }),
    updateProfile: builder.mutation({
      query: (body: IUpdateProfile) => ({
        url: '/user/me',
        method: 'PATCH',
        body
      }),
      invalidatesTags: ['Me']
    }),
    updatePassword: builder.mutation({
      query: (params: IUpdatePassword) => ({
        url: '/user/password',
        method: 'PUT',
        body: params
      })
    })
  }),
  overrideExisting: false
});

export const {
  useGetMeQuery,
  useUpdateProfileMutation,
  useUpdatePasswordMutation
} = api;
