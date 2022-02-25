const { Doctor, validateDoctor } = require('../models/doctor');
const { Patient } = require('../models/patient');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const express = require('express');
const router = express.Router();

// Get all doctors
router.get('/', async (req, res) => {
  const queryResult = req.query;
  const doctors = await Doctor.find(queryResult).select('-password -__v');
  if (!doctors || doctors.length == 0)
    return res.status(404).send('The doctor with the given Id was not found.');

  doctors.length == 1 ? res.send(doctors[0]) : res.send(doctors);

  res.send(doctors);
});

// Create a new doctor
router.post('/create', async (req, res) => {
  const { error } = validateDoctor(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let doctor = await Doctor.findOne({ email: req.body.email }).select(
    '-password -__v'
  );
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

// // Add a patient to doctor deprecated
// router.patch('/:doctorId', async (req, res) => {
//   const doctor = await Doctor.findOne({ _id: req.params.doctorId }).select(
//     '-password -__v'
//   );
//   if (!doctor)
//     return res.status(404).send('The doctor with the given id was not found.');

//   const patient = await Patient.findOne({ _id: req.body.patientId });
//   if (!patient)
//     return res.status(404).send('The patient with the given id was not found.');

//   if (doctor.patients.includes(patient._id))
//     return res.status(400).send('This patient is already in the doctor list.');

//   doctor.patients.push(patient._id);
//   await doctor.save();
//   res.send(doctor);
// });

module.exports = router;
