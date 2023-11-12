import { ErrorAlert } from 'components/ui/Alert';
import { PrimaryButton } from 'components/ui/PrimaryButton';
import { StandardContainer } from 'components/ui/StandardContainer';
import { Title } from 'components/ui/Title';
import { TextInput } from 'components/ui/form/TextInput';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { ScrollView } from 'react-native';
import { Image, View } from 'react-native-ui-lib';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from 'services/authApi';
import { setCredentials } from 'slices/authSlice';

export default function SignIn() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [login, { isLoading, error }] = useLoginMutation();

  const {
    control,
    handleSubmit,
    formState: {}
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

      console.info('result', result);
    } catch (e) {
      console.info('e', e);
      // alert(e);
    }
  };

  return (
    <View flex bg-bgColor>
      <ScrollView
        contentInsetAdjustmentBehavior="always"
        style={{ position: 'relative', zIndex: 2 }}
      >
        <View>
          <StandardContainer style={{ marginTop: 140 }}>
            <Title>Log In</Title>
          </StandardContainer>
          {error?.data?.message ? (
            <StandardContainer>
              <ErrorAlert title="Error">{error?.data?.message}</ErrorAlert>
            </StandardContainer>
          ) : null}
          <StandardContainer>
            <TextInput
              control={control}
              rules={{ required: 'Email is required' }}
              name="email"
              label="Email"
              placeholder="Email"
              textInputProps={{
                autoCapitalize: 'none',
                keyboardType: 'email-address',
                autoCorrect: false
              }}
            />

            <TextInput
              control={control}
              label="Password"
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
          </StandardContainer>
          <StandardContainer>
            <PrimaryButton onPress={handleSubmit(onSubmit)} loading={isLoading} label="Log In" />
          </StandardContainer>
        </View>
      </ScrollView>
      <Image
        style={{
          bottom: 0,
          position: 'absolute',
          zIndex: 0
        }}
        source={require('../../assets/images/LoginImage.png')}
      />
    </View>
  );
}
