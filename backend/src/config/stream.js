import { StreamChat } from "stream-chat";
import { ENV } from "../config/env.js";

const streamClient = StreamChat.getInstance(
  ENV.STREAM_API_KEY,
  ENV.STREAM_SECRET_KEY
);

export const upsertStreamUser = async (userData) => {
  try {
    await streamClient.upsertUser(userData);
    console.log("Stream user upserted successfully !!!", userData.name);
    return userData;
  } catch (error) {
    console.log("Error upserting stream user!", error);
  }
};

export const deleteStreamUser = async (userId) => {
  try {
    await streamClient.deleteUser(userId);
    console.log("Stream user deleted successfully !!!");
  } catch (error) {
    console.log("Error deleting Stream user!", error);
  }
};

// Stream token will be used by the Frontend
export const generateStreamToken = (userId) => {
  try {
    const id = userId.toString();
    return streamClient.createToken(id);
  } catch (error) {
    console.log("Error generating Stream token!", error);
    return null;
  }
};
