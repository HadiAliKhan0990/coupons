const Coupon = require('./coupon');
const Question = require('./question');
const { Association } = require('sequelize');
const Rating = require('./rating');
const User = require('./user');

const defineAssociations = () => {
  // coupon and question relationship
  Coupon.belongsToMany(Question, { through: 'CouponQuestion' });
  Question.belongsToMany(Coupon, { through: 'CouponQuestion' });

  // Rating Model Association
  Rating.belongsTo(Question, { foreignKey: 'questionId', onDelete: 'CASCADE' });
  Question.hasMany(Rating, { foreignKey: 'questionId', onDelete: 'CASCADE' });

  Rating.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
  User.hasMany(Rating, { foreignKey: 'userId', onDelete: 'CASCADE' });
};

module.exports = defineAssociations;
