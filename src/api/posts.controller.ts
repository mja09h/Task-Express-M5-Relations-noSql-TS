import { Request, Response, NextFunction } from "express";
import Post from "../models/Post";

const getAllPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const posts = await Post.find().populate("author", "name");
        res.status(200).json(posts);
    } catch (error) {
        next(error);
    }

};

const createPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const post = await Post.create(req.body);
        let image = null;

        if (req.file) {
            image = req.file.path;
        }

        res.status(201).json(post);
    } catch (error) {
        next(error);
    }
};

const getPostById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const post = await Post.findById(req.params.id).populate("author", "name");
        res.status(200).json(post);
    } catch (error) {
        next(error);
    }
};

const updatePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(post);
    } catch (error) {
        next(error);
    }
};

const deletePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Post deleted" });
    } catch (error) {
        next(error);
    }
};

export { getAllPosts, createPost, getPostById, updatePost, deletePost };