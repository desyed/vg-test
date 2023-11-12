import _ from 'lodash';
import { useRef } from 'react';
import { Controller } from 'react-hook-form';
import { Pressable, StyleSheet } from 'react-native';
import { Text, TextField, View } from 'react-native-ui-lib';
export const TextInput = ({
  control,
  name,
  placeholder,
  secureTextEntry = false,
  textInputProps = {},
  required = false,
  rules = {},
  label = ''
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
          <Text style={[styles.label]}>
            {label} {!_.isEmpty(rules?.required) && '*'}
          </Text>
          <View
            style={[
              styles.container,
              { borderColor: error ? 'red' : styles.container.borderColor }
            ]}
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
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderStype: 'solid',
    borderColor: '#F5F5F5',
    width: '100%',
    borderRadius: 8,

    padding: 13,
    marginVertical: 5
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 27,
    fontFamily: 'Inter_900Black',
    color: '#333333',
    marginBottom: 5
  }
});
