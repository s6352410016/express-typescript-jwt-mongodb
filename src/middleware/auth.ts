import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface User {
    id: string;
    fullname: string;
    email: string;
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.token;
    if (!token) {
        res.sendStatus(401)
        return;
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
        res.sendStatus(401)
        return;
    }

    req.user = decode as User;
    next();
}