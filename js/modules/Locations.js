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
      lat: '', long: '' },
    { id: '1173', name: 'Itaí',
      city: 'Itaí - SP', kind: 'dc',
      lat: '', long: '' },
    { id: '1182', name: 'Ipuã',
      city: 'Ipuã - MG', kind: 'both',
      lat: '', long: '' },
    { id: '1183', name: 'Uberlândia',
      city: 'Uberlândia - MG', kind: 'plant',
      lat: '', long: '' },
    { id: '1183-BW', name: 'Uberlândia Best Way',
      city: 'Uberlândia - MG', kind: 'dc',
      lat: '', long: '' },
    { id: '1183-CD', name: 'Uberlândia (CD)',
      city: 'Uberlândia - MG', kind: 'dc',
      lat: '', long: '' },
    { id: '1222', name: 'Campo Verde',
      city: 'Campo Verde - MT', kind: 'both',
      lat: '', long: '' },
    { id: '6346', name: 'Carazinho',
      city: 'Carazinho - RS', kind: 'plant',
      lat: '', long: '' }
  ];

  var finder;
  for (var i = 0, len = locations.length; i < len; i++) {
    finder[locations[i].name] = locations[i];
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
