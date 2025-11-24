import express, { NextFunction, Request, Response } from "express";
import connectDB from "./database";
import postsRouter from "./api/posts.routes";
import authorsRouter from "./api/authors/authors.routes";
import notFound from "./middlewares/NotFound";
import errorHandler from "./middlewares/ErrorHandler";
import tagRouter from "./api/tags/tag.routes";
import morgan from "morgan";
import cors from "cors";

const hostname = process.env.HOSTNAME || "127.0.0.1";
const app = express();
const PORT = 8000;

app.use(express.json());

app.use(cors({
    origin: "127.0.0.1",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(morgan("dev"));

app.use("/posts", postsRouter);
app.use("/authors", authorsRouter);
app.use("/tags", tagRouter);

app.use(notFound);
app.use(errorHandler);

connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on http://${hostname}:${PORT}`);
});
