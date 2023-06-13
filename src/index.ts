import { MongoClient } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";
import { insertProfileData } from "../cmd/db";
import app from "./app";
import { ProfileService } from "./services/profile";

const { PORT = 3000, GRPC_PORT = 50051 } = process.env;
let mongod;

export let mongoDB: MongoClient;
export let profileService: any;

// define init function
async function startServer() {

  profileService = new ProfileService({ host: "localhost", port: +GRPC_PORT });

  // Initialize MongoDB
  mongod = await MongoMemoryServer.create({
    instance: { dbName: "profile-db" },
  });

  // Connect to MongoDB
  mongoDB = new MongoClient(mongod.getUri(), { monitorCommands: true });
  await mongoDB.connect();

  const collection = mongoDB.db("profile-db").collection("hotels");
  collection.createIndex({ id: 1 }, { unique: true });
  await insertProfileData();

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}!`);
  });
}

// start the server
startServer().catch((error) => {
  console.error("Error starting server:", error);
});

// on server close event
process.on("SIGINT", async () => {
  await mongod.stop();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await mongod.stop();
  process.exit(0);
});
