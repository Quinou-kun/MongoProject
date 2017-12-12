const User = require('./models/User');
const Event = require('./models/Event');
const Velib = require('./models/Velib');
const Parking = require('./models/Parking');
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

    axios.get('https://geoservices.grand-nancy.org/arcgis/rest/services/public/' +
        'VOIRIE_Parking/MapServer/0/query?where=1%3D1&text=&objectIds=&time=&geometry=' +
        '&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relation' +
        'Param=&outFields=*&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=4326&' +
        'returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics' +
        '=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&f=pjson').then((response) => {
      for (const park in response.data.features) {
        const attributes = response.data.features[park].attributes;
        const geometry = response.data.features[park].geometry;
        const parking = new Parking({
          name: attributes.NOM,
          address: attributes.ADRESSE,
          lat: geometry.x,
          lng: geometry.y,
          details: {
            free: attributes.PLACES,
            total: attributes.CAPACITE,
            updated: attributes.DATE_MAJ
          }
        });
        parking.save();
      }
    });


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
    const event4 = new Event({
      title: 'Ta maman en maillot de bain !',
      description: 'Exposition des photos de ta maman en maillot de bain !',
      lat: 48.660,
      lng: 6.25,
      date: new Date(),
    });
    event4.save();
    const event5 = new Event({
      title: 'Portes ouvertes chez Papie',
      description: 'Vous pourrez découvrir la maison de Papie !',
      lat: 48.69,
      lng: 6.20,
      date: new Date(),
    });
    event5.save();
  }
});

