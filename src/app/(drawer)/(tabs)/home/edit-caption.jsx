import { LoaderView } from 'components/ui/LoaderView';
import { PrimaryButton } from 'components/ui/PrimaryButton';
import { StandardContainer } from 'components/ui/StandardContainer';
import { SectionTitle } from 'components/ui/Title';
import { TextInput } from 'components/ui/form/TextInput';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ScrollView } from 'react-native';
import { View } from 'react-native-ui-lib';
import {
  useGetSelectedMediaByIdQuery,
  useGetSelectedMediaQuery,
  usePatchSelectedMediaMutation
} from 'services/mediaApi';

export default function EditCaptionScreen() {
  const searchParams = useLocalSearchParams();

  const router = useRouter();
  const { data: selectedMedia, isLoading } = useGetSelectedMediaByIdQuery({
    selectedMediaId: searchParams.selectedMediaId
  });
  const [patchSelectedMedia, { isLoading: isSaving }] =
    usePatchSelectedMediaMutation();
  const { isLoading: selectMediaIsLoading, refetch: refetchSelectedMedia } =
    useGetSelectedMediaQuery({
      videoGiftId: searchParams?.videoGiftId
    });

  const {
    control,
    handleSubmit,
    setValue,
    formState: {}
  } = useForm({
    defaultValues: {
      title: selectedMedia?.title,
      subTitle: selectedMedia?.subTitle
    }
  });
  // State

  const onSubmit = async (data) => {
    try {
      const result = await patchSelectedMedia({
        ...data,
        selectedMediaId: searchParams.selectedMediaId
      });

      if (result.data) {
        refetchSelectedMedia();
        router.back();
        // alert(JSON.stringify(result.data));
      }
    } catch (e) {
      console.info('e', e);
      // alert(e);
    }
  };

  useEffect(() => {
    setValue('title', selectedMedia?.title);
    setValue('subTitle', selectedMedia?.subTitle);
  }, [selectedMedia]);

  return (
    <LoaderView isLoading={isLoading || isSaving}>
      <View flex bg-bgColor>
        <ScrollView
          contentInsetAdjustmentBehavior="always"
          style={{ position: 'relative' }}
        >
          <View>
            <StandardContainer style={{}}>
              <SectionTitle>Edit Video</SectionTitle>
            </StandardContainer>

            <StandardContainer>
              <TextInput
                control={control}
                rules={{}}
                name="title"
                label="Title or Name"
                placeholder="John Doe"
                textInputProps={{
                  autoCorrect: false
                }}
              />

              <TextInput
                control={control}
                label="Sub Title"
                name="subTitle"
                rules={{}}
                placeholder="Father"
              />
            </StandardContainer>
            <StandardContainer>
              <PrimaryButton onPress={handleSubmit(onSubmit)} label="Save" />
            </StandardContainer>
          </View>
        </ScrollView>
      </View>
    </LoaderView>
  );
}
