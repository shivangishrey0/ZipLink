const TABLET_PATTERN = /ipad|tablet|playbook|silk|android(?!.*mobile)/i;
const MOBILE_PATTERN = /mobi|iphone|ipod|android|blackberry|opera mini|iemobile/i;

export const getDeviceType = (userAgent = "") => {
    if (TABLET_PATTERN.test(userAgent)) {
        return "tablet";
    }

    if (MOBILE_PATTERN.test(userAgent)) {
        return "mobile";
    }

    return "desktop";
};
