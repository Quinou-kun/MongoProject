const Event = require('../models/Event');
const axios = require('axios');
const parser = require('xml2json');

exports.getAll = (req, res) => {
  Event.find((err, docs) => {
    axios.get('http://www.velostanlib.fr/service/carto').then((response) => {
      res.render('account/map', { title: 'Events', events: docs, velibs: parser.toJson(response.data)});
    }).catch((error) => {
      console.log(error);
    });
  });
};
