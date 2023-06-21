import { MongoDBService } from "../../cmd/db";
import { Hotel } from "../../proto/profile/Hotel";
import { ProfileHandlers } from "../../proto/profile/Profile";
import { CacheService } from "../services/cache";

// methods to be attached to the server
export const profileHandlers: ProfileHandlers = {
  GetProfiles: async (call, callback) => {
    const { hotelIds } = call.request;

    if (!hotelIds || hotelIds.length === 0) {
      callback(new Error("Invalid hotelIds"));
      return;
    }
    const collection = MongoDBService.collection;
    const cache = CacheService.cache;

    // find if the hotelIds exist in the cache
    const cachedData = cache.mget(hotelIds);

    // convert the cached data to an array of hotels
    const cachedDataArray = Array.from(Object.values(cachedData)) as Hotel[];

    // if all the hotelIds exist in the cache return the cached data
    if (cachedDataArray.length === hotelIds.length) {
      callback(null, { hotels: cachedDataArray });
      return;
    }

    // if some of the hotelIds exist in the cache
    // find the missing hotelIds and query the DB
    const missingHotelIds = hotelIds.filter(
      (id) => !Object.keys(cachedData).includes(id)
    );

    // query the DB for the missing hotelIds
    const data = (await collection
      .find({ id: { $in: missingHotelIds } })
      .toArray()) as unknown as Hotel[];

    // add the missing hotelIds to the cache
    data.forEach((hotel) => {
      cache.set(hotel.id, hotel);
      console.log(`Added ${hotel.id} to cache`);
    });

    // combine the cached data and the queried data
    const result = [...cachedDataArray, ...data];

    callback(null, { hotels: result });
  },
};
