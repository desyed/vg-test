import { BButton } from 'components/button';
import { CustomTextInput } from 'components/customTextInput';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { ScrollView } from 'react-native';
import { Colors, Text, View } from 'react-native-ui-lib';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from 'services/authApi';
import { setCredentials } from 'slices/authSlice';

export default function SignIn() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: 'frantz@videogift.com',
      password: '123456'
    }
  });
  // State

  const onSubmit = async (data) => {
    console.info('data', data);

    try {
      const result = await login(data);

      if (result.data) {
        dispatch(setCredentials(result.data));
        router.replace('/(drawer)/home');
        // alert(JSON.stringify(result.data));
      }
    } catch (e) {
      alert(e);
    }
  };

  return (
    <View flex bg-bgColor>
      <ScrollView contentInsetAdjustmentBehavior="always">
        <View>
          <View flex centerH marginT-30>
            <Text text50>VideoGift Client Login</Text>

            <Text grey30 marginT-4>
              Organization
            </Text>
          </View>

          <View marginT-s6 centerH>
            <View
              paddingH-s4
              marginV-s10
              style={{
                width: 300,
                borderWidth: 1,
                borderColor: Colors.grey50,
                borderRadius: 12
              }}
            >
              <View paddingH-s3 paddingV-s2 marginV-s4>
                <CustomTextInput
                  control={control}
                  rules={{ required: 'Email is required' }}
                  name="email"
                  placeholder="Email"
                  textInputProps={{
                    autoCapitalize: 'none',
                    keyboardType: 'email-address',
                    autoCorrect: false
                  }}
                />
              </View>

              <View centerH>
                <View height={1} bg-grey50 style={{ width: '100%' }} />
              </View>

              <View paddingH-s3 paddingV-s2 marginV-s4>
                <CustomTextInput
                  control={control}
                  name="password"
                  rules={{
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password should be a min of 6 characters'
                    }
                  }}
                  placeholder="Password"
                  secureTextEntry
                />
              </View>
            </View>

            <BButton label="Login" onPress={handleSubmit(onSubmit)} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
