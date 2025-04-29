const couponRoutes = require('./couponRoutes');

const express = require('express');

const app = express();

// Middleware to parse JSON
app.use(express.json());

// test routes to check if server is running
app.get('/api/test', (req, res) => {
  res.status(200).json({ message: 'API is working!' });
});

app.use('/api/coupon', couponRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
