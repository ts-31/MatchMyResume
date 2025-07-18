import express from "express";
import dotenv from "dotenv";
import matchRoutes from "./routes/match.js";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", matchRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
