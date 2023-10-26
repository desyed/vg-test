import { Ionicons } from '@expo/vector-icons';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { OrderItemCard } from 'components/ui/Cards';
import { Group } from 'components/ui/Group';
import { PrimaryButton } from 'components/ui/PrimaryButton';
import { StandardContainer } from 'components/ui/StandardContainer';
import { StatCard } from 'components/ui/StatCard';
import { SectionTitle } from 'components/ui/Title';
import { router } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { ScrollView, SectionList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, BorderRadiuses, Spacings, View } from 'react-native-ui-lib';
import { useGetOrdersQuery } from 'services/ordersApi';
const Header = () => {
  return (
    <>
      <View style={styles.topContainer}>
        <SafeAreaView style={{ flex: 1 }}>
          <StandardContainer>
            <Group>
              <Avatar label="frantz" />
              <Ionicons name="notifications-outline" size={32} color="white" />
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
        <PrimaryButton
          onPress={() => router.push('(drawer)/(tabs)/home/create-order')}
          label="Create Order"
        />
      </StandardContainer>
    </>
  );
};
function groupByOrderStatus(inputData) {
  const groupedData = {};

  inputData.forEach((item) => {
    const orderStatus = item.orderStatus;

    // Map "NEW" and "GENERATING_FINAL_VIDEO" to "In Progress"
    const updatedOrderStatus =
      orderStatus === 'NEW' || orderStatus === 'GENERATING_FINAL_VIDEO'
        ? 'In Progress'
        : orderStatus;

    if (!groupedData[updatedOrderStatus]) {
      groupedData[updatedOrderStatus] = [];
    }

    groupedData[updatedOrderStatus].push(item);
  });

  // Create an array of objects with "title" and "data" properties
  const result = Object.keys(groupedData).map((orderStatus) => ({
    title: orderStatus,
    data: groupedData[orderStatus]
  }));

  // Define the custom order for sorting
  const customOrder = ['In Progress', 'COMPLETED'];

  // Sort the result array based on the custom order
  result.sort((a, b) => {
    const indexA = customOrder.indexOf(a.title);
    const indexB = customOrder.indexOf(b.title);
    return indexA - indexB;
  });

  return result;
}
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
  // const { data: videogifts, isLoading } = useGetVideoGiftQuery();

  const { data: orders, isLoading, isFetching, refetch } = useGetOrdersQuery();
  // console.info('orders', orders);
  // if (isLoading) return <LoaderScreen message="Loading" overlay />;

  const groupedByOrderStatus = groupByOrderStatus(orders || []);

  return (
    <>
      <Drawer.Screen
        options={{
          title: 'Home',
          headerShown: false,
          headerLeft: () => <DrawerToggleButton />
        }}
      />

      <SectionList
        contentInsetAdjustmentBehavior="never"
        sections={groupedByOrderStatus}
        ListHeaderComponent={Header}
        keyExtractor={(item, index) => item + index}
        onRefresh={() => {
          refetch();
        }}
        refreshing={isLoading || isFetching}
        renderItem={({ item }) => (
          <OrderItemCard
            date={formatDate(item.createdAt)}
            title={item.title}
            name="Frantz"
            email="artyfrantz@gmail.com"
            onPress={() => {
              router.push({
                pathname: '/(drawer)/home/videogift-details',
                params: { videoGiftId: item.id }
              });
            }}
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <View
            style={{
              margin: 0,
              // marginTop: 40,
              padding: 20,
              backgroundColor: 'white'
            }}
          >
            <SectionTitle>{title}</SectionTitle>
          </View>
        )}
      />

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {/* <GridList
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
        /> */}
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
