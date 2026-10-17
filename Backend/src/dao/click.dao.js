import Click from "../models/click.model.js";

export const saveClick = async ({ url, device }) => {
    return await Click.create({ url, device });
};

export const deleteClicksByUrl = async (urlId) => {
    return await Click.deleteMany({ url: urlId });
};
