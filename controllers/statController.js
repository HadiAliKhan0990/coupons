const Coupon = require('../models/coupon');
const Question = require('../models/question');
const Rating = require('../models/rating');
const { HTTP_STATUS_CODE } = require('../utils/constants');
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');

const getQuestionStats = async (req, res) => {
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

        const questionIds = Array.from(coupon.Questions, ({ id }) => id);

        // Get average rating for each question
        const stats = await Promise.all(
            questionIds.map(async (questionId) => {
                const ratings = await Rating.findAll({
                    where: { questionId },
                });

                const averageRating =
                    ratings.reduce((sum, rating) => sum + rating.rating, 0) /
                    ratings.length;

                return {
                    questionId,
                    averageRating: isNaN(averageRating) ? 0 : averageRating,
                    totalRatings: ratings.length,
                };
            })
        );

        res.status(HTTP_STATUS_CODE.OK).json({
            message: 'Statistics retrieved successfully',
            stats,
        });
    } catch (error) {
        console.error('Error getting statistics:', error);
        res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            message: 'Error getting statistics',
        });
    }
};

const getQuestionStatsByDateRange = async (req, res) => {
    try {
        const { startDate, endDate, couponId } = req.query;

        // Check if the coupon exists
        const coupon = await Coupon.findByPk(couponId, {
            include: [Question],
        });

        if (!coupon) {
            return res
                .status(HTTP_STATUS_CODE.NOT_FOUND)
                .json({ message: 'Coupon not found' });
        }

        const questionIds = Array.from(coupon.Questions, ({ id }) => id);

        // Get average rating for each question within the date range
        const stats = await Promise.all(
            questionIds.map(async (questionId) => {
                const ratings = await Rating.findAll({
                    where: {
                        questionId,
                        createdAt: {
                            [Op.between]: [startDate, endDate],
                        },
                    },
                });

                const averageRating =
                    ratings.reduce((sum, rating) => sum + rating.rating, 0) /
                    ratings.length;

                return {
                    questionId,
                    averageRating: isNaN(averageRating) ? 0 : averageRating,
                    totalRatings: ratings.length,
                };
            })
        );

        res.status(HTTP_STATUS_CODE.OK).json({
            message: 'Statistics retrieved successfully',
            stats,
        });
    } catch (error) {
        console.error('Error getting statistics:', error);
        res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            message: 'Error getting statistics',
        });
    }
};

const getTotalRatingsForQuestions = async (req, res) => {
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
      include: Question, // Include associated questions
    });

    if (!coupon) {
      return res
        .status(HTTP_STATUS_CODE.BAD_REQUEST)
        .json({ message: 'Coupon not found' });
    }

    const questionIds = Array.from(coupon.Questions, ({ id }) => id);

    if (!Array.isArray(questionIds) || questionIds.length === 0) {
      return res
        .status(HTTP_STATUS_CODE.BAD_REQUEST)
        .json({ message: 'questionIds must be a non-empty array' });
    }

    // Fetch all ratings where questionId is in the questionIds array
    const ratings = await Rating.findAll({
      where: { questionId: { [Op.in]: questionIds } },
    });

    // Group ratings by questionId and calculate total rating for each question
    const ratingsMap = {};

    ratings.forEach(({ questionId, rating }) => {
      if (!ratingsMap[questionId]) {
        ratingsMap[questionId] = 0;
      }
      ratingsMap[questionId] += rating;
    });

    // Prepare the response data
    const results = questionIds.map((questionId) => ({
      questionId,
      totalRating: ratingsMap[questionId] || 0, // Default to 0 if no ratings found
    }));

    return res.status(HTTP_STATUS_CODE.OK).json({
      message: 'Ratings fetched successfully',
      data: results,
    });
  } catch (error) {
    res.status(HTTP_STATUS_CODE.INTERNAL_SERVER).json({
      message: 'Error fetching ratings',
      error: error.message,
    });
  }
};

const getRatingsByDateRange = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(HTTP_STATUS_CODE.BAD_REQUEST)
      .json({ errors: errors.array() });
  }

  try {
    const { startDate, endDate, couponId } = req.query;

    // Check if the coupon exists
    const coupon = await Coupon.findByPk(couponId, {
      include: Question, // Include associated questions
    });

    if (!coupon) {
      return res
        .status(HTTP_STATUS_CODE.BAD_REQUEST)
        .json({ message: 'Coupon not found' });
    }

    const questionIds = Array.from(coupon.Questions, ({ id }) => id);

    const ratings = await Rating.findAll({
      where: {
        updatedAt: {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        },
        questionId: {
          [Op.in]: questionIds,
        },
      },
    });

    // Group ratings by questionId and calculate total rating for each question
    const ratingsMap = {};

    ratings.forEach(({ questionId, rating }) => {
      if (!ratingsMap[questionId]) {
        ratingsMap[questionId] = 0;
      }
      ratingsMap[questionId] += rating;
    });

    // Prepare the response data
    const results = questionIds.map((questionId) => ({
      questionId,
      totalRating: ratingsMap[questionId] || 0, // Default to 0 if no ratings found
    }));

    return res.status(HTTP_STATUS_CODE.OK).json({
      message: 'Success',
      data: results,
    });
  } catch (error) {
    console.error('Error fetching ratings:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  getQuestionStats,
  getQuestionStatsByDateRange,
  getTotalRatingsForQuestions,
  getRatingsByDateRange,
};
