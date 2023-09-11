import { DrawerToggleButton } from "@react-navigation/drawer";
import { Stack } from "expo-router";
import { Drawer } from 'expo-router/drawer';
import { StyleSheet, View } from "react-native";
import { BorderRadiuses, Card, GridList, LoaderScreen, Spacings, Text } from "react-native-ui-lib";
import { useGetVideoGiftQuery } from "services/videoGiftApi";

const Item = ({ item, index }) => {
    return (<Card flex>
        <Card.Section
            content={[{ text: item.title, text70: true, grey10: true }]}
            contentStyle={{ alignItems: 'center' }}
        />
        <Card.Section
            content={[{ text: "Video Experience", text100: true, grey10: true }]}
            contentStyle={{ alignItems: 'center' }}
        />

    </Card>)
}

export default function Index() {
    const { data: videogifts, isLoading } = useGetVideoGiftQuery()

    if (isLoading) return <LoaderScreen message="Loading" overlay />

    return (
        <><Drawer.Screen options={{
            title: "Home",
            headerShown: true,
            headerLeft: () => <DrawerToggleButton />
        }} />
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>

                <Stack.Screen options={{ headerShown: true, title: "Home" }} />

                <GridList
                    ListHeaderComponent={
                        <Text h1 marginB-s5>
                            GridList
                        </Text>
                    }
                    data={videogifts?.data}
                    renderItem={Item}
                    numColumns={1}
                    // maxItemWidth={140}
                    itemSpacing={Spacings.s3}
                    listPadding={Spacings.s5}
                    // keepItemSize
                    contentContainerStyle={styles.list}
                />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    list: {
        paddingTop: Spacings.s5
    },
    itemImage: {
        width: '100%',
        height: 85,
        borderRadius: BorderRadiuses.br10
    }
});
