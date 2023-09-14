import { useRef } from 'react';
import { Controller } from 'react-hook-form';
import { Pressable, StyleSheet } from 'react-native';
import { Text, TextField, View } from 'react-native-ui-lib';

export const CustomTextInput = ({
  control,
  name,
  placeholder,
  secureTextEntry = false,
  textInputProps = {},
  rules = {}
}) => {
  const ref = useRef(null);

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { value, onChange, onBlur },
        fieldState: { error }
      }) => (
        <Pressable
          onPress={() => {
            ref.current.focus();
          }}
        >
          <View
            style={[styles.container, { borderColor: error ? 'red' : null }]}
          >
            <TextField
              ref={ref}
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
        </Pressable>
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
