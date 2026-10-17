export const saveSHortUrl = async(shortUrl,longUrl,userId)=> {
    const eewUrl= new urlSchema({
        full_url:longUrl,
        short_url:shortUrl
    })
    if(userId){
        newUrl.userId=userId
    }
    newUrl.save();
};
//data access object agr hmein database me kuch aur use krna haitoh bas ye change krna hai 