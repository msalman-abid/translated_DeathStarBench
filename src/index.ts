import app from "./app";
import dotenv from "dotenv";

import { CacheService } from "./services/cache";
import { MongoDBService } from "../cmd/db";
import { ProfileService } from "./services/profile";

// load env
dotenv.config();

const { PORT = 3000, GRPC_PORT = 50051, START_EXPRESS } = process.env;

export let profileService: any;

// define init function
async function startServer() {

  profileService = new ProfileService({ host: "localhost", port: +GRPC_PORT });

  // Initialize local MongoDB
  // await MongoDBService.connectToLocal();
  // await MongoDBService.initializeDB();

  // Initialize remote MongoDB
  await MongoDBService.connectToRemote();
  
  CacheService.init();

  // Start the express server
  !!START_EXPRESS && app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}!`);
  });
}

// start the server
startServer().catch((error) => {
  console.error("Error starting server:", error);
  process.exit(1);
});

// on server close event
process.on("SIGINT", async () => {
  await MongoDBService.disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await MongoDBService.disconnect();
  process.exit(0);
});
