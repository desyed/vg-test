import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { OrderItemCard } from 'components/ui/Cards';
import { Group } from 'components/ui/Group';
import { StandardContainer } from 'components/ui/StandardContainer';
import { StatCard } from 'components/ui/StatCard';
import { SectionTitle } from 'components/ui/Title';
import { ResizeMode, Video } from 'expo-av';
import { router } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Avatar,
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
          headerShown: false,
          headerLeft: () => <DrawerToggleButton />
        }}
      />
      <View style={styles.topContainer}>
        <SafeAreaView style={{ flex: 1 }}>
          <StandardContainer>
            <Group>
              <Avatar label="frantz" />
              <FontAwesome.Button
                name="facebook"
                backgroundColor="#3b5998"
                // onPress={loginWithFacebook}
              >
                Login with Facebook
              </FontAwesome.Button>
            </Group>
          </StandardContainer>
          <View style={{ paddingLeft: 10, marginTop: 15 }}>
            <ScrollView horizontal>
              <Group style={{ gap: 10 }}>
                <StatCard
                  label="Total Sales"
                  value="$3000"
                  backgroundColor="#F0EDEC"
                />

                <StatCard
                  label="In Progress Orders"
                  value="10"
                  backgroundColor="#F3E1FA"
                />
                <StatCard
                  label="Completed Orders"
                  value="145"
                  backgroundColor="#EFEDF8"
                />
              </Group>
            </ScrollView>
          </View>
          <StandardContainer />
        </SafeAreaView>
      </View>
      <StandardContainer>
        <SectionTitle>In Progress Orders</SectionTitle>
      </StandardContainer>
      <StandardContainer>
        <OrderItemCard
          date="Sunday, 08 sep 23"
          title="Happy Birthday"
          name="Frantz"
          email="artyfrantz@gmail.com"
        />
        <OrderItemCard
          date="Sunday, 08 sep 23"
          title="Retirement Party"
          name="LJ Li"
          email="liejian@gmail.com"
        />
      </StandardContainer>
      <StandardContainer>
        <SectionTitle>Completed Orders</SectionTitle>
      </StandardContainer>
      <StandardContainer>
        <OrderItemCard
          date="Sunday, 08 sep 23"
          title="Happy Birthday"
          name="Frantz"
          email="artyfrantz@gmail.com"
        />
        <OrderItemCard
          date="Sunday, 08 sep 23"
          title="Happy Birthday"
          name="Frantz"
          email="artyfrantz@gmail.com"
        />
      </StandardContainer>
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
  topContainer: {
    backgroundColor: '#376A60',
    width: '100%',
    height: 301
  },
  itemImage: {
    width: '100%',
    height: 85,
    borderRadius: BorderRadiuses.br10
  }
});
