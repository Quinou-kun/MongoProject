const mongoose = require('mongoose');

const parkingSchema = new mongoose.Schema({
  name: String,
  address: String,
  lat: Number,
  lng: Number,
  details: {
    free: Number,
    total: Number,
    updated: Date
  }
}, { timestamps: true });


// si free == null => parking fermé

const Parking = mongoose.model('Parking', parkingSchema);

module.exports = Parking;
