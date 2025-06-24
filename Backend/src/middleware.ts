import { NextFunction, Request, Response } from "express";
import { JWT_SECRET } from "./config";
import jwt, { JwtPayload } from "jsonwebtoken";

export const userMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"];
    const decoded = jwt.verify(header as string, JWT_SECRET);

    if (decoded) {
        if(typeof decoded === "string") {
            res.status(403).json({
                message: "You are not logged in"
            })
            return;
        }
        req.userId = (decoded as JwtPayload).id;
        next();
    } else {
        res.status(403).json({ message: "Unauthorized User" });
    }
};
