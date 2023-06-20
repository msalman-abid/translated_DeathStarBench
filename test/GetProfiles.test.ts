import "jest";
import protoDescriptor from "../src/config/proto";
import { credentials } from "@grpc/grpc-js";
import { Result } from "../proto/profile/Result";

const TRANSLATED_PORT = 50051;
const DEATHSTAR_PORT = 8090;

describe("GetProfiles", () => {
  it("should return correct profile", async () => {
    const client_translated = new protoDescriptor.profile.Profile(
      `localhost:${TRANSLATED_PORT}`,
      credentials.createInsecure()
    );
    const client_original = new protoDescriptor.profile.Profile(
      `localhost:${DEATHSTAR_PORT}`,
      credentials.createInsecure()
    );

    // array of randomly 5 generated hotel ids between 1 to 80
    const hotelIds = [];

    for (let i = 0; i < 5; i++) {
      hotelIds.push(String(Math.floor(Math.random() * 80) + 1));
    }

    const translated_promise = new Promise((resolve, reject) => {
      client_translated.GetProfiles({ hotelIds: hotelIds }, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });

    const original_promise = new Promise((resolve, reject) => {
      client_original.GetProfiles({ hotelIds: hotelIds }, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });

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
