import mongoose from "mongoose";

export default async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connect db success");
    } catch (error) {
        console.error(`Fail to connect db error: ${error.message}`);
    }
}