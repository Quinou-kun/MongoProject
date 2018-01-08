const Velib = require('../models/Velib.js')


exports.viderVelibs= (req, res) => {
  Velib.remove({}, () => {});
};
