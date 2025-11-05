import express from "express";
import { ENV } from "./config/env.js";
import { connectDb } from "./config/db.js";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello worldd!");
});

app.listen(ENV.PORT, () => {
  console.log(`Server listening on port ${ENV.PORT}!`);
  connectDb();
});
