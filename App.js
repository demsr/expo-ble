import { StatusBar } from "expo-status-bar";
import { useEffect, useReducer, useRef, useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import { BleManager } from "react-native-ble-plx";
import tw from "twrnc";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

let initialState = {
  isScanning: false,
  scanDone: false,
  bleReady: false,
  items: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "setBLEReady":
      return { ...state, bleReady: true };

      break;
    case "setBLEScan":
      return { ...state, isScanning: action.payload };
    case "addItem":
      let items = state.items;

      if (items.findIndex((x) => x.id == action.payload.id) == -1) {
        items.push(action.payload);
      }

      return { ...state, items: items };
    case "stopScan":
      return { ...state, isScanning: false, scanDone: true };
    case "reset":
      return {
        ...state,
        items: [],
        bleReady: true,
        isScanning: false,
        scanDone: false,
      };

    default:
      return state;
  }
};
const manager = new BleManager();
export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const stopBLEScan = () => {
    manager.stopDeviceScan();
    dispatch({ type: "stopScan" });
  };

  const timerRef = useRef(null);

  const scanAndConnect = () => {
    manager.startDeviceScan(null, null, (error, device) => {
      dispatch({ type: "setBLEScan", payload: true });
      if (error) {
        // Handle error (scanning will be stopped automatically)
        return;
      }

      dispatch({ type: "addItem", payload: device });
    });
  };

  useEffect(() => {
    if (state.bleReady && !state.isScanning && !state.scanDone) {
      scanAndConnect();
    }

    if (state.scanTimeout <= 0 && state.isScanning && !state.scanDone) {
      dispatch({ type: "stopScan" });
    }
  }, [state]);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      stopBLEScan();
    }, 1000 * 10);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    const subscription = manager.onStateChange((state) => {
      if (state === "PoweredOn") {
        dispatch({ type: "setBLEReady" });
        subscription.remove();
      }
    }, true);
    return () => subscription.remove();
  }, [manager]);

  const renderItem = ({ item }) => {
    return (
      <View style={tw`p-2 border rounded-md m-2`}>
        <Text style={tw`text-[24px]`}>{item.name || "No name found"}</Text>
        <Text style={tw`text-[12px]`}>{item.id}</Text>
      </View>
    );
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <SafeAreaView
        edges={["bottom", "left", "right", "top"]}
        style={tw`text-red-200 flex`}
      >
        <View style={tw` h-full flex`}>
          <View style={tw`p-4 border-b`}>
            <Text style={tw`text-[22px]`}>
              Available BLE devices in your area
            </Text>
          </View>
          <FlatList
            refreshing={state.isScanning}
            onRefresh={() => dispatch({ type: "reset" })}
            renderItem={renderItem}
            data={state.items}
            style={tw`flex border-b`}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
