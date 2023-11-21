import Ionicons from '@expo/vector-icons/Ionicons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { LoaderView } from 'components/ui/LoaderView';
import { PrimaryButton } from 'components/ui/PrimaryButton';
import { StandardContainer } from 'components/ui/StandardContainer';
import { SectionTitle } from 'components/ui/Title';
import { ResizeMode, Video } from 'expo-av';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
// import * as ScreenOrientation from 'expo-screen-orientation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import DraggableFlatList, {
  ScaleDecorator
} from 'react-native-draggable-flatlist';
import { ScrollView } from 'react-native-gesture-handler';
import {
  ActionSheet,
  Image,
  Text,
  TouchableOpacity
} from 'react-native-ui-lib';
import {
  useGetSelectedMediaQuery,
  useMoveSelectedMediaOrderMutation
} from 'services/mediaApi';
import {
  useGeneratePreviewMutation,
  useGetVideoGiftByIdQuery
} from 'services/videoGiftApi';

import MusicTab from '../../../../components/backgroundMusic/music-tab';

import hairlineWidth = StyleSheet.hairlineWidth;

import Theme from '../../../../components/theme/theme';

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

const VideoPreview = ({ item, index, drag, isActive, setSelectedVideo }) => {
  const router = useRouter();

  return (
    <ScaleDecorator>
      <View style={{ height: PREVIEW_WIDTH + 50 }}>
        <TouchableOpacity
          // activeOpacity={1}
          onPress={() => {
            setSelectedVideo({ videoUri: item?.hlsUrl });
          }}
          onLongPress={drag}
          // disabled={isActive}
          style={[
            styles.rowItem,
            {
              opacity: isActive ? 0.5 : 1,
              padding: 5
              // backgroundColor: item.backgroundColor
            }
          ]}
        >
          <Image
            style={{
              objectFit: 'cover',
              width: PREVIEW_WIDTH,
              height: PREVIEW_WIDTH
            }}
            source={{
              uri: `${item?.media?.previewImageUrl}`
            }}
          />

          {/* <Text style={styles.text}>{item.id}</Text> */}
        </TouchableOpacity>
        <TouchableOpacity
          // activeOpacity={1}
          onPress={() => {
            router.push({
              pathname: '(drawer)/(tabs)/home/edit-caption',
              params: {
                selectedMediaId: item?.id,

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
          <Text style={{ fontSize: 14, textAlign: 'center' }}>
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
  const [data, setData] = useState([]);
  const videoPreviewFlatlist = useRef(null);
  const selectedVideoRef = useRef(null);
  const [selectedVideo, setSelectedVideo] = useState({});
  const windowWidth = Dimensions.get('window').width;
  const [triggerMoveSelectedMedia] = useMoveSelectedMediaOrderMutation();

  const {
    data: selectedMedia,
    isLoading: selectMediaIsLoading,
    refetch: refetchSelectedMedia
  } = useGetSelectedMediaQuery({
    videoGiftId: videoGiftData?.videoGift?.id
  });

  useEffect(() => {
    setData(selectedMedia);
  }, [selectedMedia]);
  return (
    <View style={{ flex: 1 }}>
      <StandardContainer style={{}}>
        <PrimaryButton
          label="Add Media"
          onPress={() => {
            console.info('videoGiftData ', videoGiftData);
            router.push({
              pathname: '(drawer)/(tabs)/home/recorder',
              params: { videoGiftId: videoGiftData?.videoGift?.id }
            });
          }}
        />
      </StandardContainer>
      <StandardContainer>
        <SectionTitle>{videoGiftData?.videoGift?.title}</SectionTitle>
      </StandardContainer>
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
            selectedMedia: data.map((item, index) => {
              return { id: item.id, order: index };
            })
          });
        }}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index, drag, isActive }) => {
          return (
            <VideoPreview
              item={item}
              index={index}
              drag={drag}
              isActive={isActive}
              setSelectedVideo={setSelectedVideo}
            />
          );
        }}
        renderPlaceholder={() => (
          <View style={{ flex: 1, backgroundColor: 'tomato' }} />
        )}
        // numColumns={3}
      />
      {selectedVideo?.videoUri ? (
        <Video
          ref={selectedVideoRef}
          style={{
            alignSelf: 'center',
            width: windowWidth,
            height: 200
          }}
          source={{
            uri: selectedVideo?.videoUri
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
      ) : null}
    </View>
  );
};

export default function VideoGiftDetailScreen() {
  const [showActionSheet, setShowActionSheet] = useState(false);
  const searchParams = useLocalSearchParams();
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const {
    data: videoGiftData,
    isLoading,
    refetch: refetchVideoGift
  } = useGetVideoGiftByIdQuery(searchParams?.videoGiftId, {
    refetchOnMountOrArgChange: true
  });

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
              title="Update count"
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
            height: windowHeight - 200,
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
              await generatePreview({ videoGiftId: searchParams?.videoGiftId });
              refetchVideoGift();
            }
          },
          {
            label: 'Mark Complete',
            onPress: () => this.pickOption('option 2')
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
