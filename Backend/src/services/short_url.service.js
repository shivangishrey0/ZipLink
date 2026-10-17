import { generateNanoId } from "../Utils/helper.js";
import { validateUrl } from "../Utils/validateUrl.js";
import { saveShortUrl } from "../dao/short_url.dao.js";

export const createShortUrlService = async (url) => {
    const validUrl = validateUrl(url);
    const shortUrl = await generateNanoId(7);
    await saveShortUrl(shortUrl,validUrl);
    return shortUrl;
};
export const createShortUrlWithoutUser = async (url) => {
    const shortUrl = await generateNanoId(7);
    await saveShortUrl(shortUrl,url);
    return shortUrl;
};
export const createShortUrlWithUser = async (url,userId) => {
    const shortUrl = await generateNanoId(7);
    await saveShortUrl(shortUrl,url,userId);
    return shortUrl;
};


