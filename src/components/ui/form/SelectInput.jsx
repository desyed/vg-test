import _ from 'lodash';
import { Controller } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import { Picker, Text, View } from 'react-native-ui-lib';

import { formStyles } from './styles';
export const SelectInput = ({
  control,
  items,
  name,
  label,
  placeholder,

  inputProps = {},
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
          <Text style={[styles.label]}>{label}</Text>
          <View
            style={[
              styles.container,
              { borderColor: error ? 'red' : styles.container.borderColor }
            ]}
          >
            <Picker
              placeholder={placeholder}
              value={value}
              onChange={(item) => {
                onChange(item);
              }}
              topBarProps={{ title: label }}
              // style={{color: Colors.red20}}
              useSafeArea
              enableModalBlur={false}
              {...inputProps}

              // onSearchChange={value => console.warn('value', value)}
            >
              {_.map(items, (option) => (
                <Picker.Item
                  isSelected={option.value === value}
                  key={option.value}
                  value={option.value}
                  label={option.label}
                  disabled={option.disabled}
                />
              ))}
            </Picker>
            {/* </ScrollView> */}
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
    ...formStyles.container
  },
  label: {
    ...formStyles.label
  }
});
