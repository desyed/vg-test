import { DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import {  useRouter } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { find } from 'lodash';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Colors, Dialog, PanningProvider, Text, View } from "react-native-ui-lib";
import { StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  connectPusher,
  disconnectPusher
} from 'services/realtimeNotifications';
import { useGetMeQuery } from 'services/userApi';

import { logout } from '../../slices/authSlice';
export default function Layout() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);

  const user = useSelector((state) => {
    return state.auth?.user;
  });

  const token = useSelector((state) => state.auth.token);

  // @ts-ignore
  const { data: dataMe, isLoading } = useGetMeQuery();
  const myOrganizationMember = find(
    dataMe?.organizationMember,
    (member) => member.organizationId === dataMe?.selectedOrganizationId
  );

  useEffect(() => {
    console.log('token', token);
    if (!token) {
      router.replace('sign-in');
    }
  }, [token]);

  // @ts-ignore
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
            <DrawerItem
              label="Logout"
              onPress={() => {
                // dispatch(logout())
                setVisible(true);
              }}
            />
            <Dialog
              visible={visible}
              onDismiss={() => setVisible(false)}
              panDirection={PanningProvider.Directions.DOWN}
            >
              <View style={style.popupContent}>
                <Text style={{ fontSize: 18 }}>Are you sure?</Text>
                <View
                  style={{
                    justifyContent: 'center',
                    marginTop: 18,
                    gap: 5,
                    flexDirection: 'row',
                    width: '100%'
                  }}
                >
                  <Button
                    label="Cancel"
                    backgroundColor={Colors.grey1}
                    size={Button.sizes.xSmall}
                    onPress={() => {
                      setVisible(false);
                    }}
                  />
                  <Button
                    label="Logout"
                    backgroundColor="#EF6800"
                    size={Button.sizes.xSmall}
                    onPress={() => {
                      dispatch(logout());
                    }}
                  />
                </View>
              </View>
            </Dialog>

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

const style = StyleSheet.create({
  popupContent: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    height: 120
  }
});
