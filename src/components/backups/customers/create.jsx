import { BButton } from 'components/button';
import { CustomSelect } from 'components/customSelect';
import { CustomTextInput } from 'components/customTextInput';
import { Stack } from 'expo-router';
import { useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, View } from 'react-native';
import { BorderRadiuses, Spacings, Text } from 'react-native-ui-lib';

export default function CreateCustomerScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      user: 'no',
      email: '',
      phone: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      //   const result = await login(data);
      //   if (result.data) {
      //     router.replace('/(drawer)/home');
      //     // alert(JSON.stringify(result.data));
      //   }
    } catch (e) {
      alert(e);
    }
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        padding: Spacings.s5,
        width: '100%'
      }}
    >
      <Stack.Screen options={{ headerShown: true, title: 'Create Customer' }} />

      <ScrollView contentInsetAdjustmentBehavior="always">
        <View
          style={{
            width: '100%'
          }}
        >
          <View flex centerH marginT-30>
            <Text text50>Create Customer</Text>
          </View>

          <View
            style={{
              width: '100%'
            }}
          >
            <View style={{}}>
              <View paddingH-s3 paddingV-s2 marginV-s4>
                <CustomTextInput
                  control={control}
                  rules={{ required: 'Name is required' }}
                  name="name"
                  placeholder="Name"
                  textInputProps={{
                    label: 'Name',
                    // autoCapitalize: 'none',
                    // keyboardType: '',
                    autoCorrect: false
                  }}
                />
              </View>
              <View paddingH-s3 paddingV-s2 marginV-s4>
                <CustomTextInput
                  control={control}
                  rules={{ required: 'Email is required' }}
                  name="email"
                  placeholder="Email"
                  textInputProps={{
                    label: 'Email',
                    autoCapitalize: 'none',
                    keyboardType: 'email-address',
                    autoCorrect: false
                  }}
                />
              </View>

              <View paddingH-s3 paddingV-s2 marginV-s4>
                <CustomTextInput
                  control={control}
                  name="phone"
                  rules={{
                    required: 'Phone is required'
                  }}
                  placeholder="Phone"
                  secureTextEntry
                  textInputProps={{ label: 'Phone' }}
                />
              </View>
              <View paddingH-s3 paddingV-s2 marginV-s4>
                <CustomSelect
                  control={control}
                  name="user"
                  rules={{
                    required: 'User is required'
                  }}
                  placeholder="User"
                  secureTextEntry
                  inputProps={{ label: 'User' }}
                />
              </View>
            </View>

            <BButton label="Create Customer" onPress={handleSubmit(onSubmit)} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingTop: Spacings.s5
  },
  itemImage: {
    width: '100%',
    height: 85,
    borderRadius: BorderRadiuses.br10
  }
});
