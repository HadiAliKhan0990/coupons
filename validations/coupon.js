const { body } = require('express-validator');

const couponValidations = [
  body('name').notEmpty().withMessage('Coupon name is required'),
  body('companyName').notEmpty().withMessage('Company name is required'),
  body('couponType')
    .notEmpty().withMessage('Coupon type is required')
    .isIn(['percentageDiscount', 'fixedDiscount', 'other']).withMessage('Invalid coupon type'),
  body('product').optional().isString().withMessage('Product must be a string'),
  body('description').optional().isString().withMessage('Description must be a string'),
  body('totalAvailable')
    .notEmpty().withMessage('Total available is required')
    .isInt({ min: 1 }).withMessage('Total available must be a positive integer'),
  body('expiryDate')
    .notEmpty().withMessage('Expiry date is required')
    .isISO8601().withMessage('Invalid date format'),
];

module.exports = {
  couponValidations,
};
