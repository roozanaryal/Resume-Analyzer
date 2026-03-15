import express from "express";
import dotenv from "dotenv";
import { connectDB, disconnect } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:5174",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:5174",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);


// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Something went wrong!", error: err.message });
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

startServer();

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
