import { Drawer } from 'expo-router/drawer';
export default function Layout() {
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
