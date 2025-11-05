import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDb = async () => {
  try {
    const conn = await mongoose.connect(ENV.MONGO_URI);
    console.log("Mongodb connected successfully: ", conn.connection.host);
  } catch (error) {
    console.log("Error while connecting to Mongodb: ", error);
    process.exit(1); // status code 1 indicates error, 0 indicates success
  }
};
