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
    default: 18,
    min: 0,
    max: 120,
  },
  health: [
    {
      fever: {
        type: String,
      },
      pulse: {
        type: String,
      },
      time: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  role: {
    type: String,
    default: 'patient',
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    default: '6206c065f0e90955f20a2463',
  },
});

// patientSchema.methods.generateAuthToken = function () {
//   const token = jwt.sign(
//     {
//       _id: this._id,
//       email: this.email,
//       role: 'doctor',
//     },
//     process.env.JWT_PRIVATE_KEY,
//   );
//   return token;
// };

const Patient = mongoose.model('Patient', patientSchema);

function validatePatient(patient) {
  const schema = Joi.object({
    name: Joi.string().min(1).max(64).lowercase().trim().required(),
    surname: Joi.string().min(1).max(64).lowercase().trim().required(),
    email: Joi.string().min(4).max(255).lowercase().trim().required().email(),
    password: Joi.string().min(4).max(255).trim().required(),
    age: Joi.number().default(18).min(0).max(120),
    health: Joi.array(),
    fever: Joi.number().min(0),
    pulse: Joi.number().min(0),
    role: Joi.string().default('6206c065f0e90955f20a2463'),
  });

  return schema.validate(patient);
}

exports.Patient = Patient;
exports.validatePatient = validatePatient;
