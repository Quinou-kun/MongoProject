const Parking = require('../models/Parking.js')


exports.viderParking = (req, res) => {
  Parking.remove({}, () => {});
};
