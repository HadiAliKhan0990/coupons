const { body, param } = require('express-validator');

const couponIdValidations = [
    param('couponId').notEmpty().withMessage('coupon is required'),
];

const questionValidations = [
    body('question').notEmpty().withMessage('Question text is required'),
    body('type').notEmpty().withMessage('Question type is required'),
];

module.exports = {
    questionValidations,
    couponIdValidations,
};
