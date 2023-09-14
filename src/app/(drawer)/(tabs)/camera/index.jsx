import { DrawerToggleButton } from '@react-navigation/drawer';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useRouter } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import UrlParse from 'url-parse';

export default function CameraScannerScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    // router.push('(drawer)/(tabs)/camera/recorder');
    const myURL = new UrlParse(data);
    const pathname = myURL.pathname;
    const pathnameParts = pathname.split('/');
    const videoGiftId = pathnameParts[pathnameParts.length - 1];

    router.push({
      pathname: '(drawer)/(tabs)/camera/recorder',
      params: { videoGiftId }
    });
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <>
      <Drawer.Screen
        options={{
          title: 'FInd QR Code',
          headerShown: true,
          headerLeft: () => <DrawerToggleButton />
        }}
      />

      <View style={styles.container}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        {scanned && (
          <Button title="Tap to Scan Again" onPress={() => setScanned(false)} />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  }
});
