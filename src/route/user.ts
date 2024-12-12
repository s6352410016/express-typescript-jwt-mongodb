import express from "express";
import {
    signUp,
    signIn,
    profile
} from "../controller/user";
import { auth } from "../middleware/auth";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/profile", auth, profile);

export default router;