import { getUserUrlsService } from "../services/short_url.service.js";

export const getUserUrlsController = async (req, res) => {
    const result = await getUserUrlsService(req.user._id, req.query);
    return res.json(result);
};
