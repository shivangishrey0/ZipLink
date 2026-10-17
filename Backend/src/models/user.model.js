import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            select: false, // never returned by queries unless asked for with .select("+password")
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true, // many users have no googleId, sparse lets them all stay empty
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
