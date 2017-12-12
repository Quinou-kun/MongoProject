const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  description: String,
  title: String,
  lat: Number,
  lng: Number,
  date: Date,

}, { timestamps: true });


const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
