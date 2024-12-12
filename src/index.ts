import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import conn from "./db/conn";
import userRouter from "./route/user";
import dotenv from "dotenv";

const PORT = process.env.PORT || 8080;
const app = express();

dotenv.config();
conn();
app.use(cors({
    credentials: true
}));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use("/api", userRouter);

app.listen(PORT, () => {
    console.log(`Server running port ${PORT}`);
});