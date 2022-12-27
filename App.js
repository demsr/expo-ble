import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import { BleManager } from "react-native-ble-plx";

export default function App() {
  const manager = new BleManager();

  const scanAndConnect = () => {
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        // Handle error (scanning will be stopped automatically)
        return;
      }

      console.log(device.name);

      // Check if it is a device you are looking for based on advertisement data
      // or other criteria.
      if (device.name === "MyDevice") {
        // Stop scanning as it's not necessary if you are scanning for one device.
        // Proceed with connection.

        manager.stopDeviceScan();
      }
    });
  };

  useEffect(() => {
    const subscription = manager.onStateChange((state) => {
      if (state === "PoweredOn") {
        scanAndConnect();
        subscription.remove();
      }
    }, true);
    return () => subscription.remove();
  }, [manager]);

  const renderItem = ({ item }) => {
    return (
      <View>
        <Text>{item.name}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
      <FlatList renderItem={renderItem} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
