import { KeyboardAvoidingWrapper } from 'components/ui/KeyboardAvoidingWrapper';
import { LoaderView } from 'components/ui/LoaderView';
import { PrimaryButton } from 'components/ui/PrimaryButton';
import { StandardContainer } from 'components/ui/StandardContainer';
import { SectionTitle } from 'components/ui/Title';
import { SelectInput } from 'components/ui/form/SelectInput';
import { TextInput } from 'components/ui/form/TextInput';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import _ from 'lodash';
import { useForm } from 'react-hook-form';
import { View, Text } from 'react-native';
import { useGetOccasionsQuery } from 'services/occasionsApi';
import { useCreateVideoGiftOrderMutation } from 'services/ordersApi';
import {
  useGetVideoGiftExperiencesQuery,
  useSearchOrganizationUsersQuery
} from 'services/organizationApi';
import { Colors, TouchableOpacity } from "react-native-ui-lib";
import { useSelector } from "react-redux";

export default function CreateCustomerScreen() {
  const organizationId = useSelector(
    (state) => state?.auth?.user?.selectedOrganizationId
  );

  const searchParams = useLocalSearchParams();

  const router = useRouter();

  const [createOrder, { isLoading: isCreateLoading }] =
    useCreateVideoGiftOrderMutation();

  const { data: experiences, isLoading: isLoadingExperiences } =
    useGetVideoGiftExperiencesQuery({ organizationId },{
      refetchOnMountOrArgChange: true
    });

  const { data: users, isLoading } = useSearchOrganizationUsersQuery({organizationId}, {
    refetchOnMountOrArgChange: true
  });
  const { data: occasions, isLoading: isLoadingOccasion } =
    useGetOccasionsQuery({});

  const { control, handleSubmit } = useForm({
    defaultValues: {
      parentVideoGiftId: searchParams?.videoGiftId,
      name: '',
      phone: '',
      email: '',
      occasionId: '',
      customerPrice: '',
      assignedToOrganizationMemberId: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      const result = await createOrder({ ...data, organizationId });
      if (result?.data) {
        router.replace({
          pathname: '/(drawer)/home/videogift-details',
          params: { videoGiftId: result?.data?.videoGift?.id }
        });
        // alert(JSON.stringify(result.data));
      }
    } catch (e) {
      alert(e);
    }
  };

  return (
    <LoaderView
      isLoading={
        isLoading ||
        isLoadingOccasion ||
        isLoadingExperiences ||
        isCreateLoading
      }
    >
      <KeyboardAvoidingWrapper>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'stretch',

            width: '100%'
          }}
        >
          <Stack.Screen
            options={{ headerShown: true, title: 'Create Order' }}
          />

          <StandardContainer>
            <SectionTitle>Create Order</SectionTitle>
          </StandardContainer>
          <StandardContainer>
            <SelectInput
              items={_.map(experiences, (data) => ({
                value: data.id,
                label: `${data.title}`
              }))}
              label="VideoGift Template"
              control={control}
              name="parentVideoGiftId"
              rules={{
                required: 'Video Gift Template is required'
              }}
              placeholder="Select VideoGift Template"
              textInputProps={{
                returnKeyType: 'next'
              }}
              // inputProps={{ label: 'Assigned To' }}
            />
            <TouchableOpacity onPress={()=>{}}>
              <Text style={{color: Colors.grey20, textAlign: "right"}}>Don't have template?</Text>
            </TouchableOpacity>
            <TextInput
              control={control}
              rules={{ required: 'Name is required' }}
              name="name"
              label="Customer Name"
              placeholder="Name"
              textInputProps={{
                returnKeyType: 'next',
                // autoCapitalize: '',
                // keyboardType: 'email-address',
                autoCorrect: false
              }}
            />
            <TextInput
              control={control}
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: 'Entered value does not match email format'
                }
              }}
              name="email"
              label="Customer Email"
              placeholder="Email"
              textInputProps={{
                // label: 'Email',
                returnKeyType: 'next',
                autoCapitalize: 'none',
                inputMode: 'email',
                autoCorrect: false
              }}
            />
            {/*<TextInput*/}
            {/*  control={control}*/}
            {/*  name="phone"*/}
            {/*  label="Customer Phone"*/}
            {/*  rules={{}}*/}
            {/*  placeholder="Phone"*/}
            {/*  textInputProps={{ returnKeyType: 'next', inputMode: 'tel' }}*/}
            {/*/>*/}
            <SelectInput
              items={_.map(occasions?.data, (occasion) => ({
                value: occasion.id,
                label: `${occasion.name}`
              }))}
              label="Occasion"
              control={control}
              name="occasionId"
              rules={{
                required: 'Occasion is required'
              }}
              placeholder="Occasion"
              textInputProps={{ returnKeyType: 'next' }}
              // inputProps={{ label: 'Assigned To' }}
            />
            <TextInput
              control={control}
              name="title"
              label="Title of VideoGift"
              rules={{
                required: 'Title is required'
              }}
              placeholder="Happy Birthday Gigi!"
              textInputProps={{ returnKeyType: 'next' }}
              // textInputProps={{ label: 'Phone' }}
            />
            <SelectInput
              items={_.map(users, (user) => ({
                value: user.id,
                label: `${user.name} (${user.role})`
              }))}
              label="Assigned To"
              control={control}
              name="assignedToOrganizationMemberId"
              rules={{
                required: 'Assigned To is required'
              }}
              placeholder="User"
              // inputProps={{ label: 'Assigned To' }}
            />
            <TextInput
              control={control}
              rules={{
                required: 'Customer price is required'
              }}
              name="customerPrice"
              label="Customer Price"
              placeholder="50.00"
              textInputProps={{
                // label: 'Email',
                autoCapitalize: 'none',
                inputMode: 'decimal',
                autoCorrect: false,
                returnKeyType: 'next',
                onSubmitEditing: () => {},
                blurOnSubmit: false
              }}
            />
          </StandardContainer>
          <StandardContainer>
            <PrimaryButton
              label="Create Order"
              onPress={handleSubmit(onSubmit)}
            />
          </StandardContainer>
        </View>
      </KeyboardAvoidingWrapper>
    </LoaderView>
  );
}
