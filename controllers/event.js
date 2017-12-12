const Event = require('../models/Event');
const http = require('http');
const axios = require('axios');


exports.getAll = (req, res) => {
  Event.find((err, docs) => {

    axios.get('http://www.velostanlib.fr/service/carto').then((response) => {
      res.render('account/map', { title: 'Events', events: docs, velibs: response.data });
    }).catch((error) => {
      console.log(error);
    });

  });
};
