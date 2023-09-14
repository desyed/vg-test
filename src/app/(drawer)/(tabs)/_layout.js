import Ionicons from '@expo/vector-icons/Ionicons';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { Tabs } from 'expo-router';
import { Drawer } from 'expo-router/drawer';

export default function TabsLayout() {
  return (
    <>
      <Drawer.Screen
        options={{
          title: 'Home 1',
          headerShown: false,
          headerLeft: () => <DrawerToggleButton />
        }}
      />

      <Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen
          name="home"
          options={{
            tabBarLabel: 'Home',
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            )
          }}
        />
        <Tabs.Screen
          name="customers"
          options={{
            tabBarLabel: 'Customers',
            title: 'Customers',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="people-outline" size={size} color={color} />
            )
          }}
        />
        <Tabs.Screen
          name="camera"
          options={{
            tabBarLabel: 'Camera',
            title: 'Camera',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="camera-outline" size={size} color={color} />
            )
          }}
        />
      </Tabs>
    </>
  );
}
