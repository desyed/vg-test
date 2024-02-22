import Ionicons from '@expo/vector-icons/Ionicons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { LoaderView } from 'components/ui/LoaderView';
import { PrimaryButton } from 'components/ui/PrimaryButton';
import { StandardContainer } from 'components/ui/StandardContainer';
import { SectionTitle } from 'components/ui/Title';
import { ResizeMode, Video } from 'expo-av';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
// import * as ScreenOrientation from 'expo-screen-orientation';
import * as _ from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import DraggableFlatList, {
  ScaleDecorator
} from 'react-native-draggable-flatlist';
import { ScrollView } from 'react-native-gesture-handler';
import {
  ActionSheet,
  Colors,
  Text,
  TouchableOpacity,
  Button
} from 'react-native-ui-lib';
import { useSelector } from 'react-redux';
import {
  useCreateBatchMediaMutation,
  useCreateMediaMutation,
  useGetSelectedMediaQuery,
  useMoveSelectedMediaOrderMutation,
  useSelectMediaMutation
} from 'services/mediaApi';
import {
  useGeneratePreviewMutation,
  useGetVideoGiftByIdQuery
} from 'services/videoGiftApi';

import ProgressiveImage from '../../../../components/ProgressiveImage';
import MusicTab from '../../../../components/backgroundMusic/music-tab';
import Theme from '../../../../components/theme/theme';
import { useGetSignedPutUrlMutation } from '../../../../services/awsApi';
import { createMediaUploadTask, pickImage } from '../../../../utils/uploadUtil';

const Tab = createMaterialTopTabNavigator();

const PREVIEW_WIDTH = 120;
// async function changeScreenOrientationLandscape() {
//   await ScreenOrientation.unlockAsync();
//   await ScreenOrientation.lockAsync(
//     ScreenOrientation.OrientationLock.LANDSCAPE_LEFT
//   );
// }
// async function changeScreenOrientationPortrait() {
//   await ScreenOrientation.unlockAsync();
//   await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT);
// }

const VideoPreview = ({ item, index, drag, isActive }) => {
  const router = useRouter();
  return (
    <ScaleDecorator>
      <View style={{ height: PREVIEW_WIDTH + 10 }}>
        <TouchableOpacity
          // activeOpacity={1}
          onPress={() => {
            router.push({
              pathname: '(drawer)/(tabs)/home/edit-caption',
              params: {
                selectedMediaId: item?.id,
                selectedMediaUrl: item?.hlsUrl,
                videoGiftId: item?.media?.videoGiftId
              }
            });
          }}
          onLongPress={drag}
          // disabled={isActive}
          style={[
            // styles.rowItem,
            {
              opacity: isActive ? 0.5 : 1,
              padding: 5
              // backgroundColor: item.backgroundColor
            }
          ]}
        >
          <ProgressiveImage
            thumbnailSource={require('../../../../../assets/loading.png')}
            source={{ uri: `${item?.media?.previewImageUrl}` }}
            style={{ width: PREVIEW_WIDTH, height: PREVIEW_WIDTH - 50 }}
            resizeMode="cover"
          />

          {/* <Text style={styles.text}>{item.id}</Text> */}
        </TouchableOpacity>
        <TouchableOpacity
          // activeOpacity={1}
          onPress={() => {}}
          onLongPress={drag}
          // disabled={isActive}
          style={[
            // styles.rowItem,
            {
              opacity: isActive ? 0.5 : 1
              // backgroundColor: item.backgroundColor
            }
          ]}
        >
          <Text
            style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'center' }}
          >
            {item.title || 'No title'}
          </Text>
          <Text style={{ fontSize: 12, textAlign: 'center' }}>
            {item.subTitle || ''}
          </Text>
        </TouchableOpacity>
      </View>
    </ScaleDecorator>
  );
};
const DetailScreen = ({ videoGiftData }) => {
  const router = useRouter();
  const organizationId = useSelector(
    (state) => state?.auth?.user?.selectedOrganizationId
  );
  // const [data, setData] = useState([]);
  const [imageLoading, setImageLoading] = useState(false);
  const videoPreviewFlatlist = useRef(null);
  const windowWidth = Dimensions.get('window').width;
  const [getSignedPutUrl] = useGetSignedPutUrlMutation();
  const [createMedia] = useCreateBatchMediaMutation();

  const [triggerMoveSelectedMedia] = useMoveSelectedMediaOrderMutation();

  const uploadImage = async () => {
    console.log('uploadImage');
    setImageLoading(true);
    const resizedImage = await pickImage();
    const task = await createMediaUploadTask({
      uri: resizedImage?.uri,
      getSignedPutUrl,
      acl: 'private',
      onProgress: (e) => {
        // setProgress({
        //     ...progress,
        //
        //     [currentMedia?.id]: {
        //         ...progress[currentMedia?.id],
        //         video: e.totalBytesSent / e.totalBytesExpectedToSend
        //     }
        // });
        // console.info('PROGRESS', progress);
      }
    });

    if (task) {
      await task.task.uploadAsync();
      console.log('task', task, data);
      const mediaType = task?.mimeType?.includes('image') ? 'IMAGE' : 'VIDEO';

      const mediaResponse = await createMedia({
        // previewImageUrl: taskPicture?.url,
        videoGiftId: videoGiftData?.videoGift?.id,
        // participantId: data?.participantId,
        organizationId,
        medias: [
          {
            type: mediaType,
            originalKey: task?.key,
            // previewImageUrl,
            // participantId: data?.participantId,
            videoType: 'SUPPLEMENTARY'
            // title: mediaFile?.title,
            // subTitle: mediaFile?.subTitle
          }
        ]
        // originalKey: task?.key,
        // type: 'VIDEO',
        // videoGiftId: videoGiftData?.videoGift?.id
      });
    }

    setImageLoading(false);
  };

  const {
    data,
    isLoading: selectMediaIsLoading,
    refetch: refetchSelectedMedia
  } = useGetSelectedMediaQuery({
    videoGiftId: videoGiftData?.videoGift?.id,
    organizationId
  }, { refetchOnMountOrArgChange: true });

  // useEffect(() => {
    console.log('selectedMedia', data, {
      videoGiftId: videoGiftData?.videoGift?.id,
      organizationId
    });
  //   setData(selectedMedia);
  // }, [selectedMedia]);

  return (
    <View style={{ flex: 1 }}>
      <StandardContainer
        style={{
          display: 'flex',
          gap: 5,
          flexDirection: 'row',
          justifyContent: 'center'
        }}
      >
        <PrimaryButton
          label="Create Media"
          onPress={() => {
            router.push({
              pathname: '/(drawer)/(tabs)/home/recorder',
              params: { videoGiftId: videoGiftData?.videoGift?.id }
            });
          }}
        />
        <Button
          label="Upload Media"
          backgroundColor={Colors.green20}
          onPress={uploadImage}
        />
      </StandardContainer>
      <StandardContainer>
        <SectionTitle>{videoGiftData?.videoGift?.title}</SectionTitle>
        {data && !_.isEmpty(data) && (
          <Text style={{ color: Colors.yellow5 }}>
            * Long press item to rearrange or click to edit
          </Text>
        )}
      </StandardContainer>
      <StandardContainer style={{ marginTop: 0 }}>
        <DraggableFlatList
          ref={videoPreviewFlatlist}
          data={data || []}
          horizontal
          initialNumToRender={4}
          autoscrollThreshold={100}
          onDragEnd={({ data }) => {
            setData(data);
            triggerMoveSelectedMedia({
              videoGiftId: videoGiftData?.videoGift?.id,
              organizationId,
              selectedMedia: data.map((item, index) => {
                return { id: item.id, order: index };
              })
            });
          }}
          keyExtractor={(item) => item.id}
          /* @ts-ignore */
          renderItem={({ item, index, drag, isActive }) => {
            console.info('item ', item);
            return (
              <VideoPreview
                item={item}
                index={index}
                drag={drag}
                isActive={isActive}
              />
            );
          }}
          renderPlaceholder={() => (
            <View style={{ flex: 1, backgroundColor: 'lightgray' }} />
          )}
          ListEmptyComponent={
            <View>
              {selectMediaIsLoading ? (
                <Text>Loading...</Text>
              ) : (
                <Text style={{ color: Colors.yellow5 }}>
                  <Ionicons size={18} name="information-circle-outline" />
                  No Media added! Please add Media.
                </Text>
              )}
            </View>
          }
          // numColumns={3}
        />
      </StandardContainer>
    </View>
  );
};

export default function VideoGiftDetailScreen() {
  const [showActionSheet, setShowActionSheet] = useState(false);
  const searchParams = useLocalSearchParams();
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const organizationId = useSelector(
    (state) => state?.auth?.user?.selectedOrganizationId
  );

  const {
    data: videoGiftData,
    isLoading,
    refetch: refetchVideoGift
  } = useGetVideoGiftByIdQuery(
    { videoGiftId: searchParams?.videoGiftId, organizationId },
    { refetchOnMountOrArgChange: true }
  );

  const [generatePreview] = useGeneratePreviewMutation();

  const MusicTabWithVideoGift = useCallback(
    () => <MusicTab videoGiftId={String(searchParams?.videoGiftId)} />,
    [searchParams?.videoGiftId]
  );

  const ThemeTabWithVideoGift = useCallback(
    () => <Theme videoGiftId={String(searchParams?.videoGiftId)} />,
    [searchParams?.videoGiftId]
  );

  const WithDataDetailScreen = useCallback(
    () => <DetailScreen videoGiftData={videoGiftData} />,
    [videoGiftData]
  );

  const url = videoGiftData?.videoGift?.completedHLSUrl;
  // console.info('url', url);
  return (
    <LoaderView isLoading={isLoading}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Video Gift',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                setShowActionSheet(true);
              }}
            >
              <View style={{ padding: 10 }}>
                <Ionicons
                  name="ellipsis-horizontal-outline"
                  size={24}
                  color="black"
                />
              </View>
            </TouchableOpacity>
          )
        }}
      />
      <ScrollView>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-start',
            alignItems: 'stretch',
            height: windowHeight - 175,
            width: '100%'
          }}
        >
          {(videoGiftData?.videoGift?.previewStatus === 'COMPLETED' &&
            videoGiftData?.videoGift?.signedPreviewUrl?.url) ||
          (videoGiftData?.videoGift?.completedVideoStatus === 'COMPLETED' &&
            videoGiftData?.videoGift?.completedHLSUrl) ? (
            <Video
              // ref={video}
              style={{
                alignSelf: 'center',
                width: windowWidth,
                height: 200
              }}
              source={{
                uri: url || videoGiftData?.videoGift?.completedHLSUrl
              }}
              // shouldPlay
              useNativeControls
              resizeMode={ResizeMode.COVER}
              onFullscreenUpdate={async (VideoFullscreenUpdateEvent) => {
                if (VideoFullscreenUpdateEvent.fullscreenUpdate === 1) {
                  // await changeScreenOrientationLandscape();
                } else {
                  // await changeScreenOrientationPortrait();
                }
              }}
              // onPlaybackStatusUpdate={(status) => setStatus(() => status)}
            />
          ) : (
            <View
              style={{
                width: windowWidth,
                height: 200,
                backgroundColor: 'black',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Text
                style={{
                  color: 'white',
                  fontSize: 20
                }}
              >
                No Preview Available {videoGiftData?.videoGift?.previewStatus}
              </Text>
            </View>
          )}

          <Tab.Navigator
            screenOptions={{ swipeEnabled: false }}
            initialLayout={{
              width: Dimensions.get('window').width
            }}
          >
            <Tab.Screen name="Media" component={WithDataDetailScreen} />
            <Tab.Screen name="Music" component={MusicTabWithVideoGift} />
            <Tab.Screen name="Theme" component={ThemeTabWithVideoGift} />
          </Tab.Navigator>
        </View>
      </ScrollView>
      <ActionSheet
        title="Video Gift Actions"
        message="What would you like to do?"
        cancelButtonIndex={2}
        destructiveButtonIndex={2}
        // useNativeIOS
        useSafeArea
        migrateDialog
        options={[
          {
            label: 'Generate Preview',
            onPress: async () => {
              await generatePreview({ videoGiftId: searchParams?.videoGiftId, organizationId });
              refetchVideoGift();
            }
          },
          {
            label: 'Mark Complete',
            onPress: () => console.log('mark complete clicked')
          },
          {
            label: 'Cancel',
            onPress: () => setShowActionSheet(false)
          }
        ]}
        visible={showActionSheet}
        onDismiss={() => setShowActionSheet(false)}
      />
    </LoaderView>
  );
}

const styles = StyleSheet.create({
  rowItem: {
    height: PREVIEW_WIDTH,
    width: PREVIEW_WIDTH,
    marginRight: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});
