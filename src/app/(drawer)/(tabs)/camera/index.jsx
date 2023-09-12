import { DrawerToggleButton } from '@react-navigation/drawer';
import { CameraButton } from 'components/camera/CameraButton';
import { CAMERA_TYPE } from 'constants';
import { Camera, CameraType } from 'expo-camera';
import { Drawer } from 'expo-router/drawer';
import { useRef, useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { SegmentedControl, Text } from 'react-native-ui-lib';

export default function Index() {
  const cameraRef = useRef(null);
  const [media, setMedia] = useState([]);
  const [type, setType] = useState(CameraType.back);
  const [cameraType, setCameraType] = useState(CAMERA_TYPE.VIDEO);
  const [permission, requestPermission] = Camera.useCameraPermissions();

  const [recording, setRecording] = useState(false);

  const beginVideo = () => {
    if (recording) {
      setRecording(false);
      return cameraRef.current.stopRecording();
    } else {
      setRecording(true);
      return cameraRef.current.recordAsync().then((data) => {
        console.log(data);
      });
    }
  };

  function takePicture() {
    if (cameraRef.current) {
      cameraRef.current.takePictureAsync().then((data) => {
        console.log(data);
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
      <Drawer.Screen
        options={{
          title: 'Camera',
          headerShown: false,
          headerLeft: () => <DrawerToggleButton />
        }}
      />
      <View style={styles.container}>
        <Camera style={styles.camera} type={type} ref={cameraRef}>
          <View style={styles.buttonContainer}>
            <View style={{ width: '100%', position: 'absolute', top: 20 }}>
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

            {/* <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
                            <Text style={styles.text}>Flip Camera d</Text>
                        </TouchableOpacity> */}
            <View style={styles.button}>
              <CameraButton
                beginVideo={beginVideo}
                recording={recording}
                cameraType={cameraType}
                takePicture={takePicture}
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
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
    position: 'relative'
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center'
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white'
  }
});
