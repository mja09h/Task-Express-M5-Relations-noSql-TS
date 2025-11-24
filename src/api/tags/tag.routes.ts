import express from "express";
import { createTag, deleteTag, addTagToPost } from "./tag.controller";

const router = express.Router();

router.post("/", createTag);
router.delete("/:id", deleteTag);
router.post("/:id/posts", addTagToPost);

export default router;