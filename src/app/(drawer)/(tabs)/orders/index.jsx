import { ResizeMode, Video } from 'expo-av';
import { Stack, useRouter } from 'expo-router';
import { filter, pick } from 'lodash';
import { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { Button, LoaderScreen, Text, View } from 'react-native-ui-lib';
import { useSelector } from 'react-redux';
import { useGetOrdersQuery } from 'services/ordersApi';
import { useGeneratePreviewMutation } from 'services/videoGiftApi';
const Item = ({ item, index, generatePreview }) => {
  const router = useRouter();
  return (
    <>
      <View flex margin-10 bg-grey70 padding-10>
        <View>
          <Text text70 style={{ flex: 1, marginRight: 10 }} numberOfLines={1}>
            {item.videoGiftCustomer?.name}
          </Text>
        </View>
        <View>
          <Text text90 style={{ flex: 1, marginRight: 10 }} numberOfLines={1}>
            {`${new Date(item?.createdAt).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}}`}
          </Text>
        </View>
        <View>
          <Text text90 style={{ flex: 1, marginRight: 10 }} numberOfLines={1}>
            Status: {`${item?.orderStatus}`}
          </Text>
        </View>
        <View>
          <Text text90 style={{ flex: 1, marginRight: 10 }} numberOfLines={1}>
            Created By: {`${item?.owner?.name}`}
          </Text>
        </View>
        <View>
          <Text text90 style={{ flex: 1, marginRight: 10 }} numberOfLines={1}>
            Assigned To: {`${item?.assignedToOrganizationMember?.name}`}
          </Text>
        </View>
        <View>
          {Boolean(item?.signedPreviewUrl?.url) && (
            <>
              <Video
                // ref={video}
                style={{
                  alignSelf: 'center',
                  width: 300,
                  height: 200,
                  marginVertical: 10
                }}
                source={{
                  uri: item?.signedPreviewUrl?.url
                }}
                // shouldPlay
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}

                // onPlaybackStatusUpdate={(status) => setStatus(() => status)}
              />
              <View flex flex-1 row spread marginT-10>
                <Button
                  onPress={() =>
                    router.push({
                      pathname: '(drawer)/(tabs)/orders/recorder',
                      params: { videoGiftId: item.id }
                    })
                  }
                  label="Add Media"
                />
                <Button
                  onPress={() => generatePreview({ videoGiftId: item?.id })}
                  label="Refresh Preview"
                />
              </View>
            </>
          )}
          {!item?.signedPreviewUrl?.url && (
            <>
              <Text>No Preview Available</Text>
              <View flex flex-1 row spread marginT-10>
                <Button
                  onPress={() =>
                    router.push({
                      pathname: '(drawer)/(tabs)/orders/recorder',
                      params: { videoGiftId: item.id }
                    })
                  }
                  label="Add Media"
                />
                <Button
                  onPress={() => generatePreview({ videoGiftId: item?.id })}
                  label="Generate a Preview"
                />
              </View>
            </>
          )}
        </View>
      </View>
    </>
  );
};

export default function Index() {
  const router = useRouter();
  const user = useSelector((state) => {
    return state.auth?.user;
  });

  const [messages, updateMessages] = useState([]);

  console.info('messages', messages);
  const [generatePreview] = useGeneratePreviewMutation();
  const { data: orders, isLoading, refetch, isFetching } = useGetOrdersQuery();

  const keyExtractor = (item) => item.id;
  const onRefresh = () => {
    refetch();
  };

  useEffect(() => {
    if (!user.organizationId) return;
  }, [user.organizationId]);

  const updateData = filter(pick(orders, ['updateDate']), Boolean);
  console.info('updateData', updateData);
  if (isLoading) return <LoaderScreen message="Loading" overlay />;
  return (
    <>
      <Stack.Screen
        options={{ headerShown: true, title: 'Customer details' }}
      />
      <View style={{ flex: 1 }}>
        <FlatList
          data={orders}
          extraData={updateData}
          renderItem={(data) => (
            <Item generatePreview={generatePreview} {...data} />
          )}
          keyExtractor={keyExtractor}
          onRefresh={() => onRefresh()}
          refreshing={isFetching}
        />
      </View>
    </>
  );
}
