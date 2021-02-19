const mongoose = require('mongoose');
const crypto = require('crypto');
const validator = require('validator');
const bcrypt = require('bcrypt');



const userSchema = new mongoose.Schema({
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
        enum: ["male", "female", "other"],
        required: [true, "User must provide their gender"]
    },
    yearOfBirth: {
        type: Date,
        required: [true, "User must provide the year of birth"]
    },
    role: {
        type: String,
        enum: ["volunteer", "ngo-member"],
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

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
  
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
  });
  
  userSchema.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew) return next();
  
    this.passwordChangedAt = Date.now() - 10000;
  
    next();
  });
  
  userSchema.pre(/^find/, function(next) {
    this.find({ active: { $ne: false } });
    next();
  });
  
  userSchema.methods.correctPassword = async function(iputedPassword, userPassword) {
    return await bcrypt.compare(iputedPassword, userPassword);
  };
  
  userSchema.methods.isPasswordChanged = function(jwtiat) {
    if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
      console.log(changedTimestamp);
  
      return changedTimestamp > jwtiat;
    }
    return false;
  };
  
  userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
  
    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
  
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  
    return resetToken;
  };

const User = mongoose.model('User', userSchema);

module.exports = User;