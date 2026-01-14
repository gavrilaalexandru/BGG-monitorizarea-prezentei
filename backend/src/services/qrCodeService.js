const QRCode = require("qrcode");
// genereaza codul qr bazat pe codul de access
exports.generateQRCode = async (text) => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(text, {
      width: 300,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });
    return qrCodeDataURL;
  } catch (error) {
    throw new Error("Failed to generate QR code: " + error.message);
  }
};
