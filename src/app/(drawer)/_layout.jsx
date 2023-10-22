import { Drawer } from 'expo-router/drawer';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  connectPusher,
  disconnectPusher
} from 'services/realtimeNotifications';

export default function Layout() {
  const user = useSelector((state) => {
    return state.auth?.user;
  });
  useEffect(() => {
    if (!user?.selectedOrganizationId) return;
    connectPusher(user);
    return disconnectPusher;
  }, [user?.selectedOrganizationId]);
  return (
    <Drawer screenOptions={{ headerShown: false, swipeEdgeWidth: 0 }}>
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
