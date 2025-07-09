const Coupon = require('../models/coupon');
const { validationResult } = require('express-validator');
const { HTTP_STATUS_CODE } = require('../utils/httpStatus');
const crypto = require('crypto');
const { Op } = require('sequelize');
const sequelize = require('../config/database');
const { generateCouponQRCode } = require('../utils/qrCodeGenerator');

// Generate a unique coupon code
const generateCouponCode = () => {
  return crypto.randomBytes(8).toString('hex').toUpperCase();
};

// Create a new coupon
const createCoupon = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ errors: errors.array() });
  }
  try {
    const {
      name,
      company_name,
      coupon_type,
      product,
      description,
      total_available,
      expiry_date
    } = req.body;

    // Generate a unique coupon code
    const coupon_code = generateCouponCode();
    
    // Create the coupon
    const newCoupon = await Coupon.create({
      name,
      company_name,
      coupon_type,
      product,
      description,
      total_available,
      expiry_date,
      coupon_code,
      status: 'AVAILABLE',
      claimed_count: 0,
      redeemed_count: 0
    });

    // Generate QR code for the coupon
    const qrCode = await generateCouponQRCode(newCoupon);

    newCoupon.qr_code = qrCode;
    await newCoupon.save();

    // Return the coupon with the QR code
    res.status(HTTP_STATUS_CODE.CREATED).json({
      message: 'Coupon created successfully',
      newCoupon
    });
  } catch (error) {
    console.error('Error creating coupon:', error);
    res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      message: 'Error creating coupon',
    });
  }
};

const getAllCoupons = async (req, res) => {
  try {
    const onlyAvailable = req.query.available === 'true';
    let where = {};
    if (onlyAvailable) {
      where = {
        total_available: { [Op.gt]: 0 },
        expiry_date: { [Op.gt]: new Date() },
        status: 'AVAILABLE'
      };
    }
    const coupons = await Coupon.findAll({ where });
    
    // Generate QR codes for all coupons
    const couponsWithQR = await Promise.all(
      coupons.map(async (coupon) => {
        const qrCode = await generateCouponQRCode(coupon);
        return {
          ...coupon.toJSON(),
          qrCode
        };
      })
    );
    
    res.status(HTTP_STATUS_CODE.OK).json({
      message: 'Coupons retrieved successfully',
      coupons: couponsWithQR,
    });
  } catch (error) {
    console.error('Error retrieving coupons:', error);
    res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      message: 'Error retrieving coupons',
    });
  }
};

const getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id);
    if (!coupon) {
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({ message: 'Coupon not found' });
    }
    
    // Generate QR code for the coupon
    const qrCode = await generateCouponQRCode(coupon);
    
    res.status(HTTP_STATUS_CODE.OK).json({ 
      coupon: {
        ...coupon.toJSON(),
        qrCode
      }
    });
  } catch (error) {
    console.error('Error retrieving coupon:', error);
    res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: 'Error retrieving coupon' });
  }
};

const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id);
    if (!coupon) {
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({ message: 'Coupon not found' });
    }
    await coupon.update(req.body);
    return res.status(HTTP_STATUS_CODE.OK).json({ message: 'Coupon updated', coupon });
  } catch (error) {
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: 'Error updating coupon' });
  }
};

// DELETE coupon
const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id);
    if (!coupon) {
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({ message: 'Coupon not found' });
    }
    await coupon.destroy();
    return res.status(HTTP_STATUS_CODE.OK).json({ message: 'Coupon deleted' });
  } catch (error) {
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: 'Error deleting coupon' });
  }
};

// CLAIM coupon (decrement available, increment claimed)
const claimCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id);
    if (!coupon) {
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({ message: 'Coupon not found' });
    }

    // Check if coupon is available
    if (coupon.status !== 'AVAILABLE') {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ 
        message: 'Coupon is not available for claiming' 
      });
    }

    // Check if coupon is expired
    if (new Date(coupon.expiry_date) < new Date()) {
      coupon.status = 'EXPIRED';
      await coupon.save();
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ 
        message: 'Coupon has expired' 
      });
    }

    // Check if there are any coupons available to claim
    if (coupon.total_available <= coupon.claimed_count) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ 
        message: 'No more coupons available to claim' 
      });
    }

    coupon.claimed_count += 1;
    coupon.status = 'CLAIMED';
    await coupon.save();

    // Generate QR code for the claimed coupon
    const qrCode = await generateCouponQRCode(coupon);

    res.status(HTTP_STATUS_CODE.OK).json({ 
      message: 'Coupon claimed successfully', 
      coupon: {
        ...coupon.toJSON(),
        qrCode
      }
    });
  } catch (error) {
    console.error('Error claiming coupon:', error);
    res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({ 
      message: 'Error claiming coupon' 
    });
  }
};

// REDEEM coupon
const redeemCoupon = async (req, res) => {
  try {
    const { coupon_code } = req.body;
    
    if (!coupon_code) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        message: 'Please provide the coupon code'
      });
    }

    const coupon = await Coupon.findOne({ where: { coupon_code } });
    if (!coupon) {
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
        message: 'Coupon not found'
      });
    }

    // Check if coupon is already redeemed
    if (coupon.status === 'REDEEMED') {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        message: 'Coupon has already been redeemed'
      });
    }

    // Check if coupon is expired
    if (new Date(coupon.expiry_date) < new Date()) {
      coupon.status = 'EXPIRED';
      await coupon.save();
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        message: 'Coupon has expired'
      });
    }

    // Check if coupon is claimed
    if (coupon.status !== 'CLAIMED') {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        message: 'Coupon must be claimed before redemption'
      });
    }

    coupon.redeemed_count += 1;
    coupon.status = 'REDEEMED';
    await coupon.save();

    // Generate QR code for the redeemed coupon
    const qrCode = await generateCouponQRCode(coupon);

    res.status(HTTP_STATUS_CODE.OK).json({
      message: 'Coupon redeemed successfully',
      coupon: {
        ...coupon.toJSON(),
        qrCode
      }
    });
  } catch (error) {
    console.error('Error redeeming coupon:', error);
    res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      message: 'Error redeeming coupon'
    });
  }
};

// Get business statistics
const getBusinessStats = async (req, res) => {
  try {
    const { company_name } = req.params;
    
    const stats = await Coupon.findAll({
      where: { company_name },
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'total_coupons'],
        [sequelize.fn('SUM', sequelize.col('claimed_count')), 'total_claimed'],
        [sequelize.fn('SUM', sequelize.col('redeemed_count')), 'total_redeemed'],
      ],
      raw: true
    });
    
    res.status(HTTP_STATUS_CODE.OK).json({
      message: 'Business statistics retrieved successfully',
      stats: stats[0]
    });
  } catch (error) {
    console.error('Error retrieving business statistics:', error);
    res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      message: 'Error retrieving business statistics'
    });
  }
};

module.exports = {
  createCoupon,
  getAllCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
  claimCoupon,
  redeemCoupon,
  getBusinessStats
};
