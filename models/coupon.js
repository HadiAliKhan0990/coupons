const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    totalAvailable: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    claimedCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    redeemedCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    expiryDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    couponCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    status: {
        type: DataTypes.ENUM('available', 'claimed', 'redeemed', 'expired'),
        allowNull: false,
        defaultValue: 'available',
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
