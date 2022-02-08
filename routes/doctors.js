const auth = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');
const { Doctor } = require('../models/doctor');
const express = require('express');
const router = express.Router();

// Get all doctors
router.get('/', [auth], async (req, res) => {
  if (!req.user.isDoctor) return res.status(400).send('Access denied!');
  const doctors = await Doctor.find();
  // .populate('patients', '_id name surname')
  // .select('-__v');

  if (!doctors) return res.status(404).send('Doctors not found.');

  res.send(doctors);
});

// Get a doctor with the given id
router.get('/:id', [auth, validateObjectId], async (req, res) => {
  if (!req.user.isDoctor) return res.status(400).send('Access denied!');

  const doctorId = req.params.id;

  const doctor = await Doctor.find({
    _id: doctorId,
  });
  // .populate('patients', '_id name surname')
  // .select('-__v');

  if (!doctor || doctor.length == 0)
    return res.status(404).send('The doctor with the given Id was not found.');

  res.send(doctor[0]);
});

module.exports = router;
