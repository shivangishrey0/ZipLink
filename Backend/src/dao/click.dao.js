import Click from "../models/click.model.js";

export const saveClick = async ({ url, device }) => {
    return await Click.create({ url, device });
};

export const deleteClicksByUrl = async (urlId) => {
    return await Click.deleteMany({ url: urlId });
};

export const getDailyClicks = async (urlId, from) => {
    return await Click.aggregate([
        { $match: { url: urlId, createdAt: { $gte: from } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, clicks: { $sum: 1 } } },
    ]);
};

export const getDeviceClicks = async (urlId) => {
    return await Click.aggregate([
        { $match: { url: urlId } },
        { $group: { _id: "$device", clicks: { $sum: 1 } } },
        { $sort: { clicks: -1 } },
    ]);
};


export const saveClicks = async (docs) => {
    return await Click.insertMany(docs, { ordered: false });
};
