const express = require('express');
const router = express.Router();

const { authorizeMiddleware } = require('../middlewares/authorize');

const roles = require('../utils/role');

const {
  getAllCoupons,
  saveCoupon,
} = require('../controllers/couponController');

const { couponValidations } = require('../validations/coupon');

router.get('/', authorizeMiddleware([roles.Admin]), getAllCoupons);

router.post(
  '/',
  authorizeMiddleware([roles.Admin]),
  couponValidations,
  saveCoupon
);

module.exports = router;
