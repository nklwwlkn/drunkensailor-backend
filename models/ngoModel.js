const mongoose = require('mongoose');
const crypto = require('crypto');
const validator = require('validator');
const bcrypt = require('bcrypt');


const ngoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Ngo must have a name"]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Ngo must have an email"],
        validate: [validator.isEmail, "User must provide a valid email address"]
    },
    description: {
        type: String,
        required: [true, "Ngo must have a description"]
    },
    websiteUrl: {
        type: String
    },
    supportedCauses: {
        type: [String],
        validate: {
            validator(causes) {
                let existingCauses = [
                    "animals",
                    "arts and culture",
                    "climate",
                    "conservation",
                    "community development",
                    "education",
                    "equality",
                    "energy",
                    "family",
                    "food",
                    "health",
                    "homeless",
                    "jobs",
                    "peace & justice",
                    "refugees"
                ];

                let isExists = true;
	                for (let value of causes) {
  	                    if (existingCauses.indexOf(value) === -1) {
    	                    isExists = false;
                        }
                    }
            return isExists;
            },
        message: 'Check supported causes you are writing'
        }

    },
    role: {
        type: String,
        enum: ["ngo-member"],
        default: "ngo-member"
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

ngoSchema.virtual('projects', {
  ref: 'Project',
  foreignField: 'ngo',
  localField: '_id'
});

ngoSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
  
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
  });
  
ngoSchema.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew) return next();
  
    this.passwordChangedAt = Date.now() - 10000;
  
    next();
  });
  
ngoSchema.pre(/^find/, function(next) {
    this.find({ active: { $ne: false } });
    next();
  });
  
ngoSchema.methods.correctPassword = async function(iputedPassword, userPassword) {
    return await bcrypt.compare(iputedPassword, userPassword);
  };
  
ngoSchema.methods.isPasswordChanged = function(jwtiat) {
    if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
      console.log(changedTimestamp);
  
      return changedTimestamp > jwtiat;
    }
    return false;
  };
  
ngoSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
  
    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
  
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  
    return resetToken;
  };

const Ngo = mongoose.model('Ngo', ngoSchema);

module.exports = Ngo;