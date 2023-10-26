import Ionicons from '@expo/vector-icons/Ionicons';
import { LoaderView } from 'components/ui/LoaderView';
import { PrimaryButton } from 'components/ui/PrimaryButton';
import { StandardContainer } from 'components/ui/StandardContainer';
import { SectionTitle } from 'components/ui/Title';
import { ResizeMode, Video } from 'expo-av';
import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter
} from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import DraggableFlatList, {
  ScaleDecorator
} from 'react-native-draggable-flatlist';
import { ScrollView } from 'react-native-gesture-handler';
import { ActionSheet, Text, TouchableOpacity } from 'react-native-ui-lib';
import { useGetSelectedMediaQuery } from 'services/mediaApi';
import {
  useGeneratePreviewMutation,
  useGetVideoGiftByIdQuery
} from 'services/videoGiftApi';
const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

const PREVIEW_WIDTH = 120;
const VideoPreview = ({ item, index, drag, isActive }) => {
  const video = useRef(null);
  const router = useRouter();

  return (
    <ScaleDecorator>
      <View style={{ height: PREVIEW_WIDTH + 50 }}>
        <TouchableOpacity
          // activeOpacity={1}
          onPress={() => {
            video.current.presentFullscreenPlayer();
            video.current.playAsync();
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
          <Video
            ref={video}
            style={{
              alignSelf: 'center',
              width: PREVIEW_WIDTH,
              height: PREVIEW_WIDTH
            }}
            onError={(e) => {
              console.info('error', e);
            }}
            source={{
              uri: item?.hlsUrl
            }}
            posterSource={{
              uri: item?.media?.previewImageUrl
            }}
            posterStyle={{
              objectFit: 'cover',
              width: PREVIEW_WIDTH,
              height: PREVIEW_WIDTH
            }}
            usePoster
            // shouldPlay
            // useNativeControls
            resizeMode={ResizeMode.COVER}
            // onPlaybackStatusUpdate={(status) => setStatus(() => status)}
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

export default function VideoGiftDetailScreen() {
  const [data, setData] = useState([]);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const searchParams = useLocalSearchParams();
  const windowWidth = Dimensions.get('window').width;
  const videoPreviewFlatlist = useRef(null);
  const router = useRouter();
  const {
    data: videoGiftData,
    isLoading,
    refetch: refetchVideoGift
  } = useGetVideoGiftByIdQuery({
    videoGiftId: searchParams?.videoGiftId
  });

  const [generatePreview] = useGeneratePreviewMutation();
  const {
    data: selectedMedia,
    isLoading: selectMediaIsLoading,
    refetch: refetchSelectedMedia
  } = useGetSelectedMediaQuery({
    videoGiftId: searchParams?.videoGiftId
  });

  useEffect(() => {
    setData(selectedMedia);
  }, [selectedMedia]);

  useFocusEffect(() => {
    setTimeout(() => {
      videoPreviewFlatlist.current?.scrollToEnd({ animated: true });
    }, 1000);
  });

  return (
    <LoaderView isLoading={isLoading || selectMediaIsLoading}>
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

            width: '100%'
          }}
        >
          {videoGiftData?.videoGift?.previewStatus === 'COMPLETED' &&
          videoGiftData?.videoGift?.signedPreviewUrl?.url ? (
            <Video
              // ref={video}
              style={{
                alignSelf: 'center',
                width: windowWidth,
                height: 200
              }}
              source={{
                uri: videoGiftData?.videoGift?.signedPreviewUrl?.url
              }}
              // shouldPlay
              useNativeControls
              resizeMode={ResizeMode.COVER}

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
          <StandardContainer>
            <SectionTitle>{videoGiftData?.videoGift?.title}</SectionTitle>
          </StandardContainer>
          <DraggableFlatList
            ref={videoPreviewFlatlist}
            data={data || []}
            horizontal
            autoscrollThreshold={100}
            onDragEnd={({ data }) => {
              setData(data);
            }}
            keyExtractor={(item) => item.id}
            renderItem={VideoPreview}
            renderPlaceholder={() => (
              <View style={{ flex: 1, backgroundColor: 'tomato' }} />
            )}
            // numColumns={3}
          />

          <StandardContainer style={{ flex: 1, backgroundColor: '#fff' }}>
            <PrimaryButton
              label="Add Media"
              onPress={() => {
                router.push({
                  pathname: '(drawer)/(tabs)/home/recorder',
                  params: { videoGiftId: searchParams?.videoGiftId }
                });
              }}
            />
          </StandardContainer>
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
