import { Request, Response, NextFunction } from "express";
import Author from "../../models/Author";

const getAllAuthors = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authors = await Author.find().populate("posts");
        res.status(200).json(authors);
    } catch (error) {
        next(error);
    }
};

const createAuthor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const author = await Author.create(req.body);
        res.status(201).json(author);
    } catch (error) {
        next(error);
    }
};

const getAuthorById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const author = await Author.findById(req.params.id);
        
        res.status(200).json(author);
    } catch (error) {
        next(error);
    }
};

const updateAuthor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const author = await Author.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(author);
    } catch (error) {
        next(error);
    }
};

const deleteAuthor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await Author.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Author deleted" });
    } catch (error) {
        next(error);
    }
};

export { getAllAuthors, createAuthor, getAuthorById, updateAuthor, deleteAuthor };