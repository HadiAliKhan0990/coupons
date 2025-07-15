const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middlewares/authMiddleware');

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
router.post('/', verifyToken, requireAdmin, couponValidations, createCoupon);
// Get all coupons
router.get('/', verifyToken, getAllCoupons);
// Get single coupon
router.get('/:id', verifyToken, getCoupon);
// Update coupon
router.put('/:id', verifyToken, requireAdmin, couponValidations, updateCoupon);
// Delete coupon
router.delete('/:id', verifyToken, requireAdmin, deleteCoupon);
// Claim coupon
router.post('/:id/claim', verifyToken,claimCoupon);
// Redeem coupon
router.post('/redeem', verifyToken, redeemCoupon);
// Get business statistics
router.get('/business/:company_name/stats', verifyToken, requireAdmin, getBusinessStats);

module.exports = router;
