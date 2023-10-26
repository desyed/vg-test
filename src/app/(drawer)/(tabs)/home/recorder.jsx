import { CameraRecorder } from 'components/camera';
import { Stack } from 'expo-router';

export default function CameraRecorderScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Camera' }} />
      <CameraRecorder />
    </>
  );
}
