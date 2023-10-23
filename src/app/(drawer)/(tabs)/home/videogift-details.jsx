import { KeyboardAvoidingWrapper } from 'components/ui/KeyboardAvoidingWrapper';
import { LoaderView } from 'components/ui/LoaderView';
import { StandardContainer } from 'components/ui/StandardContainer';
import { SectionTitle } from 'components/ui/Title';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';
import { useGetVideoGiftByIdQuery } from 'services/videoGiftApi';

export default function CreateCustomerScreen() {
  const searchParams = useLocalSearchParams();
  console.info('searchParams', searchParams);
  const router = useRouter();
  const { data: videoGift, isLoading } = useGetVideoGiftByIdQuery({
    videoGiftId: searchParams?.videoGiftId
  });

  return (
    <LoaderView isLoading={isLoading}>
      <Stack.Screen options={{ headerShown: true, title: 'Video Gift' }} />

      <KeyboardAvoidingWrapper>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'stretch',

            width: '100%'
          }}
        >
          <StandardContainer>
            <SectionTitle>VG</SectionTitle>
          </StandardContainer>
        </View>
      </KeyboardAvoidingWrapper>
    </LoaderView>
  );
}
