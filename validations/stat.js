const { query, param } = require('express-validator');

const dateRangeValidations = [
    query('startDate').notEmpty().withMessage('startDate is required'),
    query('endDate').notEmpty().withMessage('endDate is required'),
    query('couponId').notEmpty().withMessage('couponId is required'),
];

const couponIdValidations = [
    param('couponId').notEmpty().withMessage('couponId is required'),
];

module.exports = {
    dateRangeValidations,
    couponIdValidations,
};
