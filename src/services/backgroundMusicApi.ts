import { rootApi } from './rootApi';

const videoGiftApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({

    getBgMusicCategories: builder.query({
      query: () => ({
        url: `/backgroundMusic/categories`,
        method: 'GET'
      })
    }),
    getAllBgMusic: builder.query({
      providesTags: ['backgroundMusic'],
      query: ({ catId, page }:{catId?: string, page?: number}) => ({
        url: `/backgroundMusic?backgroundMusicCategoryId=${catId || ''}&page=${ page || 1 }`,
        method: 'GET'
      })
    }),
    selectBgMusic: builder.mutation({
      invalidatesTags: ['backgroundMusic'],
      query: ({
        organizationId,
        ...body
      }: {
        videoGiftId: string;
        backgroundMusicId: string;
        organizationId: string;
      }) => ({
        url: `/organization/${organizationId}/videogift/backgroundMusic`,
        method: 'POST',
        body
      })
    }),
    selectedBackgroundMusic: builder.query({
      query: (payload: { videoGiftId: string; organizationId: string }) => ({
        url: `/organization/${payload.organizationId}/videogift/backgroundMusic?videoGiftId=${payload.videoGiftId}`,
        method: 'GET'
      }),
      providesTags: ['backgroundMusic']
    }),
    removeSelectedBackgroundMusic: builder.mutation({
      query: ({ videoGiftId, bgMusicId, organizationId }) => ({
        url: `/organization/${organizationId}/videogift/backgroundMusic?videoGiftId=${videoGiftId}&videoGiftBackgroundMusicId=${bgMusicId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['backgroundMusic']
    })
  }),
  overrideExisting: false
});

export const {
  useRemoveSelectedBackgroundMusicMutation,
  useSelectBgMusicMutation,
  useSelectedBackgroundMusicQuery,
  useGetAllBgMusicQuery,
  useLazyGetAllBgMusicQuery,
  useGetBgMusicCategoriesQuery
} = videoGiftApi;
