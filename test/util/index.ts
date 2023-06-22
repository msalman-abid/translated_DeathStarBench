import { ProfileClient } from "../../proto/profile/Profile";
import { Result } from "../../proto/profile/Result";
import { credentials } from "@grpc/grpc-js";

import protoDescriptor from "../../src/config/proto";

export const getClient = (port: number) => {
  return new protoDescriptor.profile.Profile(
    `localhost:${port}`,
    credentials.createInsecure()
  );
};

export const generateHotelIds = (
  count: number,
  minIndex = 1,
  maxIndex = 80
) => {
  const hotelIds = [];

  for (let i = 0; i < count; i++) {
    hotelIds.push(String(Math.floor(Math.random() * maxIndex) + minIndex));
  }

  return hotelIds as string[];
};

export const fetchProfiles = async (
  client: ProfileClient,
  hotelIds: string[]
) => {
  return new Promise((resolve, reject) => {
    client.GetProfiles({ hotelIds: hotelIds }, (err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    });
  });
};

export const sortHotelResult = (result: Result) => {
  result.hotels.sort((a, b) => {
    return Number(a.id) - Number(b.id);
  });
}
