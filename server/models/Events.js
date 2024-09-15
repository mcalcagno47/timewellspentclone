const { Schema, model } = require('mongoose');

// This is a subdocument schema, it won't become its own model but we'll use it as the schema for the User's `savedBooks` array in User.js
const eventSchema = new Schema({
  title: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },

  image: {
    type: String,
    default: "https://static.vecteezy.com/system/resources/previews/001/880/049/non_2x/volunteers-collecting-donations-for-charity-free-vector.jpg"
  },
  date: {
    type: String,
    required: false,
  },
  time: {
    type: String,
  },
  address: {
    type: String,
    required: false,
  },
  savedCharity: {
    type: String,
    required: false,
  },
  
});

const Event = model('Event', eventSchema);

module.exports = Event;
