import { Request, Response, NextFunction } from "express";
import Tag from "../../models/Tag";
import Post from "../../models/Post";

const createTag = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tag = await Tag.create(req.body);
        res.status(201).json(tag);
    } catch (error) {
        next(error);
    }
};

const deleteTag = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await Tag.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Tag deleted" });
    } catch (error) {
        next(error);
    }
};

const addTagToPost = async (req: Request, res: Response, next: NextFunction) => {
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
        next(error);
    }
};

export { createTag, deleteTag, addTagToPost };