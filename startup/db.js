const winston = require('winston');
const mongoose = require('mongoose');

module.exports = function () {
  mongoose
    .connect('mongodb://localhost:27017/yusufDb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => winston.info(`Connected to 3000...`));
};

// ('mongodb://localhost:27017/yusufDb');
// process.env.DB_URL
