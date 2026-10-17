import mongoose from "mongoose";

const clickSchema = new mongoose.Schema(
    {
        url: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ShortUrl",
            required: true,
        },
        device: {
            type: String,
            enum: ["desktop", "mobile", "tablet"],
            required: true,
        },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

// Every analytics query filters by link and a time range, so one compound index serves them all.
clickSchema.index({ url: 1, createdAt: 1 });

const Click = mongoose.model("Click", clickSchema);
export default Click;
