import "jest";
import {
  fetchProfiles,
  generateHotelIds,
  getClient,
  sortHotelResult,
} from "./util";

const { GRPC_PORT: TRANSLATED_PORT, DEATHSTAR_PORT,  } = process.env;

describe("GetProfiles", () => {
  it("env must be set", () => {
    expect(DEATHSTAR_PORT).toBeDefined();
    expect(TRANSLATED_PORT).toBeDefined();
  });

  it("should return correct profiles", async () => {
    const client_translated = getClient(+TRANSLATED_PORT);
    const client_original = getClient(+DEATHSTAR_PORT);

    // array of randomly 5 generated hotel ids between 1 to 80
    const hotelIds = generateHotelIds(5);

    const translated_promise = fetchProfiles(client_translated, hotelIds);
    const original_promise = fetchProfiles(client_original, hotelIds);

    const [translated_result, original_result] = await Promise.all([
      translated_promise,
      original_promise,
    ]);

    // sort the hotels by id to make sure the order is the same
    sortHotelResult(translated_result);
    sortHotelResult(original_result);

    expect(translated_result).toEqual(original_result);
  });
});
