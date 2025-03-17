import { useEffect, useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import {
  getCurrentPositionAsync,
  PermissionStatus,
  useForegroundPermissions,
} from "expo-location";
// import * as Location  from "expo-location";
import OutlinedButton from "../UI/OutlinedButton";
import { Colors } from "../../constants/colors";
import { getAddress, getMapPreview } from "../../util/location";
import { useNavigation, useRoute, useIsFocused } from "@react-navigation/native";

function LocationPicker({onPickLocation}) {
  const [pickedLocation, setPickedLocation] = useState();

  const navigation = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused();

  const [locationPermissionInformation, requestPermission] =
    useForegroundPermissions();

  // const mapPickedLocation = route.params ? {latitude: route.params.latitude, longitude: route.params.longitude} : null;
  // const mapPickedLocation = route.params && {
  //   latitude: route.params.latitude,
  //   longitude: route.params.longitude,
  // };
  //     ^
  //     | before using useIsFocused
  
  useEffect(() => {
    if(isFocused && route.params){
      const mapPickedLocation ={
        latitude: route.params.pickedLatitude,
        longitude: route.params.pickedLongitude,
      };
      setPickedLocation(mapPickedLocation);
    }

  }, [route, isFocused]);

  useEffect(() => {
    async function handleLocation(){
      if(pickedLocation){
        const address = await getAddress(pickedLocation.latitude, pickedLocation.longitude);
        onPickLocation({...pickedLocation, address: address});
      }
    }

    handleLocation();
  }, [pickedLocation, onPickLocation]);

  async function verifyPermissions() {
    if (
      locationPermissionInformation.status === PermissionStatus.UNDETERMINED
    ) {
      const permissionResponse = await requestPermission();

      return permissionResponse.granted;
    }

    if (locationPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert(
        "Insufficient Permissions!",
        "You need to grant location permissions to use this app"
      );
      return false;
    }

    // when we are in neither of the above two conditions
    // It means we do hace the permissions to use the camera
    return true;
  }

  async function getLocationHandler() {
    const hasPermisson = await verifyPermissions();

    if (!hasPermisson) {
      return;
    }

    const location = await getCurrentPositionAsync();
    setPickedLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
    // console.log(location);
    onPickLocation()
  }

  function pickOnMapHandler() {
    navigation.navigate("Map");
    // navigation.navigate('Map', {latitude: pickedLocation.latitude, longitude: pickedLocation.longitude});
  }

  let locationPreview = <Text>No location picked yet</Text>;

  if (pickedLocation) {
    locationPreview = (
      <Image
        style={styles.image}
        source={{
          uri: getMapPreview(pickedLocation.latitude, pickedLocation.longitude),
        }}
      />
    );
  }

  return (
    <View>
      <View style={styles.mapPreview}>{locationPreview}</View>
      <View style={styles.action}>
        <OutlinedButton icon="location" onPress={getLocationHandler}>
          Locate User
        </OutlinedButton>
        <OutlinedButton icon="map" onPress={pickOnMapHandler}>
          Pick on Map
        </OutlinedButton>
      </View>
    </View>
  );
}

export default LocationPicker;

const styles = StyleSheet.create({
  mapPreview: {
    width: "100%",
    height: 200,
    marginVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary100,
    borderRadius: 4,
    overflow: "hidden",
  },
  action: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
