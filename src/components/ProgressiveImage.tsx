import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const styles = StyleSheet.create({
  imageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  container: {
    backgroundColor: '#e1e4e8'
  }
});

const ProgressiveImage = ({
  thumbnailSource,
  source,
  style,
  ...props
}: any) => {
  const thumbnailAnimated = new Animated.Value(0);

  const imageAnimated = new Animated.Value(0);

  const handleThumbnailLoad = () => {
    // @ts-ignore
    Animated.timing(thumbnailAnimated, { toValue: 1 }).start();
  };

  const onImageLoad = () => {
    // @ts-ignore
    Animated.timing(imageAnimated, { toValue: 1 }).start();
  };

  return (
    <View style={styles.container}>
      <Animated.Image
        {...props}
        source={thumbnailSource}
        style={[style, { opacity: thumbnailAnimated }]}
        onLoad={handleThumbnailLoad}
        blurRadius={1}
      />
      <Animated.Image
        {...props}
        source={source}
        style={[styles.imageOverlay, { opacity: imageAnimated }, style]}
        onLoad={onImageLoad}
      />
    </View>
  );
};

export default ProgressiveImage;
