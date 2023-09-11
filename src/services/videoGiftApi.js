import { rootApi } from './rootApi'

const videoGiftApi = rootApi.injectEndpoints({
    endpoints: (builder) => ({
        getVideoGift: builder.query({
            query: (credentials) => ({
                url: "/videogift",
                method: "GET",
                body: credentials
            }),
        }),
    }),
    overrideExisting: false,
})

export const { useGetVideoGiftQuery } = videoGiftApi