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
  getBusinessStats
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
router.post('/redeem', redeemCoupon);
// Get business statistics
router.get('/business/:companyName/stats', getBusinessStats);

module.exports = router;
