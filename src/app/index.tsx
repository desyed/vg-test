import { router } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';
import { Button, Colors, Image } from 'react-native-ui-lib';

export default function Page() {
  const offset = useSharedValue(200);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }]
  }));

  useEffect(() => {
    offset.value = withRepeat(
      withTiming(-offset.value, { duration: 10000 }),
      -1,
      true
    );
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

        position: 'relative'
      }}
    >
      <Animated.View style={[animatedStyles]}>
        <Image source={require('../../assets/images/Landscape.jpg')} />
      </Animated.View>
      <View style={{ position: 'absolute', top: 80 }}>
        <Image
          cover
          style={{
            resizeMode: 'contain',
            height: 300,
            width: 400
          }}
          aspectRatio={1}
          width={100}
          source={require('../../assets/images/VideoGiftLogoPNG.png')}
        />
      </View>
      <View style={{ position: 'absolute', bottom: 80 }}>
        <Button
          flex-1
          label="LOGIN"
          backgroundColor={Colors.green1}
          size={Button.sizes.large}
          onPress={() => {
            router.push('sign-in');
          }}
        />
      </View>
    </View>
  );
}
