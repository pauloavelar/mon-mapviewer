var MapManager = (function() {

  var mMap;

  var IconTemplate = L.Icon.extend({
    options: {
      iconSize: [20, 30],
      iconAnchor: [10, 29],
      popupAnchor: [0, -32]
    }
  });

  var icons = {
    dc: new IconTemplate({ iconUrl: 'img/marker-dc.png' }),
    plant: new IconTemplate({ iconUrl: 'img/marker-plant.png' }),
    both: new IconTemplate({ iconUrl: 'img/marker-both.png' }),
  };

  var fnBind = function(map) {
    mMap = map;
  };

  var fnLoad = function(options) {
    // fetches locations

    // create line matrix
    // iterate csv
      // check filters
      // set width and color in matrix
    // call plotMap
  };

  var fnPlot = function(lines) {
    var minW, maxW, minC, maxC;
    var currW, currC;

    // gets minimum and maximum values for width and color
    Utils.iterate2D(lines, function(item, outerProp, innerProp) {
      if (!minW || minW > item.width) minW = item.width;
      if (!maxW || maxW < item.width) maxW = item.width;

      if (!minC || minC > item.color) minC = item.color;
      if (!maxC || maxC < item.color) maxC = item.color;
    });

    var props = Utils.getAllProperties(lines, 1);
    var locations = Utils.makeUniqueArray(props);

    locations.forEach(function(id) {
      var location = Locations.findById(id);
      fnAddMarker({
        latitude: location.lat,
        longitude: location.long,
        kind: location.kind,
        title: location.name
      });
    });

    // get min and max values for width and color
    // iterate matrix and plot each line
    // iterate markers and plot each marker
  };

  var fnAddMarker = function(details) {
    L.marker([details.latitude, details.longitude], {
      icon: icons[details.kind],
      title: details.title
    }).addTo(mMap).bindPopup(details.title);
  };

  var fnAddLine = function(details) {
    L.
  };

  return {
    bind: fnBind,
    load: fnLoad,
    plot: fnPlot,
    addMarker: fnAddMarker
  };

})();
