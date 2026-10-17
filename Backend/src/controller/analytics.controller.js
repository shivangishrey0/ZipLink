import { getAnalyticsService } from "../services/analytics.service.js";

export const getAnalyticsController = async (req, res) => {
    const analytics = await getAnalyticsService(req.params.code, req.user._id);
    return res.json(analytics);
};
