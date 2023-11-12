import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Toast from 'react-native-simple-toast';

import { KeyboardAvoidingWrapper } from '../../../../components/ui/KeyboardAvoidingWrapper';
import { LoaderView } from '../../../../components/ui/LoaderView';
import { PrimaryButton } from '../../../../components/ui/PrimaryButton';
import { StandardContainer } from '../../../../components/ui/StandardContainer';
import { TextInput } from '../../../../components/ui/form/TextInput';
import { useUpdatePasswordMutation } from '../../../../services/userApi';

const ChangePassword = () => {
  const [updatePassword] = useUpdatePasswordMutation();
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      originalPassword: '',
      newPassword: ''
    }
  });

  const onSubmit = async (data) => {
    const router = useRouter();
    setIsLoading(true);
    try {
      const res = await updatePassword(data);
      if (res?.data) {
        setIsLoading(false);
        Toast.show('Password Successfuly Updated');
        router.back();
      } else {
        setIsLoading(false);
        Toast.show(res?.error?.data?.message || 'Something went wrong!', 3);
      }
    } catch (e) {
      setIsLoading(false);
      Toast.show('Something went wrong!');
    }
  };
  return (
    <KeyboardAvoidingWrapper>
      <StandardContainer style={{ minHeight: 500 }}>
        <TextInput
          control={control}
          rules={{ required: 'Current password is required' }}
          name="originalPassword"
          label="Current Password"
          placeholder="Current"
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
            required: 'New Password is required'
          }}
          name="newPassword"
          label="New Password"
          placeholder="New"
          textInputProps={{
            // label: 'Email',
            returnKeyType: 'next',
            autoCorrect: false
          }}
        />

        <PrimaryButton
          style={{ marginTop: 15 }}
          label="Change Password"
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
        />
      </StandardContainer>
    </KeyboardAvoidingWrapper>
  );
};
export default ChangePassword;
