import { Ionicons } from '@expo/vector-icons';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { OrderItemCard } from 'components/ui/Cards';
import { Group } from 'components/ui/Group';
import { PrimaryButton } from 'components/ui/PrimaryButton';
import { StandardContainer } from 'components/ui/StandardContainer';
import { StatCard } from 'components/ui/StatCard';
import { SectionTitle } from 'components/ui/Title';
import { router, useNavigation } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { ScrollView, SectionList, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Avatar,
  BorderRadiuses,
  Image,
  Spacings,
  View,
  Text, GridList
} from "react-native-ui-lib";
import { useGetOrdersQuery } from 'services/ordersApi';
import { useGetMeQuery } from 'services/userApi';
import { useSelector } from "react-redux";
import { useGetOrganizationStatsQuery } from "../../../../services/organizationApi";
function getInitials(name) {
  // Check if name is null or not a string, return empty string if true
  if (typeof name !== 'string' || name === null) {
    return '';
  }
  // Remove any extra spaces and split the name into parts
  const nameParts = name.trim().split(/\s+/);
  // Get the first letter of each part of the name
  const initials = nameParts.map((part) => part[0].toUpperCase()).join('');
  return initials;
}

const Header = () => {
  const navigation = useNavigation();
  const organizationId = useSelector(
    (state) => state?.auth?.user?.selectedOrganizationId
  );
  const { data } = useGetOrganizationStatsQuery({organizationId}, {refetchOnMountOrArgChange: true});
  const { data: dataMe } = useGetMeQuery({});
  return (
    <>
      <View style={styles.topContainer}>
        <SafeAreaView style={{ flex: 1 }}>
          <StandardContainer>
            <Group>
              <TouchableOpacity
                onPress={() => {
                  navigation?.toggleDrawer();
                }}
              >
                <Avatar
                  source={{ uri: dataMe?.image }}
                  label={getInitials(dataMe?.name)}
                />
              </TouchableOpacity>
              <Ionicons name="notifications-outline" size={32} color="white" />
            </Group>
          </StandardContainer>
          <View style={{ paddingLeft: 10, marginTop: 15 }}>
            <ScrollView horizontal>
              <Group style={{ gap: 10 }}>
                <StatCard
                  label="Revenue"
                  value={`$${data?.revenue || 0}`}
                  backgroundColor="#F0EDEC"
                />

                <StatCard
                  label="New Orders"
                  value={data?.numberOfVideoGiftsNewOrPending || 0}
                  backgroundColor="#F3E1FA"
                />
                <StatCard
                  label="Completed Orders"
                  value={data?.numberOfVideoGiftsCompleted || 0}
                  backgroundColor="#EFEDF8"
                />
              </Group>
            </ScrollView>
          </View>
          <StandardContainer />
        </SafeAreaView>
      </View>
      <StandardContainer>
        <PrimaryButton
          onPress={() => router.push('(drawer)/(tabs)/home/create-order')}
          label="Create Order"
        />
      </StandardContainer>
    </>
  );
};

function formatDate(inputDate) {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  const date = new Date(inputDate);
  return date.toLocaleDateString('en-US', options);
}

export default function Index() {
  const organizationId = useSelector(
    (state) => state?.auth?.user?.selectedOrganizationId
  );


  const {
    data: orders,
    isLoading,
    isFetching,
    refetch
  } = useGetOrdersQuery({ organizationId });

  // if (isLoading) return <LoaderScreen message="Loading" overlay />;


  return (
    <>
      <Drawer.Screen
        options={{
          title: 'Home',
          headerShown: false,
          headerLeft: () => <DrawerToggleButton />
        }}
      />


      <GridList
        ListHeaderComponent={Header}
        data={orders}
        keyExtractor={(item, index) => item + index}
        contentInsetAdjustmentBehavior="never"
        onRefresh={() => {
          refetch();
        }}
        refreshing={isLoading || isFetching}
        renderItem={({ item }) => {
          return (
            <OrderItemCard
              date={formatDate(item.createdAt)}
              title={item.title}
              data={item}
              name={`Created by: ${item?.owner.name}`}
              email={`Recipient: ${item?.videoGiftCustomer?.email}`}
              onPress={() => {
                router.push({
                  pathname: '/(drawer)/home/videogift-details',
                  params: { videoGiftId: item.id }
                });
              }}
            />
          );
        }}
        numColumns={1}
        // maxItemWidth={140}
        // itemSpacing={Spacings.s5}
        // listPadding={Spacings.s5}
        // keepItemSize
        // contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              paddingVertical: 50,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {isFetching || isLoading ? (
              <Text>Loading...</Text>
            ) : (
              <>
                <Image source={require('../../../../../assets/empty.png')} />
                <Text>No Orders found!</Text>
              </>
            )}
          </View>
        }
      />
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
