const mongoose = require('mongoose');
const AttemptSchema = require('./attemptSchema');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true
  },
  birthdate: {
    type: Date,
    required: true
  },
  password: {
    type: String,
    required: true,
    minlength: 1
  },
  createdQuizzes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz'
  }],
  attemptedQuizzes: [AttemptSchema]
});

module.exports = mongoose.model('User', userSchema);
