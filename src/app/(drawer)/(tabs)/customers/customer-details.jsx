import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { BorderRadiuses, Spacings, Text } from 'react-native-ui-lib';

export default function Index() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Stack.Screen
        options={{ headerShown: true, title: 'Customer details' }}
      />

      <Text>Customer details</Text>
    </View>
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
