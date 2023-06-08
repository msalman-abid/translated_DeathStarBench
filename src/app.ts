import express from "express";
import { MongoClient } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";
import { insertProfileData } from "../cmd/db";
import { getProfiles } from "./services/profile";

const app = express();
const port = 3000 || process.env.PORT;
let mongod;
export let mongoDB: MongoClient;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.send("Hello World!");
});

// route for testing/manual initialization of DB
app.get("/init", async (req, res) => {
  const data = await insertProfileData();
  res.send(`<pre>${JSON.stringify(data, null, 2)}</pre>`);
});

app.post("/hotels", async (req, res) => {
  return getProfiles(req, res);
});


async function startServer() {
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
