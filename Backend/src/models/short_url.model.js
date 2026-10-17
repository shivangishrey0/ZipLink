import mongoose from "mongoose";
const shortUrlSchema = new mongoose.Schema(
    {
        full_url: {
            type:String,
            required:true,
        },
        short_url: {
            type: String,
            required:true,
            index:true,//ek b-tree hota hai jisme ye dhubdhta hai aur direct nikal kar deta hai url instead of har ek ke pass jaakr match karna 
            unique:true,
        },
        clicks:{
            type:Number,
            required:true,
            default:0,
        },
        expiresAt:{
            type:Date,
        },
        activeFrom:{
            type:Date,
        },
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            index:true,
        }

    },{timestamps:true});
    // ShortUrlSchema.index({ short_url: 1},{unique: true});
    const ShortUrl = mongoose.model("ShortUrl", shortUrlSchema);
    export default ShortUrl;