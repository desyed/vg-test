import { Controller } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Text, View } from 'react-native-ui-lib';

export const CustomTextInput = ({
  control,
  name,
  placeholder,
  secureTextEntry = false,
  textInputProps = {},
  rules = {}
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { value, onChange, onBlur },
        fieldState: { error }
      }) => (
        <>
          <View
            style={[styles.container, { borderColor: error ? 'red' : null }]}
          >
            <TextInput
              placeholder={placeholder}
              secureTextEntry={secureTextEntry}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              {...textInputProps}
            />
          </View>
          {error && (
            <Text red20 text100R style={{ alignSelf: 'stretch' }}>
              {error?.message || 'Error'}
            </Text>
          )}
        </>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderWidth: 1,
    width: '100%',
    borderRadius: 5,

    padding: 10,
    marginVertical: 5
  }
});
