import { Keyboard, Platform, TouchableWithoutFeedback } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
export const KeyboardAvoidingWrapper = ({ children, scrollEnabled = true }) => {
  return (
    <KeyboardAwareScrollView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      scrollEnabled={scrollEnabled}
      //   contentContainerStyle={{ paddingBottom: 100 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {children}
      </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>
  );
};
