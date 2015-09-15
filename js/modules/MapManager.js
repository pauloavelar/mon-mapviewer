$(document).ready(function() {
  var map = L.map('map').setView([-15, -55], 4);

  var markers = {
    red:  L.icon({ iconUrl: 'marker.png', iconRetinaUrl: 'marker.png' }),
    blue: L.icon({ iconUrl: 'marker.png', iconRetinaUrl: 'marker.png' })
  };

  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
});
