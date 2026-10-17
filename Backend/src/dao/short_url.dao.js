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
export const getShortUrl=async(shortUrl)=>{
    return await ShortUrl.findOne({short_url:shortUrl})
}