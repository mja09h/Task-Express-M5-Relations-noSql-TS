import express from "express";
import { createTag, deleteTag } from "./tag.controller";

const router = express.Router();

router.post("/", createTag);
router.delete("/:id", deleteTag);

export default router;