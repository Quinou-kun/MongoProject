const Velib = require('../models/Velib.js');


exports.dropVelibs = (req, res) => {
  Velib.remove({}, () => {});
};

exports.getAll = (req, res) => {
  Velib.find((err, docs) => {
    res.render('map', { title: 'Velibs', velibs: docs });
  });
};

