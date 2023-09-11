import { rootApi } from './rootApi'

const authApi = rootApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: "/auth/v2/signin",
                method: "POST",
                body: credentials
            }),
        }),
    }),
    overrideExisting: false,
})

export const { useLoginMutation } = authApi