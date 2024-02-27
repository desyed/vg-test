import { CameraRecorder } from 'components/camera';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useSelector } from 'react-redux';

import {useGetVideoGiftByIdQuery, useGetVideoGiftPromptsQuery} from '../../../../services/videoGiftApi';
import _ from "lodash";

export default function CameraRecorderScreen() {
  const searchParams = useLocalSearchParams();
  const organizationId = useSelector(
    (state) => state?.auth?.user?.selectedOrganizationId
  );

  const { data } = useGetVideoGiftByIdQuery(
    { videoGiftId: searchParams?.videoGiftId, organizationId },
    { refetchOnMountOrArgChange: true }
  );
  const { data:prompts } = useGetVideoGiftPromptsQuery(
    { videoGiftId: searchParams?.videoGiftId, organizationId },
    { refetchOnMountOrArgChange: true }
  );
  return (
    <>
      <Stack.Screen options={{ headerShown: false, title: 'Camera' }} />
      <CameraRecorder lastMedia={_.last(data?.signedMedia)} videoGift={data?.videoGift} prompts={prompts?.prompts} />
    </>
  );
}
