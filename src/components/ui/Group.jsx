import { StyleSheet } from 'react-native';
import { View } from 'react-native-ui-lib';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});

export const Group = ({ children, style = {} }) => (
  <View style={[styles.container, style]}>{children}</View>
);
