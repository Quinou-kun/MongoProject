const mongoose = require('mongoose');

const velibSchema = new mongoose.Schema({
  name: String,
  number: Number,
  address: String,
  lat: Number,
  lng: Number,
  open: Boolean,
  details: {
    available: Number,
    free: Number,
    total: Number,
    updated: Number,
  }
}, { timestamps: true });


const Velib = mongoose.model('Velib', velibSchema);

module.exports = Velib;
