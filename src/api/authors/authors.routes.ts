import express from "express";
import { getAllAuthors, createAuthor, getAuthorById, updateAuthor, deleteAuthor } from "./authors.controller";

const router = express.Router();

router.get("/", getAllAuthors);
router.post("/", createAuthor);
router.get("/:id", getAuthorById);
router.put("/:id", updateAuthor);
router.delete("/:id", deleteAuthor);

export default router;