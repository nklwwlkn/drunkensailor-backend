const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongooseSchema({
    name: {
        type: String,
        required: [true, "User must have a name"]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "User must have an email"],
        validate: [validator.isEmail, "User must provide a valid email address"]
    },
    gender: {
        type: String,
        enum: ['male, female, other'],
        required: [true, "User must provide their gender"]
    },
    yearOfBirth: {
        type: Date,
        required: [true, "User must provide the year of birth"]
    },
    role: {
        type: String,
        enum: ["volunteer, ngo-member"],
        default: "volunteer"
    },
    interests: {
        type: [String],
        required: [true, "User must choose at least one field they're interested in"] 
    },
    photos: {
        type: [String]
    },
    password: {
        type: String,
        required: [true, 'User must have a password'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'User must confirm a password'],
        validate: {
          validator(confirmPassword) {
            return confirmPassword === this.password;
          },
          message: 'Passwords are not the same'
        }
    },
    passwordChangedAt: {
        type: Date
    }, 
    passwordResetToken: {
        type: String
    },
    passwordResetExpires: {
        type: Date
    },
    active: {
        type: Boolean,
        default: true,
        select: false
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;