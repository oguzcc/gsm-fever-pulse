// User model
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    minlength: 1,
    maxlength: 64,
  },
  surname: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    minlength: 1,
    maxlength: 64,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    minlength: 4,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 4,
    maxlength: 255,
  },
  age: {
    type: Number,
    default: 12,
    min: 0,
    max: 120,
  },
  health: [
    {
      fever: {
        type: Number,
        min: 0,
      },
      pulse: {
        type: Number,
        min: 0,
      },
      time: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  // isDoctor: {
  //   type: Boolean,
  //   default: false,
  // },
  // doctor: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Doctor',
  // },
});

patientSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      email: this.email,
      // isDoctor: false,
    },
    process.env.JWT_PRIVATE_KEY,
  );
  return token;
};

const Patient = mongoose.model('Patient', patientSchema);

function validatePatient(patient) {
  const schema = Joi.object({
    name: Joi.string().min(1).max(64).lowercase().trim().required(),
    surname: Joi.string().min(1).max(64).lowercase().trim().required(),
    email: Joi.string().min(4).max(255).lowercase().trim().required().email(),
    password: Joi.string().min(4).max(255).trim().required(),
    health: Joi.array(),
    age: Joi.number().default(12).min(0).max(120),
    // fever: Joi.number().min(0),
    // pulse: Joi.number().min(0),
    // doctor: Joi.string(),
  });

  return schema.validate(patient);
}

exports.Patient = Patient;
exports.validatePatient = validatePatient;
