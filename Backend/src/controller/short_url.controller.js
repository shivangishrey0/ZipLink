import { createShortUrlService, getLongUrlService } from "../services/short_url.service.js";
import { getDeviceType } from "../Utils/getDeviceType.js";
import { generateQrCode } from "../Utils/generateQrCode.js";
import config from "../config/config.js";

export const createShortUrlController = async (req, res) => {
    const { url, slug, activeFrom, expiresAt } = req.body ?? {};

    const shortCode = await createShortUrlService({
        url,
        slug,
        activeFrom,
        expiresAt,
        userId: req.user?._id,
    });

    const shortUrl = config.APP_URL + "/" + shortCode;
    const qrCode = await generateQrCode(shortUrl);

    return res.status(201).json({ shortUrl, qrCode });
};
export const redirectFromShortUrl = async (req, res) => {
    const { id } = req.params;

    const longUrl = await getLongUrlService(id, getDeviceType(req.get("user-agent")));
    return res.redirect(302, longUrl);
};
