import { nanoid } from "nanoid";
import ShortUrl from "../models/short_url.model.js";

export const createShortUrlService = async (url) => {
    const shortUrl = await generateNanoId(7);
    await saveUrl(url,shortUrl);
    return shortUrl;
};
export const createShortUrlWithoutUser = async (url) => {
    const shortUrl = await generateNanoId(7);
    await saveUrl(shortUrl,url);
    return shortUrl;
};
export const createShortUrlWithUser = async (url,userId) => {
    const shortUrl = await generateNanoId(7);
    await saveUrl(url,shortUrl,userId);
    return shortUrl;
};


