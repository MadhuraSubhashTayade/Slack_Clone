import "../instrument.mjs";
import express from "express";
import { ENV } from "./config/env.js";
import { connectDb } from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";
import { inngest, functions } from "./config/inngest.js";
import { serve } from "inngest/express";
import router from "./routes/chat.route.js";
import * as Sentry from "@sentry/node";

const app = express();
app.use(express.json());
app.use(clerkMiddleware()); // Makes req.auth() available in the request object

app.get("/", (req, res) => {
  res.send("Hello from Slack-Clone!");
});
app.get("/debug-sentry", (req, res) => {
  throw new Error("My first sentry error");
});

// Setting up the "/api/inngest" routes with the serve handler
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", router);

Sentry.setupExpressErrorHandler(app);

const startServer = async () => {
  try {
    await connectDb();
    if (ENV.NODE_ENV !== "production") {
      // only runs the app on given port if we are in development mode
      app.listen(ENV.PORT, () => {
        console.log(`Server listening on port ${ENV.PORT}!`);
      });
    }
  } catch (error) {
    console.error("Error starting server!!!");
    process.exit(1);
  }
};
startServer();

export default app; // exporting the app so that vercel can use it for deployment
