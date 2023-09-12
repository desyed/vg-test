import { DrawerToggleButton } from '@react-navigation/drawer';
import { Drawer } from 'expo-router/drawer';
import { View } from 'react-native';
import { Text } from 'react-native-ui-lib';

export default function Index() {
  return (
    <>
      <Drawer.Screen
        options={{
          title: 'Orders',
          headerShown: true,
          headerLeft: () => <DrawerToggleButton />
        }}
      />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Orders</Text>
      </View>
    </>
  );
}
