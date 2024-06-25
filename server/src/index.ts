import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "node:http";
import connectDB from "./db";
import globalRouter from "./global-router";
import { logger } from "./logger";

connectDB();

const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());
app.use(logger);
app.use("/api/v1", globalRouter);

const server = createServer(app);

server.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}/api/v1`);
});
