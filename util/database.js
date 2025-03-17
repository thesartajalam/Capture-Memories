import * as SQLite from "expo-sqlite";
import { Place } from "../models/place";

// let database
const database = SQLite.openDatabaseAsync("places.db");

// export async function init() {
export function init() {
  // database = await SQLite.openDatabaseAsync("places.db");

  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS places (
                  id INTEGER PRIMARY KEY NOT NULL,
                  title TEXT NOT NULL,
                  imageUri TEXT NOT NULL,
                  address TEXT NOT NULL,
                  latitude REAL NOT NULL,
                  longitude REAL NOT NULL
              )`,
        // all the below and this one above are the arguments that executeSql takes
        [], // array of the values(columns) defined above
        () => {
          resolve();
        }, // callBack function for success invoking of the query
        (_, error) => {
          reject(); // will be called if an error caught
        } // callBack function for error handling
      );
    });
  });

  return promise;
}

export function insertPlace(place) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO places (title, imageUri, address, latitude, longitude) VALUES (?,?,?,?,?)`,
        [
          place.title,
          place.imageUri,
          place.address,
          place.location.latitude,
          place.location.longitude,
        ],
        (_, result) => {
          console.log(result);
          resolve(result);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
}

export function fetchPlaces() {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM places",
        [],
        (_, result) => {
          // "_" is the blank place or say it's just a blank as it receives two arguments
          // console.log(result);
          // resolve(result);
          // resolve(result.rows._array);

          const places = [];

          for (const dp of result.rows._array) {
            // dp here is the data pointS
            places.push(
              new Place(
                dp.title,
                dp.imageUri,
                {
                  address: dp.address,
                  latitude: dp.latitude,
                  longitude: dp.longitude,
                },
                dp.id
              )
            );
          }

          resolve(places);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
}

export function fetchPlaceDetails() {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM places WHERE id = ?",
        [id],
        (_, result) => {
          const dbPlace = result.rows._array[0];
          // console.log(result);
          const place = new Promise(dbPlace.title,  dbPlace.imageUri, {latitude: dbPlace.latitude, longitude: dbPlace.longitude, address: dbPlace.address}, dbPlace.id);
          // resolve(result.rows._array[0]);
          resolve(place);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
}
