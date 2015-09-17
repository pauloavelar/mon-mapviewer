var Locations = (function() {

  var locations = [
    { id: '1040', name: 'Paracatu',
      city: 'Paracatu - MG', kind: 'plant',
      lat: -16.7442511, long: -47.1044545 },
    { id: '1076', name: 'Santa Helena de Goiás',
      city: 'Santa Helena de Goiás - GO',
      lat: -17.8119748, long: -50.5981252 },
    { id: '1076-CD', name: 'Santa Helena de Goiás (CD)',
      city: 'Santa Helena de Goiás - GO', kind: 'dc',
      lat: -17.8119748, long: -51.5981252 },
    { id: '1171', name: 'Andirá',
      city: 'Andirá - PR', kind: 'both',
      lat: -23.0537463, long: -50.2308332 },
    { id: '1173', name: 'Itaí',
      city: 'Itaí - SP', kind: 'dc',
      lat: -23.4217742, long: -49.0924714 },
    { id: '1182', name: 'Ipuã',
      city: 'Ipuã - MG', kind: 'both',
      lat: -20.4646489, long: -48.010318 },
    { id: '1183', name: 'Uberlândia',
      city: 'Uberlândia - MG', kind: 'plant',
      lat: -18.9485248, long: -48.1499349 },
    { id: '1183-BW', name: 'Uberlândia Best Way',
      city: 'Uberlândia - MG', kind: 'dc',
      lat: -18.6485248, long: -48.3499349 },
    { id: '1183-CD', name: 'Uberlândia (CD)',
      city: 'Uberlândia - MG', kind: 'dc',
      lat: -18.5485248, long: -48.1999349 },
    { id: '1222', name: 'Campo Verde',
      city: 'Campo Verde - MT', kind: 'both',
      lat: -15.6095176, long: -55.1909228 },
    { id: '6346', name: 'Carazinho',
      city: 'Carazinho - RS', kind: 'plant',
      lat: -28.328017, long: -52.7907283 }
  ];

  var finder = {};
  for (var i = 0, len = locations.length; i < len; i++) {
    finder[locations[i].id] = locations[i];
  };

  var fnGetAll = function(id) {
    return locations;
  };

  var fnFindById = function(id) {
    return finder[id];
  };

  return {
    getAll: fnGetAll,
    findById: fnFindById
  };

})();
