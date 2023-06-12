import express from "express";
import { insertProfileData } from "../cmd/db";
import { getProfiles } from "./services/profile";

const app = express();


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


export default app;