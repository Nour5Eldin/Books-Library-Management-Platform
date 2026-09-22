import express from "express";
import path from "path";

import helmet from "helmet";
import cors from "cors";

import bookRoutes from "./routes/book.routes";
import { errorMiddleware } from "./middleware/error.middleware";

const app = express();

const clientDistPath = path.join(
    process.cwd(),
    "../client/dist/client"
);

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/books", bookRoutes);

app.use(express.static(clientDistPath));

app.get("/{*splat}", (_req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
});

app.use(errorMiddleware);

export default app;