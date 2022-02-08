// User model
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
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
  // isDoctor: {
  //   type: Boolean,
  //   default: true,
  // },
  // patients: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'Patient',
  //   },
  // ],
});

doctorSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      email: this.email,
      // isDoctor: true,
    },
    process.env.JWT_PRIVATE_KEY
  );
  return token;
};

const Doctor = mongoose.model('Doctor', doctorSchema);

function validateDoctor(doctor) {
  const schema = Joi.object({
    name: Joi.string().min(1).max(64).lowercase().trim().required(),
    surname: Joi.string().min(1).max(64).lowercase().trim().required(),
    email: Joi.string().min(4).max(255).lowercase().trim().required().email(),
    password: Joi.string().min(4).max(255).trim().required(),
    // patients: Joi.array(),
  });

  return schema.validate(doctor);
}

exports.Doctor = Doctor;
exports.validateDoctor = validateDoctor;
