import * as express from "express";
import { Request, Response } from "express";
import { UserModel } from "../model/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                fullname: string;
                email: string;
            }
        }
    }
}

export const signUp = async (req: Request, res: Response) => {
    const { fullname, username, password, email } = req.body;
    try {
        const hashPassword = await bcrypt.hash(password, 10);
        const user = new UserModel({
            fullname,
            username,
            password: hashPassword,
            email
        });
        await user.save();
        res.status(201).send("Signup success");
    } catch (error) {
        console.error(error.message);

        if (error?.code === 11000) {
            // error จากการ insert ข้อมูลที่ซ้ำกันกับคุณสมบัติของ unique key 
            res.status(500).send("Unable to insert data with duplicate fields");
            return;
        }

        res.status(500).send(error.message);
        return;
    }
}

export const signIn = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        const user = await UserModel.findOne({
            username
        });
        if (user && (await bcrypt.compare(password, user.password))) {
            const payload = {
                id: user._id,
                fullname: user.fullname,
                email: user.email
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "1h"
            });
            res.cookie("token", token, {
                httpOnly: true
            });
            res.status(200).send("Signin success");
            return;
        }

        res.status(401).send("Invalid username or password");
    } catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
}

export const profile = async (req: Request, res: Response) => {
    const user = req.user;
    try {
        const userRes = await UserModel.findById(user.id).select("_id fullname username email");
        res.status(200).json(userRes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
}