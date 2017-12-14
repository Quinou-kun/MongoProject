const Event = require('../models/Event');

exports.dropEvents = (req, res) => {
  Event.remove({}, () => {});
};

exports.getAll = (req, res) => {
  Event.find((err, docs) => {
    res.render('map', { title: 'Events', events: docs });
  });
};
