import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { log } from 'expo-updates/build-cli/utils/log';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import Toast from 'react-native-simple-toast';
import { Avatar, BorderRadiuses, Colors, View } from 'react-native-ui-lib';

import { KeyboardAvoidingWrapper } from '../../../../components/ui/KeyboardAvoidingWrapper';
import { LoaderView } from '../../../../components/ui/LoaderView';
import { PrimaryButton } from '../../../../components/ui/PrimaryButton';
import { StandardContainer } from '../../../../components/ui/StandardContainer';
import { SectionTitle } from '../../../../components/ui/Title';
import { SelectInput } from '../../../../components/ui/form/SelectInput';
import { TextInput } from '../../../../components/ui/form/TextInput';
import {
  useCreateOrgUserMutation,
  useGetOrgUserByIdQuery,
  useUpdateOrgUserMutation
} from '../../../../services/organizationApi';
import { useUpdateProfileMutation } from '../../../../services/userApi';
import { createUploadTask, pickImage } from '../../../../utils/uploadUtil';
import { getInitials } from '../../../../utils/utils';

const AddUser = () => {
  const searchParams = useLocalSearchParams();
  const router = useRouter();

  const roles = ['ADMIN', 'USER'];
  // @ts-ignore
  const [createUser, { isLoading: createLoading, error: createError }] =
    useCreateOrgUserMutation();

  // const [updateUser] = useUpdateProfileMutation();
  const [isImageLoading, setImageLoading] = useState(false);

  const {
    data: userIfo,
    isError: isUserLoadingError,
    error,
    isLoading
  } = useGetOrgUserByIdQuery(searchParams?.id);

  const [updateOrgUser, { isLoading: isUpdateLoading }] =
    useUpdateOrgUserMutation();

  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      email: '',
      name: '',
      description: '',
      role: ''
    }
  });

  if (isUserLoadingError) {
    // alert('User load failed')
  }

  useEffect(() => {
    if (userIfo) {
      setValue('name', userIfo?.name);
      setValue('email', userIfo?.email);
      setValue('description', userIfo?.description);
      setValue('role', userIfo?.role);
      // @ts-ignore
      setValue('active', userIfo?.active);
    }
  }, [userIfo]);

  const uploadImage = async () => {
    setImageLoading(true);
    const resizedImage = await pickImage();
    const task = await createUploadTask({
      uri: resizedImage?.uri,
      acl: 'public-read',
      onProgress: (e) => {
        console.info('PROGRESS', e);
      },
      filename: 'profile-image.jpg',
      key: `organization/member/${userIfo.id}/profile-image.jpg`
    });

    if (task) {
      try {
        await task.task.uploadAsync();
        await updateOrgUser({
          id: userIfo?.id,
          image: task?.url
        });
      } catch (e) {
        console.log(e);
      }
    }

    setImageLoading(false);
  };

  const onSubmit = async (data) => {
    try {
      const result = searchParams?.id
        ? await updateOrgUser({ id: userIfo?.id, ...data })
        : await createUser(data);
      if (result?.data) {
        router.push({
          pathname: '(tabs)/home/organizations'
        });
        Toast.show(
          `${searchParams?.id ? 'Updated' : 'Created'} Successfully`,
          3
        );
      } else {
        Toast.show(`${searchParams?.id ? 'Update' : 'Create'} Failed!`, 3);
      }
    } catch (e) {
      Toast.show(`${searchParams?.id ? 'Update' : 'Create'} Failed!`, 3);
    }
  };

  return (
    <LoaderView isLoading={false}>
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
            options={{
              headerShown: true,
              title: ''
            }}
          />

          <StandardContainer>
            <SectionTitle>
              {searchParams?.id ? 'Update' : 'Create'} User
            </SectionTitle>
          </StandardContainer>
          <StandardContainer
            style={{
              marginHorizontal: 0,
              marginVertical: 0
            }}
          >
            <LoaderView
              isLoading={isImageLoading}
              style={{
                height: 150,
                flex: 1,
                backgroundColor: '#376A60',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Avatar
                size={100}
                source={{ uri: userIfo?.image }}
                label={userIfo?.name? getInitials(userIfo?.name) : ""}
                onPress={uploadImage}
                customRibbon={
                  <View
                    style={{
                      backgroundColor: 'lightgray',
                      elevation: 2,
                      borderRadius: 50,
                      display: 'flex',
                      padding: 5,
                      position: 'absolute',
                      top: 60,
                      left: 15
                    }}
                  >
                    <Ionicons color="#376A60" name="chevron-forward-outline" />
                  </View>
                }
                badgePosition="BOTTOM_RIGHT"
              />
            </LoaderView>
          </StandardContainer>
          <StandardContainer>
            <TextInput
              control={control}
              rules={{ required: 'Name is required' }}
              name="name"
              label="Name"
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
              label="Email"
              placeholder="Email"
              textInputProps={{
                // label: 'Email',
                returnKeyType: 'next',
                autoCapitalize: 'none',
                inputMode: 'email',
                autoCorrect: false
              }}
            />
            <TextInput
              control={control}
              name="description"
              label="Description"
              rules={{}}
              placeholder="Description"
              textInputProps={{ returnKeyType: 'next', autoCorrect: false }}
            />
            <SelectInput
              items={_.map(roles, (role) => ({
                value: role,
                label: role
              }))}
              label="Role"
              control={control}
              name="role"
              rules={{
                required: 'Role is required'
              }}
              placeholder="Select Role"
              textInputProps={{
                returnKeyType: 'next'
              }}
              // inputProps={{ label: 'Assigned To' }}
            />
            {searchParams?.id && (
              <SelectInput
                items={_.map([true, false], (val) => ({
                  value: val,
                  label: val ? 'Yes' : 'No'
                }))}
                label="Active"
                control={control}
                name="active"
                placeholder="Select Role"
                textInputProps={{
                  returnKeyType: 'next'
                }}
                // inputProps={{ label: 'Assigned To' }}
              />
            )}
          </StandardContainer>
          <StandardContainer>
            <PrimaryButton
              label={`${searchParams?.id ? 'Update' : 'Create'} User`}
              onPress={handleSubmit(onSubmit)}
              loading={isUpdateLoading || createLoading}
            />
          </StandardContainer>
        </View>
      </KeyboardAvoidingWrapper>
    </LoaderView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 54,
    height: 54,
    borderRadius: BorderRadiuses.br100,
    marginHorizontal: 14,
    backgroundColor: Colors.white
  },
  border: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.grey70
  }
});

export default AddUser;
