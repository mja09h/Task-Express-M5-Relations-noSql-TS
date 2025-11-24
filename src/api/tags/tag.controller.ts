import { Request, Response } from "express";
import Tag from "../../models/Tag";
import Post from "../../models/Post";

const createTag = async (req: Request, res: Response) => {
    try {
        const tag = await Tag.create(req.body);
        res.status(201).json(tag);
    } catch (error) {
        res.status(500).json({ message: "Error creating tag" });
    }
};

const deleteTag = async (req: Request, res: Response) => {
    try {
        await Tag.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Tag deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting tag" });
    }
};

const addTagToPost = async (req: Request, res: Response) => {
    try {
        const { postId, tagId } = req.params;
        const findTag = await Tag.findByIdAndUpdate(tagId, {
            $push: { posts: postId },
        });

        const findPost = await Post.findByIdAndUpdate(postId, {
            $push: { tags: tagId },
        });

        res.status(200).json({ message: "Tag added to post" });
    } catch (error) {
        res.status(500).json({ message: "Error adding tag to post" });
    }
};

export { createTag, deleteTag, addTagToPost };