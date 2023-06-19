import { MongoDBService } from "../cmd/db";
import app from "./app";
import { ProfileService } from "./services/profile";

const { PORT = 3000, GRPC_PORT = 50051 } = process.env;

export let profileService: any;

// define init function
async function startServer() {

  profileService = new ProfileService({ host: "localhost", port: +GRPC_PORT });

  // Initialize local MongoDB
  // await MongoDBService.connectToLocal();
  // await MongoDBService.initializeDB();

  // Initialize remote MongoDB
  await MongoDBService.connectToRemote();
  
  console.log("Connected to MongoDB");
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
  await MongoDBService.disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await MongoDBService.disconnect();
  process.exit(0);
});
