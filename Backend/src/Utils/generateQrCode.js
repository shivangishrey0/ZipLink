import QRCode from "qrcode";

// Returns a "data:image/png;base64,..." string that an <img src> can show directly.
export const generateQrCode = (text) => {
    return QRCode.toDataURL(text, { margin: 1, width: 300 });
};
