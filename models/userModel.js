const mongoose = require('mongoose');
const crypto = require('crypto');
const validator = require('validator');
const bcrypt = require('bcrypt');



const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "User must have a firstname"]
    },
    lastName: {
      type: String,
      required: [true, "User must have a lastname"]
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
    postalCode: {
      type: String,
      required: [true, "User must provide their postal code"]
    },
    city: {
      type: String,
    },
    //! Убрать
    searchDistance: {
      type: String,
    },
    activities: {
      type: [String],
      validate: {
        validator(ways) {
          let existingWaysToMakeDifference = [
            "supporting & mentoring",
            "teaching & education",
            "healthcare",
            "it & computers",
            "plants & gardening",
            "food preparation & distribution",
            "arts & crafts",
            "music & film",
            "construction & maintenance",
            "sports"];

            let isExists = true;
	            for (let value of ways) {
  	            if (existingWaysToMakeDifference.indexOf(value) === -1) {
    	            isExists = false;
                }
              }
            return isExists;
        },
        message: 'Check ways to make difference you are writing'
      }
    },
    skills: {
      type: [String],
      validate: {
        validator(skills) {
          let existingSkills = [
            "empathy",
            "social skills",
            "medical skills",
            "cooking",
            "communication skills",
            "language",
            "play musical instrument",
            "gardening skills",
            "drawing & Painting",
            "film & Photography",
            "pc skills",
            "programming",
            "physical work",
            "construction skills"];

            let isExists = true;
	            for (let skillsValue of skills) {
  	            if (existingSkills.indexOf(skillsValue) === -1) {
    	            isExists = false;
                }
              }
            return isExists;
        },
        message: 'Check skills you are writing'
      }
    },
    role: {
        type: String,
        enum: ["volunteer"],
        default: "volunteer"
    },
    interests: {
        type: [String],
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
},{
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
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