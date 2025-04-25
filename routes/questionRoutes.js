const express = require('express');

const { authorizeMiddleware } = require('../middlewares/authorize');

const roles = require('../utils/role');

const {
  createQuestionForCoupon,
  getQuestionsForCoupon,
  updateQuestion,
} = require('../controllers/questionController');

const {
  questionValidations,
  couponIdValidations,
  questionIdValidations,
} = require('../validations/question');

const router = express.Router();

router.get('/:couponId', couponIdValidations, getQuestionsForCoupon);

router.post(
  '/:couponId',
  authorizeMiddleware([roles.Admin]),
  questionValidations,
  createQuestionForCoupon
);

router.put(
  '/:questionId',
  authorizeMiddleware([roles.Admin]),
  questionIdValidations,
  updateQuestion
);

module.exports = router;
