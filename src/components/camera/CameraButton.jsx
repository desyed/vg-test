import { CAMERA_TYPE } from 'constants';
import { useState } from 'react';
import { Pressable } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';

const VideoButton = ({ beginVideo, recording }) => {
  const progressVideo = useDerivedValue(() => {
    if (!recording) return withTiming(-1);

    return withRepeat(withTiming(1, { duration: 1000 }), 0, true); //withTiming(1, { duration: 1000 })
  }, [recording]);

  const rStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progressVideo.value,
      [-1, 0, 1],
      ['white', 'rgba(255, 102, 102, 1)', 'rgba(139, 0, 0, 1)']
    );
    return { backgroundColor };
  });

  return (
    <Pressable
      onPressIn={() => {
        beginVideo();
      }}
      onPressOut={() => {}}
      style={{
        backgroundColor: 'white',
        width: '100%',
        height: '100%'
      }}
    >
      <Animated.View
        style={[
          {
            width: '100%',
            height: '100%',
            backgroundColor: 'white'
          },
          rStyle
        ]}
      />
    </Pressable>
  );
};

const PhotoButton = ({ takePicture }) => {
  const [isPressed, setIsPressed] = useState(false);
  const progressVideo = useDerivedValue(() => {
    if (!isPressed) return withTiming(0);

    return withTiming(1, { duration: 70 });
  }, [isPressed]);

  const rStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progressVideo.value,
      [0, 1],
      ['white', 'darkred']
    );
    return { backgroundColor };
  });

  return (
    <Pressable
      onPressIn={() => {
        setIsPressed(true);
        takePicture();
      }}
      onPressOut={() => {
        setIsPressed(false);
      }}
      style={{
        backgroundColor: 'white',
        width: '100%',
        height: '100%'
      }}
    >
      <Animated.View
        style={[
          {
            width: '100%',
            height: '100%',
            backgroundColor: 'white'
          },
          rStyle
        ]}
      />
    </Pressable>
  );
};

export const CameraButton = ({
  beginVideo,
  recording,
  cameraType,
  takePicture
}) => {
  return (
    <AnimatedCircularProgress
      size={80}
      width={2}
      fill={100}
      tintColor="red"
      backgroundWidth={1}
      onAnimationComplete={() => console.log('onAnimationComplete')}
      backgroundColor="white"
    >
      {() => (
        <>
          {cameraType === CAMERA_TYPE.VIDEO ? (
            <VideoButton beginVideo={beginVideo} recording={recording} />
          ) : (
            <PhotoButton takePicture={takePicture} />
          )}
        </>
      )}
    </AnimatedCircularProgress>
  );
};
