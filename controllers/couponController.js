const Coupon = require('../models/coupon');
const { validationResult } = require('express-validator');
const { HTTP_STATUS_CODE } = require('../utils/constants');

const saveCoupon = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(HTTP_STATUS_CODE.BAD_REQUEST)
      .json({ errors: errors.array() });
  }

  try {
    const { name, heading, code, discount, expiryDate } = req.body;

    const newCoupon = await Coupon.create({
      name,
      heading,
      code,
      discount,
      expiryDate,
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
    const coupons = await Coupon.findAll();
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

module.exports = { saveCoupon, getAllCoupons };
