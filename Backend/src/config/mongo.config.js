import mongoose from "mongoose";

const connectMongoDB = async () => {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
        throw new Error("MONGO_URI is not defined.");
    }

    try {
        await mongoose.connect(mongoUri);
        console.log("MongoDB connected successfully.");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        throw error;
    }
};

export default connectMongoDB;
