import { StyleSheet } from 'react-native';
import { Button } from 'react-native-ui-lib';

const styles = StyleSheet.create({
  button: {
    // fontSize: 35,
    fontWeight: '700',
    fontFamily: 'Inter_900Black'
  }
});

export const PrimaryButton = ({ style = {}, label, ...props }) => (
  <Button
    size={Button.sizes.large}
    style={[styles.button, style]}
    label={label}
    {...props}
    backgroundColor="#EF6800"
  />
);
