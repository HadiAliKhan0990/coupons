const express = require('express');
const app = express();
require('./connection/db');
const dotenv = require('dotenv');
dotenv.config();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
const routes = require('./routes/routes');
app.use('/api', routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
