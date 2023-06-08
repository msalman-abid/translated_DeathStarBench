import express from "express";
import { MongoClient } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";
import { insertProfileData } from "../cmd/db";

const app = express();
const port = 3000 || process.env.PORT;
let mongod, uri;
export let mongoDB: MongoClient;

async function startServer() {
  // Initialize MongoDB
  mongod = await MongoMemoryServer.create({
    instance: { dbName: "profile-db" },
  });
  uri = mongod.getUri();

  // Connect to MongoDB
  mongoDB = new MongoClient(uri, { monitorCommands: true });
  await mongoDB.connect();

  mongoDB.on("commandStarted", (event) => {
    console.log("commandStarted:", event.commandName);
  });

  // Start the server
  app.listen(port, () => {
    console.log(`Server started on port ${port}!`);
  });
}

startServer()
  .catch((error) => {
    console.error("Error starting server:", error);
  });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/insert", async (req, res) => {
  const data = await insertProfileData();
  res.send(`<pre>${JSON.stringify(data, null, 2)}</pre>`);
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
