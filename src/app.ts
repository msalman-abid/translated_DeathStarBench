import express from "express";
import { getProfiles } from "./services/profile";

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/hotels", async (req, res) => {
  return getProfiles(req, res);
});


export default app;