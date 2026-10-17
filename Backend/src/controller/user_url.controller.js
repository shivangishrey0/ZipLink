import { getUserUrlsService, updateUserUrlService, deleteUserUrlService } from "../services/short_url.service.js";

export const getUserUrlsController = async (req, res) => {
    const result = await getUserUrlsService(req.user._id, req.query);
    return res.json(result);
};

export const updateUserUrlController = async (req, res) => {
    const url = await updateUserUrlService(req.params.id, req.user._id, req.body ?? {});
    return res.json({ url });
};

export const deleteUserUrlController = async (req, res) => {
    await deleteUserUrlService(req.params.id, req.user._id);
    return res.json({ message: "URL deleted." });
};
