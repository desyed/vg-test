import { DrawerItemList } from '@react-navigation/drawer';
import { Drawer } from 'expo-router/drawer';
import { find } from 'lodash';
import { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View } from 'react-native-ui-lib';
import { useSelector } from 'react-redux';
import {
  connectPusher,
  disconnectPusher
} from 'services/realtimeNotifications';
import { useGetMeQuery } from 'services/userApi';
export default function Layout() {
  const user = useSelector((state) => {
    return state.auth?.user;
  });

  const { data: dataMe, isLoading } = useGetMeQuery();
  const myOrganizationMember = find(
    dataMe?.organizationMember,
    (member) => member.organizationId === dataMe?.selectedOrganizationId
  );

  useEffect(() => {
    if (!user?.selectedOrganizationId) return;
    connectPusher(user);
    return disconnectPusher;
  }, [user?.selectedOrganizationId]);
  return (
    <Drawer
      drawerContent={(props) => {
        return (
          <SafeAreaView>
            <View
              style={{
                height: 200,
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                borderBottomColor: '#f4f4f4',
                borderBottomWidth: 1
              }}
            >
              <Text
                style={{
                  fontSize: 22,
                  marginVertical: 6,
                  fontWeight: 'bold',
                  color: '#111'
                }}
              >
                {dataMe?.name}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: '#111'
                }}
              >
                {dataMe?.selectedOrganization?.name}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: '#111'
                }}
              >
                {myOrganizationMember?.description}
              </Text>
            </View>
            <DrawerItemList {...props} />
          </SafeAreaView>
        );
      }}
      screenOptions={{ headerShown: false, swipeEdgeWidth: 0 }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: 'Home',
          title: 'Home'
        }}
      />
    </Drawer>
  );
}
