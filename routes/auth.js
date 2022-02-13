const bcrypt = require('bcrypt');
const _ = require('lodash');
const { Patient } = require('../models/patient');
const { Doctor } = require('../models/doctor');
const express = require('express');
const router = express.Router();

// Auth a person
router.post('/', async (req, res) => {
  const doctor = await Doctor.findOne({ email: req.body.email }).select(
    '-password -__v'
  );
  const patient = await Patient.findOne({ email: req.body.email }).select(
    '-password -__v'
  );
  let person;

  if (!doctor && !patient) return res.status(400).send('Invalid email.');

  if (doctor) person = doctor;
  if (patient) person = patient;

  const validPassword = await bcrypt.compare(
    req.body.password,
    person.password
  );
  if (!validPassword) return res.status(400).send('Wrong password.');

  res.send(person);
});

module.exports = router;
