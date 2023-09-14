import _ from 'lodash';
import { Controller } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import { Colors, Picker, Text, View } from 'react-native-ui-lib';

export const CustomSelect = ({
  control,
  items,
  name,
  placeholder,
  secureTextEntry = false,
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
          <View
            style={[styles.container, { borderColor: error ? 'red' : null }]}
          >
            <Picker
              placeholder={placeholder}
              value={value}
              onChange={(item) => {
                console.info('item', item);
                onChange(item);
              }}
              topBarProps={{ title: 'Languages' }}
              // style={{color: Colors.red20}}
              showSearch
              searchPlaceholder="Search a language"
              searchStyle={{
                color: Colors.blue30,
                placeholderTextColor: Colors.grey50
              }}
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
    backgroundColor: '#fff',
    borderWidth: 1,
    width: '100%',
    borderRadius: 5,

    padding: 10,
    marginVertical: 5
  }
});
