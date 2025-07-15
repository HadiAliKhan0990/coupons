const couponRoutes = require('./couponRoutes');
const express = require('express');
const router = express.Router();

// CORS preflight handler for all routes
router.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

// Additional CORS headers middleware for all routes
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// test routes to check if server is working
router.get('/test', (req, res) => {
  res.status(200).json({ message: 'API is working!' });
});

router.use('/coupon', couponRoutes);

module.exports = router;
