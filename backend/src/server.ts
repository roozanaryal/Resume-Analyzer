import express from "express";
import dotenv from "dotenv";
import { connectDB, disconnect } from "./config/db.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

connectDB()
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



process.on("SIGINT", async () => {
  console.log("SIGTERM recived,shutting down");
  await disconnect();
  process.exit(0);
});

process.on("unhandledRejection", async (err) => {
  console.error("Uncaught exceptation", err);
  await disconnect();
  process.exit(1);
});

process.on("uncaughtException", async (err) => {
  console.error("Uncaught exceptation", err);
  await disconnect();
  process.exit(1);
});
