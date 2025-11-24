import { Request, Response, NextFunction } from "express";

const notFound = (req: Request, res: Response, next: NextFunction) => {
    console.log(`${req.url} Not Found`);
    res.status(404).json({ message: "Route not found" });
};

export default notFound;