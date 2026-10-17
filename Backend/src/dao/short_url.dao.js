import ShortUrl from "../models/short_url.model.js";

export const saveShortUrl = async({shortUrl,longUrl,userId,expiresAt,activeFrom})=> {
    const newUrl= new ShortUrl({
        full_url:longUrl,
        short_url:shortUrl,
        expiresAt,
        activeFrom
    })
    if(userId){
        newUrl.user=userId
    }
    await newUrl.save();
};
//data access object agr hmein database me kuch aur use krna haitoh bas ye change krna hai
export const incrementClicks=async(id)=>{
    return await ShortUrl.updateOne({_id:id},{$inc:{clicks:1}})
}
export const getShortUrl=async(shortUrl)=>{
    return await ShortUrl.findOne({short_url:shortUrl})
}
export const findUrlsByUser=async(userId,skip,limit)=>{
    return await ShortUrl.find({user:userId}).sort({_id:-1}).skip(skip).limit(limit).lean()
}
export const countUrlsByUser=async(userId)=>{
    return await ShortUrl.countDocuments({user:userId})
}
