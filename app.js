const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/prod')(app);

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/validation')();

const port = process.env.PORT || 3000;

app.listen(port, function () {
  winston.info('Server has started successfully');
});
