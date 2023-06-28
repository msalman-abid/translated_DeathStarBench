import Memcached from "memcached";
import { Hotel } from "../../proto/profile/Hotel";

export class CacheService {
  public static cache: Memcached;
  public static memcTimeout: number;

  public static init() {
    const { MEMCACHED_PORT } = process.env;
    CacheService.cache = new Memcached(`localhost:${MEMCACHED_PORT}`);
    CacheService.memcTimeout = +process.env.MEMC_TIMEOUT;
    CacheService.cache.flush((err) => {
      if (err) {
        console.log(err);
      }
      console.log("Memcached flushed");
    }
    );
  }

  public static async getMulti(hotelIds: string[]) {
    return new Promise((resolve, reject) => {
      CacheService.cache.getMulti(hotelIds, (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  }

  public static async set(hotelId: string, data: Hotel) {
    return new Promise((resolve, reject) => {
      CacheService.cache.set(hotelId, data, this.memcTimeout, (err) => {
        if (err) {
          reject(err);
        }
        resolve(true);
      });
    });
  }

}
