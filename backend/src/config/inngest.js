import { Inngest } from "inngest";
import { connectDb } from "./db";
import { User } from "../models/user.model";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "slack-clone" });

const saveUser = inngest.createFunction(
  { id: "save-user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    await connectDb();
    const { id, email_addresses, first_name, last_name, image_url } =
      event.data;
    const newUser = {
      email: email_addresses[0]?.email_address,
      name: `${first_name || ""} ${last_name || ""}`,
      image: image_url,
      clerkId: id,
    };
    await User.create(newUser);
  }
);

const deleteUserFromDB = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;
    await User.deleteOne({ clerkId: id });
  }
);

// Create an empty array where we'll export future Inngest functions
export const functions = [saveUser, deleteUserFromDB];
