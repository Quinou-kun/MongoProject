const Event = require('../models/Event');
const Parking = require('../models/Parking.js')
const Velib = require('../models/Velib.js')



exports.map = (req, res) => {
    res.render('account/map', {title : 'map'});
};

exports.getAll = (req, res) => {
	let events;
	let velibs;
	let parkings;
   Event.find((err, docs) => {
	events = docs;
	Parking.find((err, dacs) => {
		parkings = dacs;
		   Velib.find((err, ducs) => {
				velibs = ducs;
				res.render('account/map2', {title : 'Map',"events": events,"velibs": velibs,"parkings": parkings});
			});
		});
    });	
};
