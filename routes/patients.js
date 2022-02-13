const bcrypt = require('bcrypt');
const _ = require('lodash');
const { Patient, validatePatient } = require('../models/patient');
const { Doctor } = require('../models/doctor');
const express = require('express');
const router = express.Router();

// Get all patients
router.get('/', async (req, res) => {
  const queryResult = req.query;

  const patients = await Patient.find(queryResult).select('-password -__v');

  if (!patients || patients.length == 0)
    return res.status(404).send('The patient with the given Id was not found.');

  patients.length == 1 ? res.send(patients[0]) : res.send(patients);
});

// Create a new patient
router.post('/create', async (req, res) => {
  const { error } = validatePatient(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let patient = await Patient.findOne({ email: req.body.email }).select(
    '-password -__v'
  );
  if (patient)
    return res.status(400).send('Patient with the given email exists.');

  patient = {};

  patient = new Patient(
    _.pick(req.body, ['name', 'surname', 'email', 'password', 'doctors'])
  );

  bcrypt.hash(patient.password, 10, async function (err, hash) {
    patient.password = hash;
    await patient.save();
    res.send(patient);
  });
});

// Create a random patient
router.get('/random', async (req, res) => {
  const date = Date.now().toString();
  const name = 'name' + date;
  const surname = 'surname' + date;
  const email = name + '@hospital.com';
  const password = date;

  let patient = new Patient({
    name: name,
    surname: surname,
    email: email,
    password: password,
  });

  bcrypt.hash(patient.password, 10, async function (err, hash) {
    patient.password = hash;
    await patient.save();
    res.send(patient);
  });
});

// Assign a doctor to patient
router.patch('/:patientId', async (req, res) => {
  const patient = await Patient.findOne({ _id: req.params.patientId }).select(
    '-password -__v'
  );
  if (!patient)
    return res.status(404).send('The patient with the given id was not found.');

  const doctor = await Doctor.findOne({ _id: req.body.doctorId });
  if (!doctor)
    return res.status(404).send('The doctor with the given id was not found.');

  patient.doctor = doctor._id;
  await patient.save();
  res.send(patient);
});

// Post new health info - temporary
router.post('/', async (req, res) => {
  let patient = await Patient.findOne({
    _id: '6202b4323f2d5fd5ff14e5b2',
  }).select('-password -__v');

  patient.health.push(req.body);

  await patient.save();

  res.send(patient);
});

// Post new health info
router.post('/:email', async (req, res) => {
  let patient = await Patient.findOne({ email: req.params.email }).select(
    '-password -__v'
  );
  if (!patient)
    return res
      .status(404)
      .send('The patient with the given email was not found.');

  patient.health.push(req.body);

  await patient.save();

  res.send(patient);
});

module.exports = router;
