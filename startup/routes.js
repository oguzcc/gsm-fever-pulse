const express = require('express');
const patients = require('../routes/patients');
const doctors = require('../routes/doctors');
const auth = require('../routes/auth');
const error = require('../middleware/error');

module.exports = function (app) {
  app.use(express.json());
  app.use('/api/patients', patients);
  app.use('/api/doctors', doctors);
  app.use('/api/auth', auth);
  app.use(error);
};
