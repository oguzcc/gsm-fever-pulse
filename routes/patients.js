const auth = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');
const { Patient } = require('../models/patient');
const express = require('express');
const router = express.Router();

// Get all patients
router.get('/', [auth], async (req, res) => {
  // if (!req.user.isDoctor) return res.status(400).send('Access denied!');
  const queryResult = await req.query;

  const patients = await Patient.find(queryResult);
  // .populate('doctor', '_id name surname')
  // .select('-__v');

  if (!patients || patients.length == 0)
    return res.status(404).send('The patient with the given Id was not found.');

  patients.length == 1 ? res.send(patients[0]) : res.send(patients);
});

// Post new health info - temporary
router.post('/', async (req, res) => {
  let patient = await Patient.findOne({ _id: '6202b11adde5f1c2a0835ba2' });

  patient.health.push(req.body);

  await patient.save();

  res.send(patient);
});

router.get('/new', async (req, res) => {
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
    health: [],
  });

  // patient.password = await bcrypt.hash(password, salt);
  await patient.save();

  result = await Patient.findById(patient._id);

  res.send(result);
});

// Post new health info
router.put('/:id', [auth, validateObjectId], async (req, res) => {
  let patient = await Patient.findOne({ _id: req.params.id });
  if (!patient)
    return res.status(404).send('The patient with the given id was not found.');

  patient.health.push(req.body);

  await patient.save();

  res.send(patient);
});

module.exports = router;
