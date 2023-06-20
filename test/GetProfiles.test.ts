import "jest";
import protoDescriptor from "../src/config/proto";

import { credentials } from "@grpc/grpc-js";

export default protoDescriptor;

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

    const translated_promise = new Promise((resolve, reject) => {
      client_translated.GetProfiles(
        { hotelIds: ["1", "2"] },
        (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response);
          }
        }
      );
    });

    const original_promise = new Promise((resolve, reject) => {
      client_original.GetProfiles(
        { hotelIds: ["1", "2"] },
        (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response);
          }
        }
      );
    });

    const [translated_result, original_result] = await Promise.all([
      translated_promise,
      original_promise,
    ]);

    expect(translated_result).toEqual(original_result);
  });
});
