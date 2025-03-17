import PlaceForm from "../components/Places/PlaceForm";
import { insertPlace } from "../util/database";

function AddPlace({navigation}){
    async function createPlaceHandler(place){
        await insertPlace(place);
        // the below line of code is in action before the fetchPlaces() function from database.js is used in AllPlaces screen
        // navigation.navigate('AllPlaces', {place: place});
        navigation.navigate('AllPlaces');
    }

    return <PlaceForm onCreatePlace={createPlaceHandler}/>
}

export default AddPlace;