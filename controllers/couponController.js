const Coupon = require('../models/coupon');
const { validationResult } = require('express-validator');
const { HTTP_STATUS_CODE } = require('../utils/constants');
const QRCode = require('qrcode');

const createCoupon = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ errors: errors.array() });
  }
  try {
    const {
      name,
      companyName,
      couponType,
      product,
      description,
      totalAvailable,
      expiryDate
    } = req.body;

    const qrPayload = `${name}-${companyName}-${Date.now()}`;
    const qrCode = await QRCode.toDataURL(qrPayload);

    const newCoupon = await Coupon.create({
      name,
      companyName,
      couponType,
      product,
      description,
      totalAvailable,
      expiryDate,
      qrCode,
    });
    res.status(HTTP_STATUS_CODE.CREATED).json({
      message: 'Coupon created successfully',
      coupon: newCoupon,
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
        totalAvailable: { $gt: 0 },
        expiryDate: { $gt: new Date() },
        isActive: true,
      };
    }
    const coupons = await Coupon.findAll({ where });
    res.status(HTTP_STATUS_CODE.OK).json({
      message: 'Coupons retrieved successfully',
      coupons,
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
    res.status(HTTP_STATUS_CODE.OK).json({ coupon });
  } catch (error) {
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
    res.status(HTTP_STATUS_CODE.OK).json({ message: 'Coupon updated', coupon });
  } catch (error) {
    res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: 'Error updating coupon' });
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
    res.status(HTTP_STATUS_CODE.OK).json({ message: 'Coupon deleted' });
  } catch (error) {
    res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: 'Error deleting coupon' });
  }
};

// CLAIM coupon (decrement available, increment claimed)
const claimCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id);
    if (!coupon) {
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({ message: 'Coupon not found' });
    }
    if (coupon.totalAvailable - coupon.claimedCount <= 0) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ message: 'No more coupons available to claim' });
    }
    coupon.claimedCount += 1;
    await coupon.save();
    res.status(HTTP_STATUS_CODE.OK).json({ message: 'Coupon claimed', coupon });
  } catch (error) {
    res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: 'Error claiming coupon' });
  }
};

// REDEEM coupon (increment redeemedCount, only if claimedCount > redeemedCount)
const redeemCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id);
    if (!coupon) {
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({ message: 'Coupon not found' });
    }
    if (coupon.redeemedCount >= coupon.claimedCount) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ message: 'No claimed coupons available to redeem' });
    }
    coupon.redeemedCount += 1;
    await coupon.save();
    res.status(HTTP_STATUS_CODE.OK).json({ message: 'Coupon redeemed', coupon });
  } catch (error) {
    res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: 'Error redeeming coupon' });
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
};
