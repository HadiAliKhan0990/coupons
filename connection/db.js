const sequelize = require('../config/database');

sequelize
  .authenticate()
  .then(() => {
    console.log('Database connected...');
    // Sync the models only if connection successful
    return sequelize.sync({ alter: true });
  })
  .then(() => console.log('Database synchronized with models'))
  .catch((err) => {
    console.warn('Database not available. Service will start but database operations will fail:', err.message);
    console.warn('Please configure database credentials in .env file');
  });
