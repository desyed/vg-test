import { Ionicons } from '@expo/vector-icons';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { OrderItemCard } from 'components/ui/Cards';
import { Group } from 'components/ui/Group';
import { PrimaryButton } from 'components/ui/PrimaryButton';
import { StandardContainer } from 'components/ui/StandardContainer';
import { StatCard } from 'components/ui/StatCard';
import dayjs from 'dayjs'
import { router, useNavigation } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { useState } from 'react';
import { ScrollView, SectionList, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Avatar,
  BorderRadiuses,
  Image,
  Spacings,
  View,
  Text,
  GridList,
  ActionSheet, Picker, Colors
} from "react-native-ui-lib";
import { useSelector } from 'react-redux';
import { useGetOrdersQuery } from 'services/ordersApi';
import { useGetMeQuery } from 'services/userApi';

import { useGetOrganizationStatsQuery } from '../../../../services/organizationApi';
import _ from "lodash";

export const DATE_PRESETS = {
  ALL: 'ALL',
  TODAY: 'TODAY',
  YESTERDAY: 'YESTERDAY',
  CURRENT_WEEK: 'CURRENT WEEK',
  LAST_WEEK: 'LAST WEEK',
  CURRENT_MONTH: 'CURRENT MONTH',
  LAST_MONTH: 'LAST MONTH',
  YTD: 'YTD'
};
export const convertDatePresetToDates = (value) => {

  switch (value) {
    case 'ALL':
      return {
        startDate: null,
        endDate: null,
      }
    case 'TODAY':
      return {
        startDate: dayjs().startOf('day').toDate().toISOString(),
        endDate: dayjs().endOf('day').toDate().toISOString(),
      }
    case 'YESTERDAY':
      return {
        startDate: dayjs().subtract(1, 'day').startOf('day').toDate().toISOString(),
        endDate: dayjs().subtract(1, 'day').endOf('day').toDate().toISOString(),
      }
    case 'CURRENT_WEEK':
      return {
        startDate: dayjs().startOf('week').toDate().toISOString(),
        endDate: dayjs().endOf('week').toDate().toISOString(),
      }
    case 'LAST_WEEK':
      return {
        startDate: dayjs().subtract(1, 'week').startOf('week').toDate().toISOString(),
        endDate: dayjs().subtract(1, 'week').endOf('week').toDate().toISOString(),
      }
    case 'CURRENT_MONTH':
      return {
        startDate: dayjs().startOf('month').toDate().toISOString(),
        endDate: dayjs().endOf('month').toDate().toISOString(),
      }
    case 'LAST_MONTH':
      return {
        startDate: dayjs().subtract(1, 'month').startOf('month').toDate().toISOString(),
        endDate: dayjs().subtract(1, 'month').endOf('month').toDate().toISOString(),
      }
    case 'YTD':
      return {
        startDate: dayjs().startOf('year').toDate().toISOString(),
        endDate: dayjs().endOf('year').toDate().toISOString(),
      }
    default:
      return {
        startDate: undefined,
        endDate:  undefined,
      }
  }
}
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

const Header = ({onFilter}) => {
  const navigation = useNavigation();
  const organizationId = useSelector(
    (state) => state?.auth?.user?.selectedOrganizationId
  );
  const { data } = useGetOrganizationStatsQuery(
    { organizationId },
    { refetchOnMountOrArgChange: true }
  );
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [pickedOption, setPickedOption] = useState(DATE_PRESETS.ALL);
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
      <StandardContainer>
        <View>
          <Picker
            placeholder="Filter"
            floatingPlaceholder
            value={pickedOption}
            enableModalBlur={false}
            onChange={value => {
              setPickedOption(String(value));
              onFilter(convertDatePresetToDates(String(value)));
            }}
            topBarProps={{title: 'Filter Orders'}}
          >
            {_.map(Object.keys(DATE_PRESETS), option => (
              <Picker.Item key={option} value={option} label={DATE_PRESETS[option]} />
            ))}
          </Picker>
        </View>

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
  const [selectedDate, setSelectedDate] = useState({});

  const {
    data: orders,
    isLoading,
    isFetching,
    refetch
  } = useGetOrdersQuery({ organizationId, ...selectedDate });

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
        ListHeaderComponent={<Header onFilter={(values) => {
          setSelectedDate(values);
        }}/>}
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
