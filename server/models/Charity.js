const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');
// const eventSchema = require('./Events')
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Must use a valid email address'],
    },
    savedEvents:[{
      type: Schema.Types.ObjectId,
      ref: "Event"
    }],
    websiteURL: {
      type: String,
      required: true,
      match: [/^(?:(?:https?|ftp):\/\/)?(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/, 'Must be a valid website']
    },
    description: {
      type: String,
    },
    address: {
      type: String,
    },
    facebook: {
      type: String,
      match: [/^(?:(?:https?|ftp):\/\/)?(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/, 'Must be a valid website']
    },
    instagram: {
      type: String,
      match: [/^(?:(?:https?|ftp):\/\/)?(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/, 'Must be a valid website']
    },
    twitter: {
      type: String,
      match: [/^(?:(?:https?|ftp):\/\/)?(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/, 'Must be a valid website']
    },
    phoneNumber: {
      type: String,
    },
    charityName: {
      type: String,
      // required: true
    },
    image:{
      type: String,
      default:"https://static.vecteezy.com/system/resources/previews/001/880/049/non_2x/volunteers-collecting-donations-for-charity-free-vector.jpg"
    },
    isCharity: {
      type: Boolean,
      required: false
    },
   },
  // set this to use virtual below
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// hash user password
userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

// custom method to compare and validate password for logging in
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// when we query a user, we'll also get another field called `bookCount` with the number of saved books we have


const Charity = model('Charity', userSchema);

module.exports = Charity;
