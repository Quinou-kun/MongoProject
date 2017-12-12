const User = require('./models/User');
const Event = require('./models/Event');
const Velib = require('./models/Velib');
const axios = require('axios');
const parser = require('xml2json');

const verification = User.find().where('email', 'john.doe@gmail.com').exec((err, docs) => {
  if (docs.length === 0) {
    const user = new User({
      email: 'john.doe@gmail.com',
      password: 'test',

      profile: {
        name: 'John Doe',
        gender: 'Male',
        phone: '0612345678',
        location: '12 Rue de la Libération, Faulx, France',
      }
    });
    user.save();

    axios.get('http://www.velostanlib.fr/service/carto').then((response) => {
      const json = JSON.parse(parser.toJson(response.data));
      const marker = json.carto.markers.marker;
      for (const m in marker) {
        axios.get(`http://www.velostanlib.fr/service/stationdetails/nancy/${marker[m].number}`).then((response) => {
          const json2 = JSON.parse(parser.toJson(response.data));
          const station = json2.station;
          const velib = new Velib({
            name: marker[m].name,
            number: marker[m].number,
            address: marker[m].fullAddress,
            lat: marker[m].lat,
            lng: marker[m].lng,
            open: marker[m].open,
            details: {
              available: station.available,
              free: station.free,
              total: station.total,
              updated: station.updated,
            }
          });
          velib.save();
        }).catch((error) => {
          console.log(error);
        });
      }
    }).catch((error) => {
      console.log(error);
    });

    const event1 = new Event({
      title: 'Concert de David Pujadas',
      description: 'Venez voir le concert en live de David Pujadas feat Johnny !',
      lat: 48.667848,
      lng: 6.154584,
      date: new Date(),
    });
    event1.save();
    const event2 = new Event({
      title: 'Présentation de Christophe Bertrand',
      description: 'Christophe vous présente sa derniere création : MON GROS TROU',
      lat: 48.696451,
      lng: 6.179737,
      date: new Date(),
    });
    event2.save();
    const event3 = new Event({
      title: 'Exposition sur Dali',
      description: 'Exposition sur la vie de Dali et ses oeuvres majeures',
      lat: 48.683023,
      lng: 6.161112,
      date: new Date(),
    });
    event3.save();
  }
});

