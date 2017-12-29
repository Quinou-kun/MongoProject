const eventController = require('../controllers/event');
const parkingController = require('../controllers/parking');
const velibController = require('../controllers/velib');


exports.getAll = (req, res) => {
  parkingController.fetch();
  res.render('map', { title: 'Parkings' });
};

