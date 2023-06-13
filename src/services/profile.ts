import { Request, Response } from "express";
import { mongoDB } from "../index";
import { Hotel } from "../types/common";

import { Server, ServerCredentials } from "@grpc/grpc-js";
import { addReflection } from 'grpc-server-reflection'


import profile_proto from "../config/proto";
import { ProfileHandlers } from "../../proto/profile/Profile";

// !! DEPRECATED - TEST ROUTE ONLY!!
export const getProfiles = async (req: Request, res: Response) => {
  //  TODO: get HotelIds from req.HotelIds
  const { HotelIds } = req.body;
  const collection = mongoDB.db("profile-db").collection("hotels");
  const data = (await collection
    .find({ id: { $in: HotelIds } })
    .toArray()) as unknown as Hotel[];
  return res.status(200).send(data);
};

// methods to be attached to the server
const profileServer: ProfileHandlers = {
  GetProfiles: async (call, callback) => {
    const { hotelIds } = call.request;

    if (!hotelIds || hotelIds.length === 0) {
      callback(new Error("Invalid hotelIds"));
      return;
    }

    const collection = mongoDB.db("profile-db").collection("hotels");
    const data = (await collection
      .find({ id: { $in: hotelIds } })
      .toArray()) as unknown as Hotel[];
    callback(null, { hotels: data });
  },
};

export class ProfileService {
  private server: any;

  constructor({ host, port }: { host: string; port: number }) {
    this.server = new Server();
    this.server.addService(
      profile_proto.profile.Profile.service,
      profileServer // all procedures to be attached
    );

    // add reflection service to be able to use grpcurl/postman
    addReflection(this.server, 'proto/descriptor_set.bin')

    this.server.bindAsync(
      `${host}:${port}`,
      ServerCredentials.createInsecure(),
      (err: Error | null, port: number) => {
        if (err) {
          return console.error(err);
        }
        this.server.start();
        console.log(`Profile service listening on ${port}`);
      }
    );
  }
}
