import { StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 14
  }
});

export const StandardContainer = ({ children, style = {} }) => (
  <View style={[styles.container, style]}>{children}</View>
);
