const { DataTypes } = require('sequelize');
const sequelize = require('../connection');

const Coupon = sequelize.define('Coupon', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    companyName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    couponType: {
        type: DataTypes.ENUM('percentageDiscount', 'fixedDiscount', 'other'),
        allowNull: false,
    },
    product: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    totalAvailable: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    claimedCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    redeemedCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    expiryDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    qrCode: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    tableName: 'coupon',
    timestamps: true,
});

module.exports = Coupon;
