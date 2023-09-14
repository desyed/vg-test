import { CAMERA_TYPE } from 'constants';
import { ResizeMode, Video } from 'expo-av';
import { find, map, size } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Image, Text, View } from 'react-native-ui-lib';
import { useGetSignedPutUrlMutation } from 'services/awsApi';
import { createMediaUploadTask } from 'utils/uploadUtil';

export const MediaPreview = ({ media, setMedia }) => {
  const [getSignedPutUrl, { data, loading, error }] =
    useGetSignedPutUrlMutation();
  const video = useRef(null);

  console.info('media', media);
  const [progress, setProgress] = useState({});

  const upload = async () => {
    const currentMedia = find(media, (m) => m.uploadStatus === 'NEW');

    if (!currentMedia) return;
    const taskPicture = await createMediaUploadTask({
      uri: currentMedia?.pictureData?.uri,
      getSignedPutUrl,

      onProgress: (e) => {
        setProgress({
          ...progress,
          [currentMedia?.id]: e.totalBytesSent / e.totalBytesExpectedToSend
        });
        console.info('PROGRESS', progress);
      }
    });

    const taskVideo = await createMediaUploadTask({
      uri: currentMedia?.data?.uri,
      getSignedPutUrl,

      onProgress: (e) => {
        setProgress({
          ...progress,
          [currentMedia?.id]: e.totalBytesSent / e.totalBytesExpectedToSend
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

    if (taskVideo && taskPicture) {
      const response = await taskVideo.task.uploadAsync();
      const responsePicture = await taskPicture.task.uploadAsync();
      console.info('response', response);
      console.info('responsePicture', responsePicture);

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
          {Math.round((progress?.[currentMedia?.id] || 0) * 100)}%
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
