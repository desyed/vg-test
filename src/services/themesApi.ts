import { rootApi } from './rootApi';

interface Theme {
  id?: string;
  title: string;
  organizationId?: string;
  themeCategoryId: string;
  previewImageUrl: string;
  isCompanyTheme: boolean;
}
interface ImageBody {
  id: string;
  organizationId?: string;
  imageUrl: string;
  imageThumbUrl: string;
}
interface UpdateImage {
  id: string;
  organizationId?: string;
  themeId: string;
  order: string;
}

const videoGiftApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getThemeCategories: builder.query({
      query: ({ organizationId }) => ({
        url: `/organization/${organizationId}/themes/categories?getAll=true`,
        method: 'GET'
      })
    }),
    createTheme: builder.mutation({
      invalidatesTags: ['theme'],
      query: ({ organizationId, ...body }: Theme) => ({
        url: `/organization/${organizationId}/themes/create`,
        method: 'POST',
        body
      })
    }),
    updateTheme: builder.mutation({
      invalidatesTags: ['theme'],
      query: ({ id, organizationId, ...body }: Theme) => ({
        url: `/organization/${organizationId}/themes/${id}`,
        method: 'PUT',
        body
      })
    }),
    deleteTheme: builder.mutation({
      invalidatesTags: ['theme'],
      query: ({ id, organizationId }) => ({
        url: `/organization/${organizationId}/themes/${id}`,
        method: 'DELETE'
      })
    }),
    getAllThemes: builder.query({
      providesTags: ['theme'],
      query: ({ catId, organizationId}: any) => ({
        url: `/organization/${organizationId}/themes?themeCategoryId=${catId || ''}`,
        method: 'GET'
      })
    }),
    createThemeImage: builder.mutation({
      invalidatesTags: ['theme'],
      query: (payload: ImageBody) => ({
        url: `/organization/${payload?.organizationId}/themes/${payload.id}/images/create`,
        method: 'POST',
        body: payload
      })
    }),
    updateThemeImage: builder.mutation({
      invalidatesTags: ['theme'],
      query: (payload: UpdateImage) => ({
        url: `/organization/${payload?.organizationId}/themes/${payload.themeId}/images/${payload.id}`,
        method: 'POST',
        body: payload
      })
    })
  }),
  overrideExisting: false
});

export const {
  useGetAllThemesQuery,
  useGetThemeCategoriesQuery,
  useLazyGetAllThemesQuery
} = videoGiftApi;
