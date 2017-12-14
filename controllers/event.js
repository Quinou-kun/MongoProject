const Event = require('../models/Event');
const axios = require('axios');
const Parking = require('../models/Parking');
const Velib = require('../models/Velib');

exports.dropEvents = (req, res) => {
  Event.remove({}, () => {});
};

exports.getAll = (req, res) => {
  Event.find((err, docs) => {
    res.render('map', {title: 'Events', events: docs});
  });
};
exports.fetch = (req, res) => {
  Parking.find((err, docsParkings) => {
    Velib.find((err, docsVelibs) => {
      res.render('account/map', {
        parkings: docsParkings,
        velibs: docsVelibs
      });
    });
  });
};
