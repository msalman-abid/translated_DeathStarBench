import "jest";
import { Result } from "../proto/profile/Result";
import { fetchProfiles, generateHotelIds, getClient } from "./util";

const TRANSLATED_PORT = 50051;
const DEATHSTAR_PORT = 8090;

describe("GetProfiles", () => {
  it("should return correct profile", async () => {
    const client_translated = getClient(TRANSLATED_PORT);
    const client_original = getClient(DEATHSTAR_PORT);

    // array of randomly 5 generated hotel ids between 1 to 80
    const hotelIds = generateHotelIds(5);

    const translated_promise = fetchProfiles(client_translated, hotelIds);
    const original_promise = fetchProfiles(client_original, hotelIds);

    const [translated_result , original_result] = await Promise.all([
      translated_promise,
      original_promise,
    ]);

    // sort the hotels by id to make sure the order is the same
    (translated_result as Result).hotels.sort((a, b) => {
      return Number(a.id) - Number(b.id);
    });

    (original_result as Result).hotels.sort((a, b) => {
      return Number(a.id) - Number(b.id);
    });

    expect(translated_result).toEqual(original_result);
  });
});