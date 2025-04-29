const express = require('express');
const router = express.Router();

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
router.post('/', couponValidations, createCoupon);
// Get all coupons
router.get('/', getAllCoupons);
// Get single coupon
router.get('/:id', getCoupon);
// Update coupon
router.put('/:id', couponValidations, updateCoupon);
// Delete coupon
router.delete('/:id', deleteCoupon);
// Claim coupon
router.post('/:id/claim', claimCoupon);
// Redeem coupon
router.post('/:id/redeem', redeemCoupon);

module.exports = router;
