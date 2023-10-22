import { DrawerToggleButton } from '@react-navigation/drawer';
import { CameraRecorder } from 'components/camera';
import { Drawer } from 'expo-router/drawer';

export default function CameraRecorderScreen() {
  return (
    <>
      <Drawer.Screen
        options={{
          title: 'Camera',
          headerShown: false,
          headerLeft: () => <DrawerToggleButton />
        }}
      />
      <CameraRecorder />
    </>
  );
}
