import express from "express";
import cors from "cors";

import routes from "./routes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", routes);

// Error handling middleware
app.use(errorHandler);

export default app;
