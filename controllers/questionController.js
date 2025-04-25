const Coupon = require('../models/coupon');
const Question = require('../models/question');
const { HTTP_STATUS_CODE } = require('../utils/constants');
const { validationResult } = require('express-validator');

const getQuestionsForCoupon = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(HTTP_STATUS_CODE.BAD_REQUEST)
      .json({ errors: errors.array() });
  }

  try {
    const { couponId } = req.params;

    // Check if the coupon exists
    const coupon = await Coupon.findByPk(couponId, {
      include: [Question],
    });

    if (!coupon) {
      return res
        .status(HTTP_STATUS_CODE.NOT_FOUND)
        .json({ message: 'Coupon not found' });
    }

    res.status(HTTP_STATUS_CODE.OK).json({ questions: coupon.Questions }); // Send questions in response
  } catch (error) {
    console.error('Error getting questions:', error);
    res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      message: 'Error getting questions',
    });
  }
};

const createQuestionForCoupon = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(HTTP_STATUS_CODE.BAD_REQUEST)
      .json({ errors: errors.array() });
  }

  try {
    const { question, type } = req.body;
    const { couponId } = req.params;

    // Check if the coupon exists
    const coupon = await Coupon.findByPk(couponId);
    if (!coupon) {
      return res
        .status(HTTP_STATUS_CODE.NOT_FOUND)
        .json({ message: 'Coupon not found' });
    }

    // Create the question
    const newQuestion = await Question.create({
      question,
      type,
    });

    // Associate the question with the coupon
    await coupon.addQuestion(newQuestion);

    res.status(HTTP_STATUS_CODE.CREATED).json({
      message: 'Question created successfully',
      question: newQuestion,
    });
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      message: 'Error creating question',
    });
  }
};

// Update a question by ID
const updateQuestion = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(HTTP_STATUS_CODE.BAD_REQUEST)
      .json({ errors: errors.array() });
  }

  try {
    const { questionId } = req.params;
    const { text } = req.body;

    // Find the question by ID
    const question = await Question.findByPk(questionId);
    if (!question) {
      return res
        .status(HTTP_STATUS_CODE.NOT_FOUND)
        .json({ message: 'Question not found' });
    }

    // Update the question text
    question.text = text;
    await question.save();

    res
      .status(HTTP_STATUS_CODE.OK)
      .json({ message: 'Question updated successfully', question });
  } catch (error) {
    console.error('Error updating question:', error);
    res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER)
      .json({ message: 'Internal server error' });
  }
};

module.exports = {
  createQuestionForCoupon,
  getQuestionsForCoupon,
  updateQuestion,
};
