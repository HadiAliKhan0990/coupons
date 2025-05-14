const express = require('express');
const router = express.Router();
const { processQRCodeData } = require('../utils/qrCodeScanner');

/**
 * @route POST /api/qrcode/decrypt
 * @desc Decrypt QR code data
 * @access Public
 */
router.post('/decrypt', async (req, res) => {
  try {
    const { encryptedData } = req.body;

    if (!encryptedData) {
      return res.status(400).json({
        success: false,
        message: 'Encrypted data is required'
      });
    }

    const decryptedData = processQRCodeData(encryptedData);

    return res.status(200).json({
      success: true,
      data: decryptedData
    });
  } catch (error) {
    console.error('Error decrypting QR code data:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to decrypt QR code data',
      error: error.message
    });
  }
});

module.exports = router; 