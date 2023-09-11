import { Drawer } from 'expo-router/drawer';
export default function Layout() {
    return <Drawer screenOptions={{ headerShown: false, swipeEdgeWidth: 0 }}   >
        <Drawer.Screen name="home" options={{
            drawerLabel: 'Home',
            title: 'Home',
        }} />
        <Drawer.Screen name="customers" options={{
            drawerLabel: 'Customers',
            title: 'Customers',
        }} />
        <Drawer.Screen name="orders/index" options={{
            drawerLabel: 'Orders',
            title: 'Orders',
        }} />
    </Drawer>;
}