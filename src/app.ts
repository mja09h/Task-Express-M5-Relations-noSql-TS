import express from "express";
import connectDB from "./database";
import postsRouter from "./api/posts.routes";
import authorsRouter from "./api/authors/authors.routes";
import notFound from "./middlewares/NotFound";
import errorHandler from "./middlewares/ErrorHandler";
import tagRouter from "./api/tags/tag.routes";

const app = express();
const PORT = 8000;

app.use(express.json());

app.use("/posts", postsRouter);
app.use("/authors", authorsRouter);
app.use("/tags", tagRouter);

app.use(notFound);
app.use(errorHandler);

connectDB();
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});