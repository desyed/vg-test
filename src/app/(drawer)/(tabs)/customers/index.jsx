import Ionicons from '@expo/vector-icons/Ionicons';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { size } from 'lodash';
import { FlatList, Pressable, StyleSheet } from 'react-native';
import {
  BorderRadiuses,
  Colors,
  LoaderScreen,
  Text,
  View
} from 'react-native-ui-lib';
import { useGetCustomersQuery } from 'services/customerApi';

const Item = ({ item, index }) => {
  const router = useRouter();
  return (
    <>
      <View flex margin-10 bg-grey70 padding-10>
        <View>
          <Text text70 style={{ flex: 1, marginRight: 10 }} numberOfLines={1}>
            {item.name}
          </Text>
        </View>
        <View>
          <Text text90 style={{ flex: 1, marginRight: 10 }} numberOfLines={1}>
            {`${size(item?.videoGift)}`} Orders
          </Text>
        </View>
        <View>
          <Text text90 style={{ flex: 1, marginRight: 10 }} numberOfLines={1}>
            {`${new Date(item?.createdAt).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}`}
          </Text>
        </View>
      </View>
    </>
  );
};

export default function Index() {
  const router = useRouter();
  const {
    data: customers,
    isLoading,
    refetch,
    isFetching
  } = useGetCustomersQuery();
  console.info('customers', customers?.data);

  const keyExtractor = (item) => item.id;

  const onRefresh = () => {
    refetch();
  };

  if (isLoading) return <LoaderScreen message="Loading" overlay />;

  return (
    <>
      <Drawer.Screen
        options={{
          title: 'Customers',
          headerShown: true,
          headerLeft: () => <DrawerToggleButton />,
          headerRight: () => (
            <Pressable
              onPress={() => router.push('(drawer)/(tabs)/customers/create')}
            >
              <Ionicons name="add-circle" size={32} color="black" />
            </Pressable>
          )
        }}
      />
      <View style={{ flex: 1 }}>
        <FlatList
          data={customers?.data}
          renderItem={Item}
          keyExtractor={keyExtractor}
          onRefresh={() => onRefresh()}
          refreshing={isFetching}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 54,
    height: 54,
    borderRadius: BorderRadiuses.br20,
    marginHorizontal: 14
  },
  border: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.grey70
  }
});
