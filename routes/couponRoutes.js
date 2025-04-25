const express = require('express');
const router = express.Router();

const { authorizeMiddleware } = require('../middlewares/authorize');

const roles = require('../utils/role');

const {
  createCoupon,
  getAllCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
  claimCoupon,
  redeemCoupon,
} = require('../controllers/couponController');

const { couponValidations } = require('../validations/coupon');

// Create coupon
router.post('/', authorizeMiddleware([roles.Admin]), couponValidations, createCoupon);
// Get all coupons
router.get('/', getAllCoupons);
// Get single coupon
router.get('/:id', getCoupon);
// Update coupon
router.put('/:id', authorizeMiddleware([roles.Admin]), couponValidations, updateCoupon);
// Delete coupon
router.delete('/:id', authorizeMiddleware([roles.Admin]), deleteCoupon);
// Claim coupon
router.post('/:id/claim', claimCoupon);
// Redeem coupon
router.post('/:id/redeem', redeemCoupon);

module.exports = router;
