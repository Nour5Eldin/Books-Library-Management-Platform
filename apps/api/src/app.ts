import express from "express";

import helmet from "helmet";
import cors from "cors";

import bookRoutes from "./routes/book.routes";
import { errorMiddleware } from "./middleware/error.middleware";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/books", bookRoutes);

app.use(errorMiddleware);

export default app;
