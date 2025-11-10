import { Inngest } from "inngest";
import { connectDb } from "./db.js";
import { User } from "../models/user.model.js";
import { deleteStreamUser, upsertStreamUser } from "./stream.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "slack-clone" });

const saveUser = inngest.createFunction(
  { id: "save-user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    // 1. connect to mongodb
    await connectDb();

    // 2. save the user to db
    const { id, email_addresses, first_name, last_name, image_url } =
      event.data;
    const newUser = {
      email: email_addresses[0]?.email_address,
      name: `${first_name || ""} ${last_name || ""}`,
      image: image_url,
      clerkId: id,
    };
    await User.create(newUser);

    // 3. send the new user to save to Stream for chat
    await upsertStreamUser({
      id: newUser.clerkId.toString(),
      name: newUser.name,
      image: newUser.image,
    });
  }
);

const deleteUserFromDB = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    // 1. connect to db
    await connectDb(); // since we are using Vercel (serverless) deployment, connecting to db before each operation is needeed

    // 2. delete user from db
    const { id } = event.data;
    await User.deleteOne({ clerkId: id });

    // 3. delete user from Stream as well
    await deleteStreamUser(id.toString());
  }
);

// Create an empty array where we'll export future Inngest functions
export const functions = [saveUser, deleteUserFromDB];
