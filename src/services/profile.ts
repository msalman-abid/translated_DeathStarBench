import { Request, Response } from "express";
import { Server, ServerCredentials } from "@grpc/grpc-js";
import { addReflection } from "grpc-server-reflection";

import profile_proto from "../config/proto";
import { Hotel } from "../../proto/profile/Hotel";
import { MongoDBService } from "../../cmd/db";
import { profileHandlers } from "../handlers/profile";

export class ProfileService {
  private server: any;

  constructor({ host, port }: { host: string; port: number }) {
    this.server = new Server();
    this.server.addService(
      profile_proto.profile.Profile.service,
      profileHandlers // all procedures to be attached
    );

    // add reflection service to be able to use grpcurl/postman
    addReflection(this.server, "proto/descriptor_set.bin");

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

// !! DEPRECATED - TEST ROUTE ONLY!!
export const getProfiles = async (req: Request, res: Response) => {
  //  TODO: get HotelIds from req.HotelIds
  const { HotelIds } = req.body;
  const collection = MongoDBService.collection;
  const data = (await collection
    .find({ id: { $in: HotelIds } })
    .toArray()) as unknown as Hotel[];
  return res.status(200).send(data);
};
