/* eslint-disable func-names */
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
 {
    title: {
        type: String,
        required: [true, 'A project must have a title'],
        unique: true,
      },
      contactPersonName: {
          type: String
      },
      ngo: {
        type: mongoose.Schema.ObjectId,
        ref: 'Ngo',
        required: [true, 'Project must belong to a NGO']
      },
      contactPersonEmail: {
          type: String
      },
      numberOfVolunteers: {
          type: String
      },
      description: {
          type: String
      },
      locationType: {
          type: String
      },
      companyName: {
        type: String
      },
      city: {
        type: String
      },
      streetAddress: {
        type: String
      },
      postalCode: {
        type: String
      },
      weekdays: {
        type: [String]
      },
      startDate: {
        type: Date,
      },
      endDate: {
        type: Date
      },
      startTime: {
        //!It should NOT be a string.
        type: String
      },
      //!It should NOT be a string.
      endTime: {
        type: String
      },
      requirements: {
        type: [String],
        validate: {
            validator(requirements) {
              let existingRequirements = [
                "programming",
                "pc skills",
                "film & photography",
                "drawing & painting",
                "physical work",
                "construction skills",
                "play musical instrument",
                "gardening skills",
                "communication skills",
                "language",
                "cooking",
                "medical skills"
                ];
                
                let isExists = true;
                    for (let value of requirements) {
                      if (existingRequirements.indexOf(value) === -1) {
                        isExists = false;
                    }
                  }
                return isExists;
            },
            message: 'Check requirements you are writing'
          }
      },
      images: Array,
      CreatedAt: {
        type: Date,
        default: Date.now()
      },
 },
 {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
 }
);

projectSchema.index({ location: '2dsphere' })

projectSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'ngo',
    select: 'name'
  });
  next();
});


const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
