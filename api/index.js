import express from "express";
import dotenv from "dotenv";
import matchRoutes from "./routes/match.js";
import cors from "cors";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: [
      "http://127.0.0.1:5500",
      "https://www.linkedin.com",
      "https://internshala.com",
    ],
    credentials: true,
  })
);

app.use(express.json());

app.use(
  ClerkExpressWithAuth({
    secretKey: process.env.CLERK_SECRET_KEY,
  })
);

app.use("/api", matchRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
