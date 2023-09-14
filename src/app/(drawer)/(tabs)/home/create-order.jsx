import { CustomSelect } from 'components/customSelect';
import { CustomTextInput } from 'components/customTextInput';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import _ from 'lodash';
import { useForm } from 'react-hook-form';
import { ScrollView, View } from 'react-native';
import {
  Button,
  Colors,
  LoaderScreen,
  Spacings,
  Text
} from 'react-native-ui-lib';
import { useSearchOrganizationUsersQuery } from 'services/organizationApi';
import { useCreateVideoGiftOrderMutation } from 'services/videoGiftApi';

export default function CreateCustomerScreen() {
  const searchParams = useLocalSearchParams();

  console.info('searchParams', searchParams);
  const router = useRouter();

  const [createOrder, { isLoading: isCreateLoading }] =
    useCreateVideoGiftOrderMutation();
  const { data: users, isLoading } = useSearchOrganizationUsersQuery({});

  const { control, handleSubmit } = useForm({
    defaultValues: {
      id: searchParams?.videoGiftId,
      name: '',
      phone: '',
      email: '',
      assignedToOrganizationMemberId: ''
    }
  });

  const onSubmit = async (data) => {
    console.info('data', data);

    try {
      const result = await createOrder(data);
      console.info('data 11', result);
      if (result.data) {
        // dispatch(setCredentials(result.data));
        router.replace('/(drawer)/home');
        // alert(JSON.stringify(result.data));
      }
    } catch (e) {
      alert(e);
    }
  };

  if (isLoading && isCreateLoading)
    return <LoaderScreen message="Loading" overlay />;

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
      <Stack.Screen options={{ headerShown: true, title: 'Create Order' }} />

      <ScrollView contentInsetAdjustmentBehavior="always">
        <View
          style={{
            width: '100%'
          }}
        >
          <View flex centerH marginT-30>
            <Text text50>Create Order</Text>
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
                  textInputProps={{ label: 'Phone' }}
                />
              </View>
              <View paddingH-s3 paddingV-s2 marginV-s4>
                <CustomSelect
                  items={_.map(users, (user) => ({
                    value: user.id,
                    label: `${user.name} (${user.role})`
                  }))}
                  control={control}
                  name="assignedToOrganizationMemberId"
                  rules={{
                    required: 'Assigned To is required'
                  }}
                  placeholder="User"
                  inputProps={{ label: 'Assigned To' }}
                />
              </View>
            </View>

            <Button
              backgroundColor={Colors.green10}
              label="Create Customer"
              onPress={handleSubmit(onSubmit)}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
