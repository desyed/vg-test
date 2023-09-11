import { DrawerToggleButton } from "@react-navigation/drawer";
import { Stack, useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { Alert, Button, FlatList, StyleSheet, View } from "react-native";
import { BorderRadiuses, Colors, ListItem, LoaderScreen, Text } from "react-native-ui-lib";
import { useGetCustomersQuery } from "services/customerApi";

const Item = ({ item, index }) => {
    const router = useRouter()

    return (<><Drawer.Screen options={{
        title: "Customers",
        headerShown: true,
        headerLeft: () => <DrawerToggleButton />
    }} /><View style={{ width: "100%" }}>

            <ListItem
                activeBackgroundColor={Colors.grey60}
                activeOpacity={0.3}
                height={77.5}
                onPress={() => Alert.alert(`pressed on order #${JSON.stringify(item)}`)}
            >


                <ListItem.Part left containerStyle={{ marginBottom: 3 }}>
                    <Text grey10 text70 style={{ flex: 1, marginRight: 10 }} numberOfLines={1}>
                        {item?.name}
                    </Text>
                    <Button onPress={() => {
                        router.push('(drawer)/customers/customer-details', { id: item?.id })
                    }} title="Begin">Begin</Button>
                </ListItem.Part>
                <ListItem.Part middle>
                    <Text
                        style={{ flex: 1, marginRight: 10 }}
                        text90
                        grey40
                        numberOfLines={1}
                    >{`${item?.videoGift?.[0]?.title}`}</Text>

                </ListItem.Part>

            </ListItem>
        </View>
    </>)
}
export default function Index() {

    const { data: customers, isLoading } = useGetCustomersQuery()
    console.info('customers', customers?.data)

    const keyExtractor = (item) => item.id;
    if (isLoading) return <LoaderScreen message="Loading" overlay />

    return (

        <View style={{ flex: 1, }}>
            <Stack.Screen options={{ headerShown: false, title: "Customer" }} />
            <FlatList
                data={customers?.data}
                renderItem={Item}
                keyExtractor={keyExtractor}
            />
        </View>

    );
}


const styles = StyleSheet.create({
    image: {
        width: 54,
        height: 54,
        borderRadius: BorderRadiuses.br20,
        marginHorizontal: 14
    },
    border: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: Colors.grey70
    }
});