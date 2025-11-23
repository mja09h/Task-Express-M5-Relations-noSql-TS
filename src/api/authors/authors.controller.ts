import { Request, Response } from "express";
import Author from "../../models/Author";

const getAllAuthors = async (req: Request, res: Response) => {
    try {
        const authors = await Author.find();
        res.status(200).json(authors);
    } catch (error) {
        res.status(500).json({ message: "Error fetching authors" });
    }
};

const createAuthor = async (req: Request, res: Response) => {
    try {
        const author = await Author.create(req.body);
        res.status(201).json(author);
    } catch (error) {
        res.status(500).json({ message: "Error creating author" });
    }
};

const getAuthorById = async (req: Request, res: Response) => {
    try {
        const author = await Author.findById(req.params.id);
        res.status(200).json(author);
    } catch (error) {
        res.status(500).json({ message: "Error fetching author" });
    }
};

const updateAuthor = async (req: Request, res: Response) => {
    try {
        const author = await Author.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(author);
    } catch (error) {
        res.status(500).json({ message: "Error updating author" });
    }
};

const deleteAuthor = async (req: Request, res: Response) => {
    try {
        await Author.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Author deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting author" });
    }
};

export { getAllAuthors, createAuthor, getAuthorById, updateAuthor, deleteAuthor };