import { DrawerToggleButton } from '@react-navigation/drawer';
import { ResizeMode, Video } from 'expo-av';
import { router } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { StyleSheet } from 'react-native';
import {
  BorderRadiuses,
  Button,
  Colors,
  GridList,
  LoaderScreen,
  Spacings,
  Text,
  View
} from 'react-native-ui-lib';
import { useGetVideoGiftQuery } from 'services/videoGiftApi';

const Item = ({ item, index }) => {
  console.info('item', item);
  return (
    <View flex margin-10 bg-grey70 padding-10>
      <View flex-1>
        <Text>{item.title}</Text>
      </View>
      <View flex-1>
        <Text text100>Video Experience</Text>
      </View>
      <View flex-1>
        <Video
          isMuted
          // ref={video}
          style={styles.video}
          source={{
            uri: ''
          }}
          shouldPlay
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          isLooping
          // onPlaybackStatusUpdate={(status) => setStatus(() => status)}
        />
      </View>
      <View flex flex-1 row spread marginT-10>
        <Button
          flex-1
          label="New Order"
          size={Button.sizes.small}
          backgroundColor={Colors.blue10}
          onPress={() => {
            router.push({
              pathname: '(drawer)/(tabs)/home/create-order',
              params: { videoGiftId: item.id }
            });
          }}
        />

        <View flex-1 />
      </View>
    </View>
  );
};

export default function Index() {
  const { data: videogifts, isLoading } = useGetVideoGiftQuery();

  if (isLoading) return <LoaderScreen message="Loading" overlay />;

  return (
    <>
      <Drawer.Screen
        options={{
          title: 'Home',
          headerShown: true,
          headerLeft: () => <DrawerToggleButton />
        }}
      />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <GridList
          ListHeaderComponent={
            <Text h1 marginB-s5>
              GridList
            </Text>
          }
          data={videogifts?.data}
          renderItem={Item}
          numColumns={1}
          // maxItemWidth={140}
          itemSpacing={Spacings.s5}
          listPadding={Spacings.s5}
          // keepItemSize
          contentContainerStyle={styles.list}
        />
      </View>
    </>
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
