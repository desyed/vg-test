import { LoaderView } from 'components/ui/LoaderView';
import { PrimaryButton } from 'components/ui/PrimaryButton';
import { StandardContainer } from 'components/ui/StandardContainer';
import { SectionTitle } from 'components/ui/Title';
import { TextInput } from 'components/ui/form/TextInput';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useEffect, useRef } from "react";
import { useForm } from 'react-hook-form';
import { Dimensions, ScrollView } from "react-native";
import { View } from 'react-native-ui-lib';
import {
  useGetSelectedMediaByIdQuery,
  useGetSelectedMediaQuery,
  usePatchSelectedMediaMutation
} from 'services/mediaApi';
import { ResizeMode, Video } from "expo-av";
import { useSelector } from "react-redux";

export default function EditCaptionScreen() {
  const organizationId = useSelector(
    (state) => state?.auth?.user?.selectedOrganizationId
  );
  const searchParams = useLocalSearchParams();
  const selectedVideoRef = useRef(null);
  const windowWidth = Dimensions.get('window').width;

  const router = useRouter();

  const { data: selectedMedia, isLoading } = useGetSelectedMediaByIdQuery({
    selectedMediaId: searchParams.selectedMediaId,
    organizationId
  });
  const [patchSelectedMedia, { isLoading: isSaving }] =
    usePatchSelectedMediaMutation();
  const { isLoading: selectMediaIsLoading, refetch: refetchSelectedMedia } =
    useGetSelectedMediaQuery({
      videoGiftId: searchParams?.videoGiftId,
      organizationId
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
        selectedMediaId: searchParams.selectedMediaId,
        organizationId
      });

      if (result?.data) {
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
        <Stack.Screen
          options={{
            headerShown: true,
            title: ''}}
        />
        <ScrollView
          contentInsetAdjustmentBehavior="always"
          style={{ position: 'relative' }}
        >
          <View>
            <StandardContainer style={{}}>
              <SectionTitle>Edit Video</SectionTitle>
            </StandardContainer>

              <View style={{minHeight: 200, backgroundColor: 'lightgray'}}>
                <Video
                  ref={selectedVideoRef}
                  style={{
                    alignSelf: 'center',
                    width: windowWidth,
                    height: 200
                  }}
                  source={{
                    uri: String(searchParams?.selectedMediaUrl)
                  }}
                  onLoad={() => {
                    selectedVideoRef.current?.playAsync();
                  }}
                  // shouldPlay
                  useNativeControls
                  resizeMode={ResizeMode.CONTAIN}
                  onFullscreenUpdate={async (VideoFullscreenUpdateEvent) => {
                    if (VideoFullscreenUpdateEvent.fullscreenUpdate === 1) {
                      // await changeScreenOrientationLandscape();
                    } else {
                      // await changeScreenOrientationPortrait();
                    }
                  }}
                  // onPlaybackStatusUpdate={(status) => setStatus(() => status)}
                />
              </View>

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
