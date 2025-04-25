const { body } = require('express-validator');

const couponValidations = [
    body('name').notEmpty().withMessage('Coupon name is required'),
    body('heading').notEmpty().withMessage('Coupon heading is required'),
    body('code').notEmpty().withMessage('Coupon code is required'),
    body('discount')
        .notEmpty()
        .withMessage('Discount amount is required')
        .isFloat({ min: 0, max: 100 })
        .withMessage('Discount must be between 0 and 100'),
    body('expiryDate')
        .notEmpty()
        .withMessage('Expiry date is required')
        .isISO8601()
        .withMessage('Invalid date format'),
];

module.exports = { couponValidations };
