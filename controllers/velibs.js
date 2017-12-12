const Parking = require('../models/Parking.js')


exports.viderVelibs= (req, res) => {
  Parking.remove({}, () => {});
};
