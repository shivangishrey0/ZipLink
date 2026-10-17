import ShortUrl from "../models/short_url.model.js";

export const saveShortUrl = async(shortUrl,longUrl,userId)=> {
    const newUrl= new ShortUrl({
        full_url:longUrl,
        short_url:shortUrl
    })
    if(userId){
        newUrl.user=userId
    }
    await newUrl.save();
};
//data access object agr hmein database me kuch aur use krna haitoh bas ye change krna hai
