import { MongoDBService } from "../../cmd/db";
import { Hotel } from "../../proto/profile/Hotel";
import { ProfileHandlers } from "../../proto/profile/Profile";
import { CacheService } from "../services/cache";

// methods to be attached to the server
export const profileHandlers: ProfileHandlers = {
  GetProfiles: async (call, callback) => {
    let { hotelIds } = call.request;
    const { collection } = MongoDBService;

    if (!hotelIds || hotelIds.length === 0) {
      callback(new Error("Invalid hotelIds"));
      return;
    }

    // delete duplicates based on id
    hotelIds = [...new Set(hotelIds)];

    // find if the hotelIds exist in the cache
    const cachedData = await CacheService.getMulti(hotelIds);

    // if error in fetching from cache
    if (cachedData instanceof Error) {
      callback(cachedData);
      return;
    }


    // cast the cached data to an array of hotels
    const cachedDataArray = (cachedData) as Hotel[];

    // if all the hotelIds exist in the cache return the cached data
    if (cachedDataArray.length === hotelIds.length) {
      callback(null, { hotels: cachedDataArray });
      return;
    }

    // if some of the hotelIds exist in the cache
    // find the missing hotelIds and query the DB using cachedDataArray
    const missingHotelIds = hotelIds.filter(
      (id) => !cachedDataArray.find((hotel) => hotel.id === id)
    );

    // query the DB for the missing hotelIds separately for each ID
    const dataPromises = missingHotelIds.map((id) =>
      collection.findOne({ id: id })
    );

    // wait for all the promises to resolve
    const data = await Promise.all(dataPromises) as Hotel[];
 
    // add the missing hotelIds to the cache
    data.forEach((hotel) => {
      CacheService.set(hotel.id, hotel);
      // console.log(`Added ${hotel.id} to cache`);
    });
    
    // combine the cached data and the queried data
    const result = [...cachedDataArray, ...data];

    callback(null, { hotels: result });
  },
};
