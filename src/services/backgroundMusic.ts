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
      query: (catId?: string) => ({
        url: `/backgroundMusic?backgroundMusicCategoryId=${catId || ''}`,
        method: 'GET'
      })
    }),
    selectBgMusic: builder.mutation({
      query: (body: { videoGiftId: string; backgroundMusicId: string }) => ({
        url: `/videogift/backgroundMusic`,
        method: 'POST',
        body
      })
    }),
    selectedBackgroundMusic: builder.query({
      query: (videoGiftId: string) => ({
        url: `/videogift/backgroundMusic?videoGiftId=${videoGiftId}`,
        method: 'GET'
      }),
      providesTags: ['backgroundMusic']
    }),
    removeSelectedBackgroundMusic: builder.mutation({
      query: ({ videoGiftId, bgMusicId }) => ({
        url: `/videogift/backgroundMusic?videoGiftId=${videoGiftId}&videoGiftBackgroundMusicId=${bgMusicId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['backgroundMusic']
    }),

  }),
  overrideExisting: false
});

export const {
  useRemoveSelectedBackgroundMusicMutation,
  useSelectBgMusicMutation,
  useSelectedBackgroundMusicQuery,
  useGetAllBgMusicQuery,
  useGetBgMusicCategoriesQuery
} = videoGiftApi;
