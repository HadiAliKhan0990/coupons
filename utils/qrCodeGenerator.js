const QRCode = require('qrcode');
const { encryptData } = require('./encryption');

/**
 * Generate a QR code data URL for a coupon
 * @param {Object} couponData - The coupon data to encode in the QR code
 * @returns {Promise<string>} - A promise that resolves to the QR code data URL
 */
const generateCouponQRCode = async (couponData) => {
  try {
    // Extract only the necessary data for the QR code
    const qrPayload = {
      couponCode: couponData.couponCode,
      name: couponData.name,
      companyName: couponData.companyName,
      product: couponData.product,
      expiryDate: couponData.expiryDate
    };

    // Encrypt the payload before generating QR code
    const encryptedPayload = encryptData(qrPayload);

    // Generate the QR code with high error correction
    const qrCode = await QRCode.toDataURL(encryptedPayload, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 300,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });

    return qrCode;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};

module.exports = {
  generateCouponQRCode
}; 