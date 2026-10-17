import { createShortUrlService, getLongUrlService, unlockUrlService } from "../services/short_url.service.js";
import { getDeviceType } from "../Utils/getDeviceType.js";
import { generateQrCode } from "../Utils/generateQrCode.js";
import config from "../config/config.js";

export const createShortUrlController = async (req, res) => {
    const { url, slug, activeFrom, expiresAt, password } = req.body ?? {};

    const shortCode = await createShortUrlService({
        url,
        slug,
        activeFrom,
        expiresAt,
        password,
        userId: req.user?._id,
    });

    const shortUrl = config.APP_URL + "/" + shortCode;
    const qrCode = await generateQrCode(shortUrl);

    return res.status(201).json({ shortUrl, qrCode });
};

// Visitors open short links in the browser, so these states land on a page of the frontend.
const STATE_PAGES = { not_active: "/not-active", expired: "/expired" };

export const redirectFromShortUrl = async (req, res) => {
    const { id } = req.params;

    const result = await getLongUrlService(id, getDeviceType(req.get("user-agent")));

    if (result.state === "protected") {
        return res.redirect(302, `${config.FRONTEND_URL}/protected/${id}`);
    }

    if (result.state !== "ok") {
        return res.redirect(302, config.FRONTEND_URL + STATE_PAGES[result.state]);
    }

    return res.redirect(302, result.url);
};

export const unlockUrlController = async (req, res) => {
    const longUrl = await unlockUrlService(
        req.params.code,
        req.body?.password,
        getDeviceType(req.get("user-agent"))
    );

    return res.json({ url: longUrl });
};
