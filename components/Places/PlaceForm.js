import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Colors } from "../../constants/colors";
import ImagePicker from "./ImagePicker";
import LocationPicker from "./LocationPicker";
import Button from "../UI/Button";
import { Place } from "../../models/place";

function PlaceForm({onCreatePlace}) {
  const [enteredTitle, setEnteredTitle] = useState('');
  const [selectedImage, setSelectedImage] = useState();
  const [pickedLocation, setPickedLocation] = useState();

  function changeTitleHandler(enteredText){
    setEnteredTitle(enteredText);
  }

  function takeImageHandler(imageUri){
    setSelectedImage(imageUri);
  }

  // before using useEffect in location picked for onPickLocation 
  // function pickLocationHandler(location){
  //   setPickedLocation(location);
  // }

  // using useCallback() to avoid unneccessary creation of this function and infinite loops 
  // as it was use as dependancy inside an useEffect hook in LocationPicker component
  const pickLocationHandler = useCallback((location) =>{
    setPickedLocation(location);
  }, [] );

  function savePlaceHandler(){
    // these below logs were used before using the onCreatePlace prop in this function here to check the data object stored in these states
    // console.log(enteredTtitle);
    // console.log(selectedImage);
    // console.log(pickedLocation);
    
    const placeData = new Place(enteredTitle, selectedImage, pickedLocation);
    onCreatePlace(placeData);
  }

  return (
    <ScrollView style={styles.form}>
      <View>
        <Text style={styles.label}>Title</Text>
        <TextInput style={styles.input} onChangeText={changeTitleHandler} value={enteredTitle}/>
      </View>
      <ImagePicker onTakeImage={takeImageHandler}/>
      <LocationPicker onPickLocation={pickLocationHandler}/>
      <Button onPress={savePlaceHandler} >Add Place</Button>
    </ScrollView>
  );
}

export default PlaceForm;

const styles = StyleSheet.create({
  form: {
    flex: 1,
    padding: 24
  },
  label: {
    fontWeight: "bold",
    marginBottom: 4,
    color: Colors.primary500
  },
  input: {
    marginVertical: 8,
    paddingHorizontal: 4,
    paddingVertical: 8,
    fontSize: 16,
    borderBottomColor: Colors.primary700,
    borderBottomWidth: 2,
    backgroundColor:  Colors.primary100
  }
});