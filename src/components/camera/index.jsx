import Ionicons from '@expo/vector-icons/Ionicons';
import { CameraButton } from 'components/camera/CameraButton';
import { MediaPreview } from 'components/camera/MediaPreview';
import { CAMERA_TYPE } from 'constants';
import { Camera, CameraType } from 'expo-camera';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { isEmpty } from 'lodash';
import { useEffect, useRef, useState } from "react";
import { Button, Dimensions, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SegmentedControl, Text } from 'react-native-ui-lib';
import * as ScreenOrientation from 'expo-screen-orientation';
import uuid from 'react-native-uuid';

export function CameraRecorder() {
  const router = useRouter();
  const searchParams = useLocalSearchParams();

  const cameraRef = useRef(null);
  const [media, setMedia] = useState([]);
  const [type, setType] = useState(CameraType.back);
  const [cameraType, setCameraType] = useState(CAMERA_TYPE.VIDEO);

  const [permission, requestPermission] = Camera.useCameraPermissions();

  const [recording, setRecording] = useState(false);
  const insets = useSafeAreaInsets();

  /* enum Orientation {
      UNKNOWN = 0,
        PORTRAIT_UP = 1,
        PORTRAIT_DOWN = 2,
        LANDSCAPE_LEFT = 3,
        LANDSCAPE_RIGHT = 4
    } */

  const [orientation, setOrientation] = useState(1)

  const detectOrientation= async () => {
    let orientation = await ScreenOrientation.getOrientationAsync();
    const screen = Dimensions.get('screen');
    if (orientation === 0) {
      orientation = screen.width > screen.height ? ScreenOrientation.Orientation.LANDSCAPE : ScreenOrientation.Orientation.PORTRAIT;
    }
    setOrientation(orientation);
  };

  useEffect(async () => {
    await detectOrientation()
    const subscription = ScreenOrientation.addOrientationChangeListener(
      handleOrientationChange
    );
    return () => {
      ScreenOrientation.removeOrientationChangeListeners(subscription);
    };
  }, [])

  const handleOrientationChange = (o) => {
    alert(o.orientationInfo.orientation)
  }

  const beginVideo = async () => {
    if (recording) {
      setRecording(false);
      return cameraRef.current.stopRecording();
    } else {
      setRecording(true);
      //   const pictureData = await cameraRef.current.takePictureAsync();
      return cameraRef.current.recordAsync().then((data) => {
        if (data?.uri) {
          setMedia([
            ...media,
            {
              id: uuid.v4(),
              uploadStatus: 'NEW',
              cameraType,
              data
              //   pictureData
            }
          ]);
        }
      });
    }
  };

  function takePicture() {
    if (cameraRef.current) {
      cameraRef.current.takePictureAsync().then((data) => {
        setMedia([
          ...media,
          { id: uuid.v4(), uploadStatus: 'NEW', cameraType, data }
        ]);
      });
    }
  }

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }
  return (
    <>
      <View style={styles.container}>
        <Camera style={styles.camera} type={type} ref={cameraRef}>
          <View style={[styles.buttonContainer, { paddingTop: insets?.top }]}>
            <View
              style={{
                // width: '50%',
                // position: 'absolute',
                // top: insets?.top,
                // left: '50%',
                // alignSelf: 'center'

                flex: 1,
                flexDirection: 'row',
                // justifyContent: 'space-between',
                alignItems: 'flex-start'
                // transform: 'translate(-50%, -50%)'
              }}
            >
              <View style={{ flex: 1, paddingLeft: 15 }}>
                <Pressable
                  onPress={() => {
                    router.back();
                  }}
                >
                  <Ionicons name="close-circle-sharp" size={32} color="white" />
                </Pressable>
              </View>
              <View
                style={{
                  flex: 1,

                  marginHorizontal: 0
                }}
              >
                <SegmentedControl
                  onChangeIndex={(index) => {
                    if (index === 0) setCameraType(CAMERA_TYPE.VIDEO);
                    if (index === 1) setCameraType(CAMERA_TYPE.PHOTO);
                  }}
                  activeColor="green"
                  backgroundColor="transparent"
                  segments={[{ label: 'Video' }, { label: 'Photo' }]}
                />
              </View>
              <View
                style={{
                  flex: 1,
                  paddingRight: 15,
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  alignItems: 'flex-start'
                }}
              >
                {!isEmpty(media) && (
                  <View
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <View
                      style={{
                        width: 40,
                        backgroundColor: 'white',
                        // borderRadius: '50%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <Ionicons
                        //   style={{ backgroundColor: 'white', borderRadius: 50 }}
                        name="checkmark-circle-outline"
                        size={32}
                        color="green"
                      />
                    </View>
                    <Text color="white">DONE</Text>
                  </View>
                )}
              </View>
            </View>

            {/* <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
                            <Text style={styles.text}>Flip Camera d</Text>
                        </TouchableOpacity> */}

            <View style={styles.button}>
              <View
                style={{
                  display: 'flex',
                  width: '80%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Pressable onPress={toggleCameraType}>
                  <Ionicons
                    //   style={{ backgroundColor: 'white', borderRadius: 50 }}
                    name="sync-sharp"
                    size={32}
                    color="white"
                  />
                </Pressable>
                <CameraButton
                  beginVideo={beginVideo}
                  recording={recording}
                  cameraType={cameraType}
                  takePicture={takePicture}
                />
                <View style={{ width: 32 }} />
              </View>
            </View>
            <View style={{ position: 'absolute', bottom: 0, right: 0 }}>
              <MediaPreview
                media={media}
                setMedia={setMedia}
                videoGiftId={searchParams.videoGiftId}
              />
            </View>
          </View>
        </Camera>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    display: 'relative'
  },
  camera: {
    height: '100%',
    width: '100%'
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'transparent',
    margin: 0,
    position: 'relative',
    display: 'flex'
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    // alignSelf: 'flex-end',
    alignItems: 'flex-end',
    marginBottom: 20
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white'
  }
});
