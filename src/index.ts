import { MongoClient } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";
import { insertProfileData } from "../cmd/db";
import app from "./app";
import { ProfileService } from "./services/profile";

const port = 3000 || process.env.PORT;
let mongod;

export let mongoDB: MongoClient;
export let profileService: any;

// define init function
async function startServer() {

  profileService = new ProfileService({ host: "localhost", port: 50051 });

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
  app.listen(port, () => {
    console.log(`Server started on port ${port}!`);
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
