import {
  launchCameraAsync,
  PermissionStatus,
  useCameraPermissions,
} from "expo-image-picker";
import { useState } from "react";
import { View, Text, Button, Alert, Image, StyleSheet } from "react-native";
import { Colors } from "../../constants/colors";
import OutlinedButton from "../UI/OutlinedButton";

function ImagePicker({onTakeImage}) {
    const [pickedImage, setPickedImage] = useState();

  // useCameraPermissions(); and verifyPermissions is defined to handle the asking permission
  // mechanism and functionality for IOS devices and it need to be handled manually
  const [cameraPermissionInformation, requestPermission] =
    useCameraPermissions();

  async function verifyPermissions() {
    if (cameraPermissionInformation.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestPermission();
      // console.log(permissionResponse);
      return permissionResponse.granted;
    }

    if (cameraPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert(
        "Insufficient Permissions!",
        "You need to grant camera permissions to use this app"
      );
      return false;
    }

    // when we are in neither of the above two conditions
    // It means we do have the permissions to use the camera
    return true;
  }

  async function takeImageHandler() {
    const hasPermission = await verifyPermissions();

    if(!hasPermission){
        return;
    }

    const image = await launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
    });
    // console.log(image);
    // console.log(image);
    // setPickedImage(image.uri); // in earlier expo verisons it is used like this 
    setPickedImage(image.assets[0].uri); // now in advanced versions there are only two sections retured cancled(boolean value) and assets(array of properties)
    // is cancled is true then assets is null otherwise assets will contain properties like uri and many other image properties that has been taken
    onTakeImage(image.assets[0].uri);
  }

  let imagePreview = <Text>No image taken yet.</Text>;

  if(pickedImage){
    imagePreview = <Image style={styles.image} source={{uri: pickedImage}}/>
  }

  return (
    <View>
      <View style={styles.imagePreview}>
        {imagePreview}
      {/* <Image source={{uri: pickedImage}}/> */}
      </View>
      <OutlinedButton icon="camera" onPress={takeImageHandler} >Take Image</OutlinedButton>
    </View>
  );
}

export default ImagePicker;

const styles = StyleSheet.create({
    imagePreview: {
        width: "100%",
        height: 200,
        marginVertical: 8,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.primary100,
        borderRadius: 4,
    },
    image: {
        width: "100%",
        height: "100%",
    }
});