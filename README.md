# Using react-native-ble-plx with expo

## Summary

This repo demonstrates how to use [react-native-ble-plx](https://github.com/dotintent/react-native-ble-plx) in a managed expo project.

FAQ

- **Do i need to eject?** No
- **Can i use the expo go app?** Also no
- **But how does it work?** Running native code (non expo stuff, react-native-ble-plx in this case) requires a custom build of expo's go app, called a [dev-client](https://docs.expo.dev/development/introduction/#what-is-an-expo-dev-client)
- **I can't see anything happening in this app?!** Currently all this app does is outputting stuff to the console. This will change in the future.

## Requirements

To build this app you need access to expos [eas](https://expo.dev/eas) system. Dont worry, it's free\*. You can either build in their cloud or on your own machine (building for iOS requieres a macOS Device!).

##### \*At least for a limited amount of builds.

## Instructions

Remote Build (eas server)

- eas build --profile development --platform ios

OR

- eas build --profile development --platform android

Local build:

- eas build --profile development --platform ios --local

OR

- eas build --profile development --platform android --local

And then follow the eas instructions.

To build a standalone app you need to swith the profile to "preview":

- eas build --profile preview --platform ios

OR

- eas build --profile preview --platform android
