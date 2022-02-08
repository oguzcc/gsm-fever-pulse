const bcrypt = require('bcrypt');
const { Patient, validatePatient } = require('../models/patient');
const { Doctor, validateDoctor } = require('../models/doctor');
const express = require('express');
const router = express.Router();

// Auth a patient
router.post('/patients', [], async (req, res) => {
  const patient = await Patient.findOne({ email: req.body.email });
  if (!patient) return res.status(400).send('Invalid email.');

  const validPassword = await bcrypt.compare(
    req.body.password,
    patient.password
  );
  if (!validPassword) return res.status(400).send('Wrong password.');

  const token = patient.generateAuthToken();
  res.header('x-auth-token', token).send(patient);
});

// Auth a doctor
router.post('/doctors', [], async (req, res) => {
  const doctor = await Doctor.findOne({ email: req.body.email });
  if (!doctor) return res.status(400).send('Invalid email.');

  const validPassword = await bcrypt.compare(
    req.body.password,
    doctor.password
  );
  if (!validPassword) return res.status(400).send('Wrong password.');

  const token = doctor.generateAuthToken();
  res.header('x-auth-token', token).send(doctor);
});

// Create a new patient
router.post('/createPatient', [], async (req, res) => {
  const { error } = validatePatient(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let patient = await Patient.findOne({ email: req.body.email });
  if (patient)
    return res.status(400).send('Patient with the given email exists.');

  patient = {};

  patient = new Patient(
    _.pick(req.body, ['name', 'surname', 'email', 'password', 'doctor'])
  );

  bcrypt.hash(patient.password, 10, async function (err, hash) {
    patient.password = hash;
    await patient.save();
    res.send(patient);
  });
});

// Create a new doctor
router.post('/createDoctor', [], async (req, res) => {
  const { error } = validateDoctor(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let doctor = await Doctor.findOne({ email: req.body.email });
  if (doctor)
    return res.status(400).send('Doctor with the given email exists.');

  doctor = {};

  doctor = new Doctor(
    _.pick(req.body, ['name', 'surname', 'email', 'password', 'patients'])
  );

  bcrypt.hash(doctor.password, 10, async function (err, hash) {
    doctor.password = hash;
    await doctor.save();
    res.send(doctor);
  });
});

module.exports = router;
