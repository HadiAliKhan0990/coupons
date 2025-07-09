const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Coupon = sequelize.define('Coupon', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  company_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  coupon_type: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  product: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  total_available: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  claimed_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  redeemed_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  expiry_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  coupon_code: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  status: {
    type: DataTypes.ENUM('AVAILABLE', 'CLAIMED', 'REDEEMED', 'EXPIRED'),
    allowNull: false,
    defaultValue: 'AVAILABLE',
  },
  qr_code: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'coupon',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Coupon;
