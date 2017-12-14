const Parking = require('../models/Parking.js');


exports.dropParking = (req, res) => {
  Parking.remove({}, () => {});
};

exports.getAll = () => Parking.find();

exports.fetch = (req, res) => {
  Parking.find((err, docs) => {
    res.send(docs);
  });
};

exports.getAvailable = (req, res) => {
  Parking.find((err, docs) => {
    res.render('map', { title: 'Parkings', availableParkings: docs });
  }).where('details.free', null);
};
