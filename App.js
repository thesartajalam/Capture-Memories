import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AllPlaces from "./screens/AllPlaces";
import AddPlace from "./screens/AddPlace";
import IconButton from "./components/UI/IconButton";
import { Colors } from "./constants/colors";
import Map from "./screens/Map";
import { useCallback, useEffect, useState } from "react";
import { init } from "./util/database";
import * as SplashScreen from "expo-splash-screen";
import PlaceDetails from "./screens/PlaceDetails";

const Stack = createNativeStackNavigator();

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false);

  // useEffect(() => {
  //   init()
  //     .then(() => {
  //       setDbInitialized(true);
  //       SplashScreen.hideAsync(); // Hide splash screen after initialization
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       SplashScreen.hideAsync(); // Ensure splash screen is hidden even on error
  //     });
  // }, []);

  // useEffect(() => {
  //   const initialize = async () => {
  //     try {
  //       await init(); // Wait for init() to complete
  //       setDbInitialized(true);
  //     } catch (error) {
  //       console.log(error);
  //     } finally {
  //       SplashScreen.hideAsync(); // Hide splash screen whether success or error
  //     }
  //   };
  
  //   initialize(); // Call the async function
  // }, []);

  // const onLayoutRootView = useCallback(() => {
  //   if(dbInitialized){
  //     SplashScreen.hide();
  //   }
  // }, [dbInitialized]);

  // if (!dbInitialized) {
  //   return null; // Return null to keep splash screen visible
  // }

  useEffect(() => {
    const prepare = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        init();
      } catch (e) {
        console.warn(e);
      } finally {
        setDbInitialized(true);
      }
    };
    prepare();
  }, []);
 
  const onLayoutRootView = useCallback(
    async () => {
      if (dbInitialized) {
        await SplashScreen.hideAsync();
      }
    },
    [dbInitialized]
  );
 
  if (!dbInitialized) return null;

  return (
    <>
      <StatusBar style="dark" />
      <NavigationContainer onReady={onLayoutRootView}>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: Colors.primary500 },
            headerTintColor: Colors.gray700,
            contentStyle: { backgroundColor: Colors.gray700 },
          }}
        >
          <Stack.Screen
            name="AllPlaces"
            component={AllPlaces}
            options={({ navigation }) => ({
              title: "Your Favourite Places",
              headerRight: ({ tintColor }) => (
                <IconButton
                  icon="add"
                  size={24}
                  color={tintColor}
                  onPress={() => navigation.navigate("AddPlace")}
                />
              ),
            })}
          />
          <Stack.Screen
            name="AddPlace"
            component={AddPlace}
            options={{
              title: "Add a new Place",
            }}
          />
          <Stack.Screen name="Map" component={Map} />
          <Stack.Screen name="PlaceDetails" component={PlaceDetails} options={{
            title: "Loading Places..."
          }}/>
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
