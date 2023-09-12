import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function Page() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red'
      }}
    >
      <Text>
        <Link href="/sign-in">Login 1</Link>
      </Text>
    </View>
  );
}
