import { CAMERA_TYPE } from 'constants';
import { ResizeMode, Video } from 'expo-av';
import { find, map, size } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Image, Text, View } from 'react-native-ui-lib';
import { useGetSignedPutUrlMutation } from 'services/awsApi';
import {
  useCreateMediaMutation,
  useSelectMediaMutation
} from 'services/mediaApi';
import { createMediaUploadTask } from 'utils/uploadUtil';

export const MediaPreview = ({ media, setMedia, videoGiftId }) => {
  const [getSignedPutUrl] = useGetSignedPutUrlMutation();
  const [createMedia] = useCreateMediaMutation();
  const [selectMedia] = useSelectMediaMutation();
  const video = useRef(null);

  const [progress, setProgress] = useState({});

  const upload = async () => {
    const currentMedia = find(media, (m) => m.uploadStatus === 'NEW');

    if (!currentMedia) return;

    const taskVideo = await createMediaUploadTask({
      uri: currentMedia?.data?.uri,
      getSignedPutUrl,
      acl: 'private',
      onProgress: (e) => {
        setProgress({
          ...progress,

          [currentMedia?.id]: {
            ...progress[currentMedia?.id],
            video: e.totalBytesSent / e.totalBytesExpectedToSend
          }
        });
        console.info('PROGRESS', progress);
      }
    });
    setMedia(
      map(media, (m) => {
        return {
          ...m,
          uploadStatus:
            m.id === currentMedia.id ? 'IN PROGRESS' : m.uploadStatus
        };
      })
    );

    if (taskVideo) {
      await taskVideo.task.uploadAsync();

      const mediaResponse = await createMedia({
        // previewImageUrl: taskPicture?.url,
        originalKey: taskVideo?.key,
        type: 'VIDEO',
        videoGiftId
      });
      if (mediaResponse?.data) {
        selectMedia({
          videoGiftId,
          mediaId: mediaResponse?.data?.id,
          order: 'NEXT'
        });
      }

      setMedia(
        map(media, (m) => {
          return {
            ...m,
            uploadStatus: m.id === currentMedia.id ? 'COMPLETE' : m.uploadStatus
          };
        })
      );
    } else {
      setMedia(
        map(media, (m) => {
          return { ...m, uploadStatus: 'NEW', attempt: (m.attempt || 0) + 1 };
        })
      );
    }
  };

  useEffect(() => {
    upload();
  }, [size(media)]);

  const currentMedia = find(media, (m) => m.uploadStatus === 'IN PROGRESS');
  if (!currentMedia) return null;
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center'
      }}
    >
      <Text white text100>
        {media?.length} videos/photos
      </Text>
      <View style={styles.container}>
        {currentMedia?.cameraType === CAMERA_TYPE.VIDEO ? (
          <Video
            isMuted
            ref={video}
            style={styles.video}
            source={{
              uri: currentMedia?.data?.uri
            }}
            shouldPlay
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            isLooping
            // onPlaybackStatusUpdate={(status) => setStatus(() => status)}
          />
        ) : (
          <Image
            source={{ uri: currentMedia?.data?.uri }}
            style={styles.image}
          />
        )}

        <Text
          style={{
            position: 'absolute',
            // zIndex: 1000,
            top: 10,
            left: '25%',
            color: 'white'
          }}
          white
          text50
        >
          {Math.round(
            ((progress?.[currentMedia?.id]?.picture || 0) / 2 +
              (progress?.[currentMedia?.id]?.video || 0) / 2 || 0) * 100
          )}
          %
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 100,
    backgroundColor: 'black',
    margin: 10,
    position: 'relative'
  },
  video: {
    alignSelf: 'center',
    width: 100,
    height: 100
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain'
  }
});
