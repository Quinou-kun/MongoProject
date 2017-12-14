const Ad = require('../models/Ad');


exports.map = (req, res) => {
  res.render('account/map', { title: 'map' });
};

exports.getAll = (req, res) => {
  Ad.find((err, docs) => {
    res.render('account/map', { title: 'Map', ads: docs });
  }).sort({ createdAt: -1 });
};

