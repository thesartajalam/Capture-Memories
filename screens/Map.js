import { useCallback, useLayoutEffect, useState } from "react";
import { Alert, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import IconButton from "../components/UI/IconButton";

function Map({ navigation, route }) {
  // const {latitude, longitude} = route.params;

  const initialLocation = route.params && {latitude:  route.params.initialLatitude, longitude: route.params.initialLongitude};
  
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);

  const region = {
    latitude: initialLocation ? initialLocation.latitude:  37.78,
    longitude: initialLocation ? initialLocation.longitude: -122.43,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  function selectLocationHandler(event) {
    if(initialLocation){
      return;
    }
    const latitude = event.nativeEvent.coordinate.latitude;
    const longitude = event.nativeEvent.coordinate.longitude;

    setSelectedLocation({ latitude: latitude, longitude: longitude });
  }

//   But now we can wrap this arrow function with use callback
//   which is a hook imported from React,  
//   which helps us ensure that a function defined inside  
//   of a component is not recreated unnecessarily.  
//   For that you add a second argument to use callback.  
//   The first argument is to function itself.  
//   The second argument is a dependency array,  
//   just as in use effect.

    // function savePickedLocationHandler() {
    const savePickedLocationHandler = useCallback(() => {
        if(!selectedLocation){
            Alert.alert('No location picked', 'You have to pick a location by tapping on the map first');
            return;
        }

        navigation.navigate('AddPlace', {pickedLatitude: selectedLocation.latitude, pickedLongitude: selectedLocation.longitude});
    }, [navigation, selectedLocation]);

    useLayoutEffect(() => {
      if(initialLocation){
        return;
      }
        navigation.setOptions({
            headerRight: ({tintColor}) =>  <IconButton icon="save" size={24} color={tintColor} onPress={savePickedLocationHandler}/>
        });
    }, [navigation, savePickedLocationHandler, initialLocation]);

  return (
    <MapView
      style={styles.map}
      initialRegion={region}
      onPress={selectLocationHandler}
    >
      {selectedLocation && (
        <Marker
          coordinate={{
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude,
          }}
        />
      )}
    </MapView>
  );
}

export default Map;

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
