import Memcached from "memcached";
import { Hotel } from "../../proto/profile/Hotel";

export class CacheService {
  public static cache: Memcached;
  public static memcTimeout: number;

  public static init() {
    const { MEMCACHED_PORT } = process.env;
    CacheService.cache = new Memcached(`localhost:${MEMCACHED_PORT}`);
    CacheService.memcTimeout = +process.env.MEMC_TIMEOUT;
  }

  public static async getMulti(hotelIds: string[]) {
    // prepend 'translated-' to the hotelIds
    const alteredHotelIDs = hotelIds.map((hotelId) => 'translated-' + hotelId);

    return new Promise((resolve, reject) => {
      CacheService.cache.getMulti(alteredHotelIDs, (err, data) => {
        if (err) {
          reject(err);
        }

        // extract all values from the data object and return
        resolve(Object.values(data));

      });
    });
  }

  public static async set(hotelId: string, data: Hotel) {
    // prepend 'translated-' to the hotelId
    const alteredHotelID = 'translated-' + hotelId;

    return new Promise((resolve, reject) => {
      CacheService.cache.set(alteredHotelID, data, this.memcTimeout, (err) => {
        if (err) {
          reject(err);
        }
        resolve(true);
      });
    });
  }

}
