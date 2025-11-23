import { Request, Response } from "express";
import Tag from "../../models/Tag";

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



export { createTag, deleteTag };